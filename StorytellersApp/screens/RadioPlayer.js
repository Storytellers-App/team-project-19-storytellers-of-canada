import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableWithoutFeedback, LogBox } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { Audio } from 'expo-av';
import { throwIfAudioIsDisabled } from 'expo-av/build/Audio/AudioAvailability';

export default class RadioPlayer extends React.Component {


    constructor() {
        super();
        this.state = {
            sound: new Audio.Sound(),
            audioState: 'notLoaded'
        };
    }

    _onPlaybackStatusUpdate = playbackStatus => {
        if (!playbackStatus.isLoaded) {
            // Not loaded
            if (playbackStatus.error) {
                // Update the state
                this.setState((state) => {
                    return {audioState: 'errorLoading'}
                });
                // TODO: Show an error because it isn't loading
            }
        } else {
            if (playbackStatus.isPlaying) {                
                // Update the state
                this.setState((state) => {
                    return {audioState: 'audioPlaying'}
                });

                // Change the play button to a stop button
            } else {
                // Update the state
                this.setState((state) => {
                    return {audioState: 'audioStopped'}
                });

                // Change the stop button to a play button

            }
            if (playbackStatus.isBuffering) {
                // Add the spinning wheel of death
                this.setState((state) => {
                    return {audioState: 'audioBuffering'}
                });
            }
        }
    }

    toggleAudio = async () => {
        if (this.state.audioState === 'notLoaded' || this.state.audioState === 'errorLoading' || 
        this.state.audioState === 'audioStopped') {
            this.state.sound.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
            this.state.sound.loadAsync(
                { uri: 'https://streams.radio.co/s8d7990b82/listen' },
                {
                    shouldPlay: true,
                    isLooping: false
                },
                // downloadFirst = false // This parameter is needed for stories, otherwise it downloads it all before playing
            );
        } else if (this.state.audioState === 'audioPlaying') {
            // It's a stop button
            // Stop the stream completely
            this.state.sound.stopAsync();
            this.state.sound = new Audio.Sound();
        } else if (this.state.audioState === 'audioStopped') {
            // It's a play button, maybe just clicking play works...
            
        } else if (this.state.audioState === 'audioBuffering') {
            // I think nothing should be done here...
        }
        
    }

    pName = () => {
        console.log('Pressed the button');
        console.log(this.state.name);
    }

    renderImage() {
        if (this.state.audioState === 'audioPlaying' || this.state.audioState === 'audioBuffering') {
            // Stop button
            return (
                <Image 
                    style={styles.playButton}
                    source={require('../assets/images/Pause.png')}
                />
            );
        } else if (this.state.audioState === 'audioStopped' || this.state.audioState === 'notLoaded' || 
        this.state.audioState === 'errorLoading') {
            // Play button
            return (
                <Image 
                    style={styles.playButton}
                    source={require('../assets/images/Play.png')}
                />
            );
        }
    }

    render() {
        return(
            <View style={styles.container}> 
            <Image
                style={styles.logo}
                source={require('../assets/images/SCCC_logo.png')}
            />
            <Text style={styles.nowPlayingText}>
                Clary Croft - Kilkelly Ireland
            </Text>
            <TouchableWithoutFeedback onPress={this.toggleAudio}> 
                 <Image 
                    style={styles.playButton}
                    source={
                        this.state.audioState === 'audioPlaying' || this.state.audioState === 'audioBuffering' ?
                        require('../assets/images/Stop.png') :
                        require('../assets/images/Play.png')
                    }
                 />
            </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
        width: 300,
        height: 300,
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButton: {
        width: 50,
        height: 50
    },
    nowPlayingText: {
        fontSize: 20,
        fontWeight: 'normal',
        marginBottom: 30
    }
  });
  