import React, { useEffect } from 'react';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import {
    TouchableOpacity,
    Animated,
    PanResponder,
    View,
    Easing,
    Text
} from "react-native";
import { memo, useContext, useState } from 'react';
import { AppContext } from '../../AppContext';
import {StoryType, UserStoryType, StorySaveType, currentStory} from '../../types';

export type AudioPlayerProps = {
    newStory: StoryType,
}

const AudioPlayer = ({ newStory }: AudioPlayerProps) => {
    
const {story, position, setPosition, isPlaying, setIsPlaying, setStory} = useContext(AppContext);
const [currPosition, setCurrPosition] = useState<number>(0);
const [currDuration, setCurrDuration] = useState<number>(0);
useEffect( () => {
   if(story === null || story.id != newStory.id.toString()){
       return;
   }
   setCurrPosition(position);
  }), [position]

const toggleAudio = () => {
        if(story != null && story.id === newStory.id.toString()){
            setIsPlaying(!isPlaying);
        }
        else{
            let creator = (newStory as UserStoryType).user.name ? (newStory as UserStoryType).user.name :
            (newStory as StorySaveType).author;
            let changedStory = {recording: newStory.recording, image: newStory.image,
                creator: creator, title: newStory.title,
                isLiked: newStory.isLiked, id: newStory.id.toString()} as currentStory;
            setPosition(currPosition);
            setStory(changedStory);
        }
}
return (
    <TouchableOpacity onPress={toggleAudio}>
        { story != null && story.id === newStory.id.toString() && isPlaying ? <MaterialIcons name="pause" size={30} color="black" />
        :
        <Entypo name="controller-play" size={30} color="black" />
        }
    <Text>{currPosition === undefined || currPosition === null ? 0 : currPosition.toString()}</Text>
    </TouchableOpacity>
)
}
export default AudioPlayer;