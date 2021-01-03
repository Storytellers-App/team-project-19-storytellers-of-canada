import React, {useContext, useEffect, useState} from 'react';
import {Text, Image, View, TouchableOpacity} from 'react-native';
import { AntDesign, FontAwesome } from "@expo/vector-icons";

import styles from './styles';
import {StoryType} from "../../types";
import {Sound} from "expo-av/build/Audio/Sound";

import { AppContext } from '../../AppContext';

const BottomPlayer = () => {
  const [sound, setSound] = useState<Sound|null>(null);
  const [duration, setDuration] = useState<number|null>(null);

  const {story, position, setPosition, isPlaying, setIsPlaying} = useContext(AppContext);

  const onPlaybackStatusUpdate = (status) => {
    setDuration(status.durationMillis);
    setPosition(status.positionMillis);
  }

  const playCurrentSong = async () => {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Sound.createAsync(
      { uri: story.recording },
      { shouldPlay: isPlaying },
      onPlaybackStatusUpdate
    )

    setSound(newSound)
  }

  useEffect(() => {
    console.log(story);
    if (story) {
      playCurrentSong();
    }
  }, [story])

  useEffect( () => {
    const toggleAudio = async () => {
      if (!sound) {
        return;
      }
      if (!isPlaying) {
        await sound.stopAsync();
      } else {
        await sound.playAsync();
      }
    }
    toggleAudio();
  }), [isPlaying]


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
    return <Text>Empty Player</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.progress, { width: `${getProgress()}%`}]} />
      <View style={styles.row}>
        <Image source={{ uri: story.image === null ? undefined : story.image}} style={styles.image} />
        <View style={styles.rightContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.title}>{story.title}</Text>
            <Text style={styles.artist}>{story.creator}</Text>
          </View>

          <View style={styles.iconsContainer}>
            <AntDesign name="hearto" size={30} color={"white"}/>
            <TouchableOpacity onPress={onPlayPausePress}>
              <FontAwesome name={isPlaying ? 'pause' : 'play'} size={30} color={"white"}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default BottomPlayer;