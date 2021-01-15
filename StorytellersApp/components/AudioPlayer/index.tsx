import { Entypo, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Sound } from 'expo-av/build/Audio/Sound';
import React, { memo, useContext, useEffect, useState } from 'react';
import {
    Text, TouchableOpacity,
    View
} from "react-native";
import { AppContext } from '../../AppContext';
import { currentStory, StorySaveType, StoryType, UserStoryType } from '../../types';
import styles from './styles';


export type AudioPlayerProps = {
    newStory: StoryType,
}
let skipPositionUpdates = 5; //mildly sketchy way to minimize progress bar jumping when switching stories
let isSeeking = false;
let prevPlayingValue = false;
const AudioPlayer = ({ newStory }: AudioPlayerProps) => {
   

    const { setFullStoryType, story, position, setPosition, isPlaying, setIsPlaying, setStory, setIsSeekingComplete, setIsRadioPlaying } = useContext(AppContext);
    const [currPosition, setCurrPosition] = useState<number>(0);
    const [currDuration, setCurrDuration] = useState<number | null>(null);
    let mounted = false;
    useEffect(() => {
        mounted = true;
        //Should only run once per player. Temporarily loads file to allow me to display duration
        const getDurationFromFile = async () => {
            if (currDuration == null || currDuration === undefined) {
                const { sound: newSound } = await Sound.createAsync(
                    { uri: newStory.recording },
                    { shouldPlay: false, isLooping: false },
                )
                const status = await newSound.getStatusAsync();
                if(mounted){setCurrDuration(status["durationMillis"])};
                newSound.unloadAsync();
            }
        }
        getDurationFromFile();
    }, []);
    useEffect( () => () => { mounted = false}, [] );
    useEffect(() => {
        if (story === null || story.id != newStory.id.toString() || isSeeking) {
            return;
        }
        if (skipPositionUpdates > 0) {
            skipPositionUpdates--;
            return;
        }
        setCurrPosition(position);
    }), [position]

    const toggleAudio = () => {
        setIsRadioPlaying(false);
        if (story != null && story.id === newStory.id.toString()) {
            setIsPlaying(!isPlaying);
        }
        else {
            skipPositionUpdates = 5;
            let creator = (newStory as UserStoryType).user ? (newStory as UserStoryType).user.name :
                (newStory as StorySaveType).author;
            let changedStory = {
                recording: newStory.recording, image: newStory.image,
                creator: creator, title: newStory.title,
                isLiked: newStory.isLiked, id: newStory.id.toString()
            } as currentStory;
            setPosition(currPosition);
            setStory(changedStory);
            setFullStoryType(newStory);
        }
    }
    const getSeekSliderPosition = () => {
        if (currPosition === undefined || currPosition === null || currDuration === undefined || currDuration === null) {
            return 0;
        }
        return currPosition / currDuration;
    }

    const onSeekSliderValueChange = (value: number) => {
        const seekPosition = value * (currDuration || 0);
        setCurrPosition(seekPosition);
        if (!isSeeking) {
            isSeeking = true;
            if (story === null || story.id != newStory.id.toString()) {
                return;
            }
            prevPlayingValue = isPlaying;
            setIsPlaying(false);
        }
    };

    const onSeekSliderSlidingComplete = async (value: number) => {
        isSeeking = false;
        const seekPosition = value * (currDuration || 0);
        setCurrPosition(seekPosition);
        if (story === null || story.id != newStory.id.toString()) {
            return;
        }
        await setPosition(seekPosition);
        await setIsSeekingComplete(true);
        await setIsPlaying(prevPlayingValue);
    };

    const getMMSSFromMillis = (millis: number) => {
        const totalSeconds = millis / 1000;
        const seconds = Math.floor(totalSeconds % 60);
        const minutes = Math.floor(totalSeconds / 60);

        const padWithZero = (number: number) => {
            const string = number.toString();
            if (number < 10) {
                return "0" + string;
            }
            return string;
        };
        return padWithZero(minutes) + ":" + padWithZero(seconds);
    }

    //   const getPlaybackTimestamp = () =>{
    //     if (
    //       currPosition != null &&
    //       currDuration != null
    //     ) {
    //       return `${getMMSSFromMillis(
    //         currPosition
    //       )} / ${getMMSSFromMillis(currDuration)}`;
    //     }
    //     return "";
    //   }
    const getPlaybackTimestamp = () => {
        if (
            currPosition != null &&
            currDuration != null
        ) {
            return `${getMMSSFromMillis(
                currPosition
            )}`;
        }
        return "";
    }

    const getDurationTimestamp = () => {
        if (
            currPosition != null &&
            currDuration != null
        ) {
            return `${getMMSSFromMillis(currDuration)}`;
        }
        return "";
    }

    return (


        <View style={{
            flex: 0,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            paddingLeft: 8,
            paddingRight: 8,
        }}>
            <View style={{
                flex: 0,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 8,
                paddingRight: 8,
                height: 35
            }}>
                <TouchableOpacity onPress={toggleAudio} hitSlop={{ top: 30, bottom: 60, left: 40, right: 10 }}>
                    {story != null && story.id === newStory.id.toString() && isPlaying ? <MaterialIcons name="pause" size={30} color="black" />
                        :
                        <Entypo name="controller-play" size={30} color="black" />
                    }
                </TouchableOpacity>
                <View style={styles.playbackContainer}>
                    <Slider
                        style={styles.playbackSlider}
                        value={getSeekSliderPosition()}
                        onValueChange={onSeekSliderValueChange}
                        onSlidingComplete={onSeekSliderSlidingComplete}
                    />
                </View>
            </View>
            <View style={{
                flex: 0,
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                <Text>{getPlaybackTimestamp()}</Text>
                <Text>{getDurationTimestamp()}</Text>
            </View>
        </View>


    )
}
export default memo(AudioPlayer);