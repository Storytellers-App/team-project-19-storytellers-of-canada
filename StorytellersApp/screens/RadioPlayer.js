import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableWithoutFeedback, LogBox } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { Audio } from 'expo-av';

export default class RadioPlayer extends React.Component {


    constructor() {
        super();
        this.state = {
            sound: new Audio.Sound(),
            name: 'asdf'
        };
    }

    _onPlaybackStatusUpdate = playbackStatus => {
        console.log('Playback status updated');
        if (!playbackStatus.isLoaded) {
            // Not loaded
            console.log('Not loaded');
            if (playbackStatus.error) {
                console.log('Error with playing the audio');
                // Show an alert to the user
            }
        } else {
            if (playbackStatus.isPlaying) {
                // Change the button to a stop button
                console.log('Playing');
            } else {
                // Change it to a play button
                console.log('Stopped');
            }
            if (playbackStatus.isBuffering) {
                // Add the spinning wheel of death
                console.log('Buffering');
            }
        }
    }

    // async toggleAudio() {
    //     // https://dev.to/cirlorm_io/how-to-create-a-music-streaming-app-expo-rn-1724
    //     console.log(this.state.name);
    //     this.setState((state) => {
    //         return {name: 'Apple'}
    //     });

    //     console.log(this.state.name);

    //     try {
    //         await this.sound.loadAsync({ uri: 'https://streams.radio.co/s8d7990b82/listen'}, 
    //         {
    //             shouldPlay: true,
    //             isLooping: false
    //         },
    //         false);
    //     } catch (error) {
    //         console.log('An error occured playing the audio');
    //         console.log(error);
    //     }
    //     // soundObject.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
    //     console.log(this.name);
    //     this.name = 'Apple';
    //     console.log(this.name);
    // }

    toggleAudio = () => {
        this.state.sound.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
        this.state.sound.loadAsync(
            { uri: 'https://streams.radio.co/s8d7990b82/listen' },
            {
                shouldPlay: true,
                isLooping: false
            },
            false
        );

    }

    pName = () => {
        console.log('Pressed the button');
        console.log(this.state.name);
    }

    render() {
        return(
            <View style={styles.container}> 
                <TouchableWithoutFeedback onPress={this.toggleAudio}> 
                    <Image
                        style={styles.logo}
                        source={require('../assets/images/SCCC_logo.png')}
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
        width: 150,
        height: 150,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
    }
  });
  