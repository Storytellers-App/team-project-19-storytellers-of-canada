import React, { useContext, useEffect, useState } from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { AntDesign, FontAwesome } from "@expo/vector-icons";

import styles from './styles';
import { StoryType } from "../../types";
import { Sound } from "expo-av/build/Audio/Sound";

import { AppContext } from '../../AppContext';

let loading = true;
let replay = false;
const BottomPlayer = () => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [soundPlaying, setSoundPlaying] = useState<boolean>(false);

  const { story, position, setPosition, isPlaying, setIsPlaying, isSeekingComplete , setIsSeekingComplete} = useContext(AppContext);

  
  const onPlaybackStatusUpdate = (status) => {
    replay = false;
    setSoundPlaying(status.isPlaying);
    setDuration(status.durationMillis);
    setPosition(status.positionMillis);
    if (status.didJustFinish) {
      replay = true;
      setIsPlaying(status.isPlaying);
      
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
    if(isSeekingComplete){
      sound?.setPositionAsync(position);
      setIsSeekingComplete(false);
    }
  }), [isSeekingComplete]

  const toggleAudio = async () => {
    if (!sound || loading) {
      return;
    }
    if(replay){
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

  const getProgress = () => {
    if (sound === null || duration === null || position === null) {
      return 0;
    }
    return (position / duration) * 100;

  }

  if (!story) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.progress, { width: `${getProgress()}%` }]} />
      <View style={styles.row}>
        {story.image != undefined && story.image != null ? <Image source={{ uri: story.image === null ? undefined : story.image }} style={styles.image} /> : null}
        <View style={styles.rightContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.title}>{story.title}</Text>
            <Text style={styles.artist}>{story.creator}</Text>
          </View>
          <View style={styles.iconsContainer}>
            <AntDesign name="hearto" size={30} color={"white"} />
            <TouchableOpacity onPress={onPlayPausePress}>
              <FontAwesome name={isPlaying ? 'pause' : 'play'} size={30} color={"white"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default BottomPlayer;