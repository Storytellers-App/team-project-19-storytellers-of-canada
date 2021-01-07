import React, { useContext, useEffect, useState } from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { AntDesign, FontAwesome } from "@expo/vector-icons";

import styles from './styles';
import { Sound } from "expo-av/build/Audio/Sound";
import { RootStackParamList, ResponseType } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppContext } from '../../AppContext';
import TextTicker from 'react-native-text-ticker';

let loading = true;
const BottomPlayer = () => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [soundPlaying, setSoundPlaying] = useState<boolean>(false);
  const [ replay, setIsReplay] = useState<boolean>(false);

  const {fullStoryType, story, setStory, position, setPosition, isPlaying, setIsPlaying, isSeekingComplete, setIsSeekingComplete, isRadioPlaying } = useContext(AppContext);


  const onPlaybackStatusUpdate = (status) => {
    setSoundPlaying(status.isPlaying);
    setDuration(status.durationMillis);
    setPosition(status.positionMillis);
    if (status.didJustFinish) {
      setIsReplay(true);
      setIsPlaying(false);
    }
  }

  const playCurrentSong = async () => {
    loading = true;
    if (sound) {
      await sound.pauseAsync();
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Sound.createAsync(
      { uri: story.recording },
      { shouldPlay: false, positionMillis: position, isLooping: false },
      onPlaybackStatusUpdate
    )
    setSound(newSound)
    loading = false;
    setIsPlaying(true);
  }

  useEffect(() => {
    if (story) {
      playCurrentSong();
    }
  }, [story])

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
            <TouchableOpacity onPress={onPlayPausePress}>
              <FontAwesome name={isPlaying ? 'pause' : 'play'} size={25} color={"white"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
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