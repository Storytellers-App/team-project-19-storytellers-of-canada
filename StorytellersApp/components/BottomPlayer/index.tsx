import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Sound } from "expo-av/build/Audio/Sound";
import { Audio } from 'expo-av';
import React, { useContext, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import TextTicker from 'react-native-text-ticker';
import { AppContext } from '../../AppContext';
import { ResponseType, RootStackParamList } from '../../types';
import styles from './styles';


let loading = true;
let closed = true;
function StopAudio({ sound }: { sound: Audio.Sound | null }) {
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound && sound?._loaded && closed) {
          sound?.stopAsync()
        }
      };
    }, [sound])
  );
  return null;
}
const BottomPlayer = () => {
  const [sound, setSound] = useState<Sound | null>(null);
 
  const [duration, setDuration] = useState<number | null>(null);
  const [soundPlaying, setSoundPlaying] = useState<boolean>(false);
  const [replay, setIsReplay] = useState<boolean>(false);

  const { fullStoryType, story, setStory, position, setPosition, isPlaying, setIsPlaying, isSeekingComplete, setIsSeekingComplete, isRadioPlaying } = useContext(AppContext);
  

  const onPlaybackStatusUpdate = (status) => {
    if(!closed){
    try{
    setSoundPlaying(status.isPlaying);
    setDuration(status.durationMillis);
    setPosition(status.positionMillis);
    if (status.didJustFinish) {
      setIsReplay(true);
      setIsPlaying(false);
    }
  }
  catch (error){
    console.log(error)
  };
}
  }

  const playCurrentSong = async () => {
    
    loading = true;
    if (sound) {
      await sound.pauseAsync();
      await sound.unloadAsync();
    }
    if (story === null || story.recording === null) {
      return;
    }
    const { sound: newSound } = await Sound.createAsync(
      { uri: story.recording },
      { shouldPlay: false, positionMillis: position, isLooping: false },
      onPlaybackStatusUpdate
    )
    setSound(newSound)
    loading = false;
    setIsPlaying(!closed);
  }

  useEffect(() => {
    if (story) {
      closed = false;
      playCurrentSong();
    }
  }, [story])

  

  useEffect(()=> {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS : true
    })
    return () => {
      closed = true
    }
  }, [])

  useEffect(() => {
    if (isPlaying != soundPlaying) {
      toggleAudio();
    }
  }), [isPlaying]

  useEffect(() => {
    if (isSeekingComplete) {
      sound?.setPositionAsync(position);
      setIsSeekingComplete(false);
    }
  }), [isSeekingComplete]

  const toggleAudio = async () => {
    
    if (!sound || loading) {
      return;
    }
    if (replay) {
      setIsReplay(false);
      await sound.replayAsync();
    }
    else if (soundPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  }
  const onPlayPausePress = async () => {
    setIsPlaying(!isPlaying);
  }
  const onClose = async () => {
    closed = true;
    setIsPlaying(false);
    setStory(null);
  }

  const getProgress = () => {
    if (sound === null || duration === null || position === null) {
      return 0;
    }
    return (position / duration) * 100;

  }
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const responseScreen = (header: ResponseType) => {
    navigation.push("StoryResponse", { 'header': header });
  }

  if (!story || isRadioPlaying) {
    return null;
  }
  return (
    <TouchableOpacity onPress={() => { responseScreen(fullStoryType) }}>
      <StopAudio sound={sound}></StopAudio>
      <View style={styles.container}>
        <View style={[styles.progress, { width: `${getProgress()}%` }]} />
        <View style={styles.row}>
          {story.image != undefined && story.image != null && story.image != "" ?
            <Image resizeMode={"contain"} source={{ uri: story.image }} style={styles.image} /> :
            <Image style={styles.image}
              source={require('../../assets/images/SCCC_logo.png')} resizeMode={"contain"} />}
          <View style={styles.rightContainer}>
            <View style={styles.nameContainer}>
              <TextTicker style={styles.title}
                duration={3000}
                loop
                bounce
                repeatSpacer={25}
                marqueeDelay={2000}>
                {story.title
                }</TextTicker>
              <TextTicker style={styles.artist}
                duration={3000}
                loop
                bounce
                repeatSpacer={25}
                marqueeDelay={2000}>
                {story.creator}
              </TextTicker>
            </View>
            <View style={styles.iconsContainer}>
              <TouchableOpacity onPress={onPlayPausePress} hitSlop={{top: 20, bottom: 20, left: 50, right: 10}}>
                <FontAwesome name={isPlaying ? 'pause' : 'play'} size={25} color={"white"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} hitSlop={{top: 20, bottom: 20, left: 10, right: 20}}>
                <AntDesign name="close" size={28} color={"white"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default BottomPlayer;