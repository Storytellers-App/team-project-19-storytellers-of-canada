import React, { Component, useContext } from 'react';
import { Text, View, StyleSheet, Image, TouchableWithoutFeedback, LogBox, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Appbar, Button, Portal } from 'react-native-paper';
import { Input } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { Audio } from 'expo-av';
import { throwIfAudioIsDisabled } from 'expo-av/build/Audio/AudioAvailability';
import { AppContext } from '../AppContext';
import { LocalizationContext } from '../LocalizationContext';
import { RotationGestureHandler } from 'react-native-gesture-handler';
let loading = false;

function AppBarAndHelp() {
    const { t, locale, setLocale } = React.useContext(LocalizationContext);
    const [helpOpen, setHelpOpen] = React.useState(false);
    return (
        <View>
            <Appbar.Header style={{ backgroundColor: "white", marginLeft: 20, display: 'flex' }}>
                <Text style={{ fontSize: 20 }}>{t('scRadio')}</Text>
                <Button
                    style={{ marginLeft: "auto" }}
                    onPress={
                        () => setHelpOpen(!helpOpen)
                    }
                >
                    {t('helpCapitals')}
                </Button>
            </Appbar.Header>
            {helpOpen && <Portal>
                <View style={styles.faded}>
                    <View style={styles.message}>
                        <Text style={styles.messageTextLoud}>{t('helpRadioTitle')}</Text>
                        <Text style={styles.messageText}>{t('helpRadioMessage')}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={{ height: "100%" }}
                    onPress={() => setHelpOpen(false)}
                />
            </Portal>}
        </View>
    )
}

export default class RadioPlayer extends React.Component {

    static contextType = AppContext
    constructor() {
        super();
        this.state = {
            sound: new Audio.Sound(),
            audioState: 'notLoaded',
            nowPlaying: ''
        };
        this.timer = setInterval(() => this.updateNowPlaying(), 5000);
    }

    async componentDidMount() {
        this.mounted = true;
        this.updateNowPlaying();
        // await Audio.setAudioModeAsync({
        //     playsInSilentModeIOS: true,
        //     allowsRecordingIOS: false,
        //     interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        //     shouldDuckAndroid: false,
        //     interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        // })
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
        });
    }
    componentWillUnmount() {
        this.mounted = false;
        if(this.state.sound){
            this.state.sound.stopAsync();
        }
        clearInterval(this.timer);
    }

    _onPlaybackStatusUpdate = playbackStatus => {
        if (!this.mounted) {
            return;
        }
        if (!playbackStatus.isLoaded) {
            // Not loaded
            if (playbackStatus.error) {
                // Update the state
                this.setState((state) => {
                    return { audioState: 'errorLoading' }
                });
                // TODO: Show an error because it isn't loading
            }
        } else {
            if (playbackStatus.isPlaying) {
                if (!this.context.isRadioPlaying) {
                    this.state.sound.stopAsync();
                    this.state.sound = new Audio.Sound();
                    this.context.setIsRadioPlaying(false);
                    this.setState((state) => {
                        return { audioState: 'audioStopped' }
                    });
                    return;
                }
                // Update the state
                this.setState((state) => {
                    return { audioState: 'audioPlaying' }
                });

                // Change the play button to a stop button
            } else {
                // Update the state
                this.setState((state) => {
                    return { audioState: 'audioStopped' }
                });

                // Change the stop button to a play button

            }
        }
    }

    toggleAudio = async () => {
        if (loading || !this.mounted) {
            return;
        }
        if (this.state.audioState === 'notLoaded' || this.state.audioState === 'errorLoading' ||
            this.state.audioState === 'audioStopped') {
            loading = true;
            if (this.state.sound != null) {
                await this.state.sound.unloadAsync();
            }
            this.setState({ audioState: "audioLoading" });
            this.context.setIsRadioPlaying(true);
            this.context.setIsPlaying(false);
            this.state.sound.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
            await this.state.sound.loadAsync(
                { uri: 'https://streams.radio.co/s8d7990b82/listen' },
                {
                    shouldPlay: true,
                    isLooping: false
                },
                // downloadFirst = false // This parameter is needed for stories, otherwise it downloads it all before playing
            );
            loading = false;
        } else if (this.state.audioState === 'audioPlaying') {
            // It's a stop button
            // Stop the stream completely
            this.state.sound.stopAsync();
            this.state.sound = new Audio.Sound();
            this.context.setIsRadioPlaying(false);
        } else if (this.state.audioState === 'audioStopped') {
            this.context.setIsRadioPlaying(true);
            this.context.setIsPlaying(false);
            // It's a play button, maybe just clicking play works...

        } else if (this.state.audioState === 'audioBuffering') {
            // I think nothing should be done here...
            this.state.sound.stopAsync();
            this.setState({ sound: "audioStopped" });
        }
    }

    pName = () => {
        console.log('Pressed the button');
        console.log(this.state.name);
    }

    updateNowPlaying = async () => {
        if (!this.mounted) {
            return;
        }
        fetch("https://public.radio.co/api/v2/s8d7990b82/track/current", {
            headers: new Headers({
                'pragma': 'no-cache',
                'cache-control': 'no-cache'
            })
        })
            .then(response => response.json())
            .then((responseData) => {
                if (this.mounted) {
                    this.setState({
                        nowPlaying: responseData.data.title
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (

            <View style={{ flex: 1 }}>
                <AppBarAndHelp></AppBarAndHelp>
                <View style={styles.container}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/images/SCCC_logo.png')}
                    />
                    <Text style={styles.nowPlayingText} numberOfLines={2}>
                        {this.state.nowPlaying}
                    </Text>
                    <Text style={styles.liveText}>Live</Text>
                    {loading || this.state.audioState === 'audioBuffering' || this.state.audioState === 'audioLoading' ? <ActivityIndicator size="large" color='red' /> : <TouchableWithoutFeedback onPress={this.toggleAudio}>
                        <Image
                            style={styles.playButton}
                            source={
                                this.state.audioState === 'audioPlaying' ?
                                    require('../assets/images/Stop.png') :
                                    require('../assets/images/Play.png')
                            }
                        />
                    </TouchableWithoutFeedback>}
                </View>
            </View>
        );
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
        marginHorizontal: 3,
        fontWeight: 'normal',
        marginBottom: 0,
        textAlign: 'center'
    },
    liveText: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 30,
        color: 'red'
    },
    faded: {
        backgroundColor: '#00000099',
        position: 'absolute',
        zIndex: 0,
        height: '100%',
        width: '100%',
    },
    message: {
        top: '15%',
        margin: '6%',
        padding: '2%',
        backgroundColor: 'white',
        textAlign: "center"
    },
    messageText: {
        textAlign: "left",
        fontSize: 14,
        margin: 12,
    },
    messageTextLoud: {
        textAlign: "center",
        fontWeight: "bold",
        padding: 3,
        fontSize: 16,
    },
});

