import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableWithoutFeedback, LogBox } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { Audio } from 'expo-av';

export default class RadioPlayer extends React.Component {
    constructor() {
        super();
        this.state = {
            currentSong: {},
            paused: false,
            audioStatus: 'str'
        }
    }

    async toggleAudio() {
        // https://dev.to/cirlorm_io/how-to-create-a-music-streaming-app-expo-rn-1724
        const { sound } = await Audio.Sound.createAsync(
            { uri: 'https://streams.radio.co/s8d7990b82/listen'},
            {
                shouldPlay: true,
                isLooping: false
            }
        )
    }

    render() {
        return(
            
            <TouchableWithoutFeedback onPress={this.toggleAudio}> 
                <Image
                    style={styles.logo}
                    source={require('../assets/images/SCCC_logo.png')}
                />
            </TouchableWithoutFeedback>
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
    }
  });
  