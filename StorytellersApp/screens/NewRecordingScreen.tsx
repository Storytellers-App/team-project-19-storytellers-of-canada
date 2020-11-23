import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native';
import {EvilIcons, AntDesign} from "@expo/vector-icons"
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Octicons, FontAwesome } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { withNavigation } from 'react-navigation';



import {
  Dimensions,
  Image,
  Slider,
  TouchableHighlight,
} from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";
import * as Permissions from "expo-permissions";
import * as Icons from "../components/Icons";
import { yellow100 } from 'react-native-paper/lib/typescript/src/styles/colors';
import NewStoryButton from '../components/NewStoryButton';
import NewRecordingButton from '../components/NewRecordingButton';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
const BACKGROUND_COLOR = "white";
const LIVE_COLOR = "red";
const DISABLED_OPACITY = 0.2;
const RATE_SCALE = 3.0;

type Props = {

};

type State = {
  haveRecordingPermissions: boolean;
  isLoading: boolean;
  isPlaybackAllowed: boolean;
  muted: boolean;
  soundPosition: number | null;
  soundDuration: number | null;
  recordingDuration: number | null;
  shouldPlay: boolean;
  isPlaying: boolean;
  isRecording: boolean;
  fontLoaded: boolean;
  shouldCorrectPitch: boolean;
  volume: number;
  rate: number;
};



export default class NewRecordingScreen extends React.Component<Props, State> {
    private recording: Audio.Recording | null;
    private sound: Audio.Sound | null;
    private isSeeking: boolean;
    private shouldPlayAtEndOfSeek: boolean;
    private readonly recordingSettings: Audio.RecordingOptions;
  
    constructor(props: Props) {
      super(props);
      this.recording = null;
      this.sound = null;
      this.isSeeking = false;
      this.shouldPlayAtEndOfSeek = false;
      this.state = {
        haveRecordingPermissions: false,
        isLoading: false,
        isPlaybackAllowed: false,
        muted: false,
        soundPosition: null,
        soundDuration: null,
        recordingDuration: null,
        shouldPlay: false,
        isPlaying: false,
        isRecording: false,
        fontLoaded: false,
        shouldCorrectPitch: true,
        volume: 1.0,
        rate: 1.0,
      };
      this.recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;
  
      // UNCOMMENT THIS TO TEST maxFileSize:
      /* this.recordingSettings = {
        ...this.recordingSettings,
        android: {
          ...this.recordingSettings.android,
          maxFileSize: 12000,
        },
      };*/
    }
  
    componentDidMount() {
      (async () => {
        await Font.loadAsync({
          "cutive-mono-regular": require("../assets/fonts/CutiveMono-Regular.ttf"),
        });
        this.setState({ fontLoaded: true });
      })();
      this._askForPermissions();
    }
  
    private _askForPermissions = async () => {
      const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      this.setState({
        haveRecordingPermissions: response.status === "granted",
      });
    };
  
    private _updateScreenForSoundStatus = (status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        this.setState({
          soundDuration: status.durationMillis ?? null,
          soundPosition: status.positionMillis,
          shouldPlay: status.shouldPlay,
          isPlaying: status.isPlaying,
          rate: status.rate,
          muted: status.isMuted,
          volume: status.volume,
          shouldCorrectPitch: status.shouldCorrectPitch,
          isPlaybackAllowed: true,
        });
      } else {
        this.setState({
          soundDuration: null,
          soundPosition: null,
          isPlaybackAllowed: false,
        });
        if (status.error) {
          console.log(`FATAL PLAYER ERROR: ${status.error}`);
        }
      }
    };
  
    private _updateScreenForRecordingStatus = (status: Audio.RecordingStatus) => {
      if (status.canRecord) {
        this.setState({
          isRecording: status.isRecording,
          recordingDuration: status.durationMillis,
        });
      } else if (status.isDoneRecording) {
        this.setState({
          isRecording: false,
          recordingDuration: status.durationMillis,
        });
        if (!this.state.isLoading) {
          this._stopRecordingAndEnablePlayback();
        }
      }
    };
  
    private async _stopPlaybackAndBeginRecording() {
      this.setState({
        isLoading: true,
      });
      if (this.sound !== null) {
        await this.sound.unloadAsync();
        this.sound.setOnPlaybackStatusUpdate(null);
        this.sound = null;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
      if (this.recording !== null) {
        this.recording.setOnRecordingStatusUpdate(null);
        this.recording = null;
      }
  
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(this.recordingSettings);
      recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);
  
      this.recording = recording;
      await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
      this.setState({
        isLoading: false,
      });
    }
  
    private async _stopRecordingAndEnablePlayback() {
      this.setState({
        isLoading: true,
      });
      if (!this.recording) {
        return;
      }
      try {
        await this.recording.stopAndUnloadAsync();
      } catch (error) {
        // On Android, calling stop before any data has been collected results in
        // an E_AUDIO_NODATA error. This means no audio data has been written to
        // the output file is invalid.
        if (error.code === "E_AUDIO_NODATA") {
          console.log(
            `Stop was called too quickly, no data has yet been received (${error.message})`
          );
        } else {
          console.log("STOP ERROR: ", error.code, error.name, error.message);
        }
        this.setState({
          isLoading: false,
        });
        return;
      }
      const info = await FileSystem.getInfoAsync(this.recording.getURI() || "");
      console.log(`FILE INFO: ${JSON.stringify(info)}`);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
      const { sound, status } = await this.recording.createNewLoadedSoundAsync(
        {
          isLooping: true,
          isMuted: this.state.muted,
          volume: this.state.volume,
          rate: this.state.rate,
          shouldCorrectPitch: this.state.shouldCorrectPitch,
        },
        this._updateScreenForSoundStatus
      );
      this.sound = sound;
      this.setState({
        isLoading: false,
      });
    }
  
    private _onRecordPressed = () => {
      if (this.state.isRecording) {
        this._stopRecordingAndEnablePlayback();
      } else {
        this._stopPlaybackAndBeginRecording();
      }
    };
  
    private _onPlayPausePressed = () => {
      if (this.sound != null) {
        if (this.state.isPlaying) {
          this.sound.pauseAsync();
        } else {
          this.sound.playAsync();
        }
      }
    };
  
    private _onStopPressed = () => {
      if (this.sound != null) {
        this.sound.stopAsync();
      }
    };
  
    private _onMutePressed = () => {
      if (this.sound != null) {
        this.sound.setIsMutedAsync(!this.state.muted);
      }
    };
  
    private _onVolumeSliderValueChange = (value: number) => {
      if (this.sound != null) {
        this.sound.setVolumeAsync(value);
      }
    };
  
    private _trySetRate = async (rate: number, shouldCorrectPitch: boolean) => {
      if (this.sound != null) {
        try {
          await this.sound.setRateAsync(rate, shouldCorrectPitch);
        } catch (error) {
          // Rate changing could not be performed, possibly because the client's Android API is too old.
        }
      }
    };
  
    private _onRateSliderSlidingComplete = async (value: number) => {
      this._trySetRate(value * RATE_SCALE, this.state.shouldCorrectPitch);
    };
  
    private _onPitchCorrectionPressed = () => {
      this._trySetRate(this.state.rate, !this.state.shouldCorrectPitch);
    };
  
    private _onSeekSliderValueChange = (value: number) => {
      if (this.sound != null && !this.isSeeking) {
        this.isSeeking = true;
        this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
        this.sound.pauseAsync();
      }
    };
  
    private _onSeekSliderSlidingComplete = async (value: number) => {
      if (this.sound != null) {
        this.isSeeking = false;
        const seekPosition = value * (this.state.soundDuration || 0);
        if (this.shouldPlayAtEndOfSeek) {
          this.sound.playFromPositionAsync(seekPosition);
        } else {
          this.sound.setPositionAsync(seekPosition);
        }
      }
    };
  
    private _getSeekSliderPosition() {
      if (
        this.sound != null &&
        this.state.soundPosition != null &&
        this.state.soundDuration != null
      ) {
        return this.state.soundPosition / this.state.soundDuration;
      }
      return 0;
    }
  
    private _getMMSSFromMillis(millis: number) {
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
  
    private _getPlaybackTimestamp() {
      if (
        this.sound != null &&
        this.state.soundPosition != null &&
        this.state.soundDuration != null
      ) {
        return `${this._getMMSSFromMillis(
          this.state.soundPosition
        )} / ${this._getMMSSFromMillis(this.state.soundDuration)}`;
      }
      return "";
    }
  
    private _getRecordingTimestamp() {
      if (this.state.recordingDuration != null) {
        return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
      }
      return `${this._getMMSSFromMillis(0)}`;
    }

    private handleNext() {
        const username = 'test'
        const navigation = useNavigation();
        navigation.navigate("NewStory", {username: 'got it bitch', recording: "heres the rec"});
        console.warn('Next Up')
        
    }
  
    render() {
      if (!this.state.fontLoaded) {
        return <View style={styles.emptyContainer} />;
      }
  
      if (!this.state.haveRecordingPermissions) {
        return (
          <View style={styles.container}>
            <View />
            <Text
              style={[
                styles.noPermissionsText,
                { fontFamily: "cutive-mono-regular" },
              ]}
            >
              You must enable audio recording permissions in order to use this
              app.
            </Text>
            <View />
          </View>
        );
      }
  
      return (
        <View style={styles.container}>

          <View
            style={[
              styles.halfScreenContainer,
              {
                opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
              },
            ]}
          >
            <View />
            <View>
                <Text style={
                    [
                        styles.text,
                        {
                            color: 'black'
                        }
                    ]
                }>
                    Record Your Story
                </Text>
            </View>
            <View style={styles.recordingContainer}>
              <View />
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onRecordPressed}
                disabled={this.state.isLoading}
              >
                {/* <Image style={styles.image} source={Icons.RECORD_BUTTON.module} /> */}
                {this.state.isRecording ? <FontAwesome name="stop" size={34} color="red" /> : <MaterialCommunityIcons name="record-circle" size={34} color="red" style={styles.image}/>}
                
              </TouchableHighlight>
              <Text
                  style={[styles.liveText, ]}
                >
                  {this.state.isRecording ? "Stop" : "Record"}
                </Text>
              <View style={styles.recordingDataContainer}>
                <View />
                <View style={styles.recordingDataRowContainer}>
                  {/* <Image
                    style={[
                      styles.image,
                      { opacity: this.state.isRecording ? 1.0 : 0.0 },
                    ]}
                    source={Icons.RECORDING.module}
                  /> */}
                  <Text
                    style={[
                      styles.recordingTimestamp,
                      
                    ]}
                  >
                    {this._getRecordingTimestamp()}
                  </Text>
                </View>
                <View />
              </View>
              <View />
            </View>
            <View />
          </View>
          <View
            style={[
              styles.halfScreenContainer,
              {
                opacity:
                  !this.state.isPlaybackAllowed || this.state.isLoading
                    ? DISABLED_OPACITY
                    : 1.0,
              },
            ]}
          >
            <View />
            <View style={styles.playbackContainer}>
              <Slider
                style={styles.playbackSlider}
                trackImage={Icons.TRACK_1.module}
                thumbImage={Icons.THUMB_1.module}
                value={this._getSeekSliderPosition()}
                onValueChange={this._onSeekSliderValueChange}
                onSlidingComplete={this._onSeekSliderSlidingComplete}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
              />
              <Text
                style={[
                  styles.playbackTimestamp,
                  
                ]}
              >
                {this._getPlaybackTimestamp()}
              </Text>
            </View>
            <View
              style={[styles.buttonsContainerBase, styles.buttonsContainerTopRow]}
            >
              <View style={styles.volumeContainer}>
                <TouchableHighlight
                  underlayColor={BACKGROUND_COLOR}
                  style={styles.wrapper}
                  onPress={this._onMutePressed}
                  disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
                >
                  {/* <Image
                    style={styles.image}
                    source={
                      this.state.muted
                        ? Icons.MUTED_BUTTON.module
                        : Icons.UNMUTED_BUTTON.module
                    }
                  /> */}
                  <Octicons name={this.state.muted ? "mute" : "unmute"} size={34} color="black" />
                </TouchableHighlight>
                <Slider
                  style={styles.volumeSlider}
                  trackImage={Icons.TRACK_1.module}
                  thumbImage={Icons.THUMB_2.module}
                  value={1}
                  onValueChange={this._onVolumeSliderValueChange}
                  disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
                />
              </View>
              <View style={styles.playStopContainer}>
                <TouchableHighlight
                  underlayColor={BACKGROUND_COLOR}
                  style={styles.wrapper}
                  onPress={this._onPlayPausePressed}
                  disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
                >
                  {/* <Image
                    style={styles.image}
                    source={
                      this.state.isPlaying
                        ? Icons.PAUSE_BUTTON.module
                        : Icons.PLAY_BUTTON.module
                    }
                  /> */}
                  <FontAwesome name={this.state.isPlaying ? "pause" : "play"} size={34} color="black" />
                  
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={BACKGROUND_COLOR}
                  style={styles.wrapper}
                  onPress={this._onStopPressed}
                  disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
                >
                  {/* <Image style={styles.image} source={Icons.STOP_BUTTON.module} /> */}
                  <MaterialIcons name="replay" size={34} color="black" />
                </TouchableHighlight>
              </View>
              <View />
            </View>
            <View>
                {/* <TouchableHighlight
                    style = {styles.submitButton}
                    onPress={this.handleNext}
                    disabled={this.recording === null}
                >
                    <Text 
                    style={styles.text}>
                        Next
                    </Text>
                </TouchableHighlight> */}   
                <NewStoryButton recording={this.recording === null ? null : this.recording.getURI()}/>             
            </View>

            
            {/* <View
              style={[
                styles.buttonsContainerBase,
                styles.buttonsContainerBottomRow,
              ]}
            >
              <Text style={styles.timestamp}>Rate:</Text>
              <Slider
                style={styles.rateSlider}
                trackImage={Icons.TRACK_1.module}
                thumbImage={Icons.THUMB_1.module}
                value={this.state.rate / RATE_SCALE}
                onSlidingComplete={this._onRateSliderSlidingComplete}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
              />
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onPitchCorrectionPressed}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
              >
                <Text style={[]}>
                  PC: {this.state.shouldCorrectPitch ? "yes" : "no"}
                </Text>
              </TouchableHighlight>
            </View> */}
            <View />
          </View>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    emptyContainer: {
      alignSelf: "stretch",
      backgroundColor: BACKGROUND_COLOR,
    },
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "stretch",
    },
    noPermissionsText: {
      textAlign: "center",
    },
    wrapper: {},
    halfScreenContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "stretch",
    },
    recordingContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      alignSelf: "stretch",
      minHeight: Icons.RECORD_BUTTON.height,
      maxHeight: Icons.RECORD_BUTTON.height,
    },
    recordingDataContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      minHeight: Icons.RECORD_BUTTON.height,
      maxHeight: Icons.RECORD_BUTTON.height,
      minWidth: Icons.RECORD_BUTTON.width * 3.0,
      maxWidth: Icons.RECORD_BUTTON.width * 3.0,
    },
    recordingDataRowContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      minHeight: Icons.RECORDING.height,
      maxHeight: Icons.RECORDING.height,
    },
    playbackContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "stretch",
      minHeight: Icons.THUMB_1.height * 2.0,
      maxHeight: Icons.THUMB_1.height * 2.0,
      
    },
    playbackSlider: {
      alignSelf: "stretch",
    },
    liveText: {
      color: LIVE_COLOR,
    },
    recordingTimestamp: {
      paddingLeft: 20,
    },
    playbackTimestamp: {
      textAlign: "right",
      alignSelf: "stretch",
      paddingRight: 20,
    },
    image: {
      backgroundColor: BACKGROUND_COLOR,
    },
    textButton: {
      backgroundColor: BACKGROUND_COLOR,
      padding: 10,
    },
    buttonsContainerBase: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 15,
    },
    buttonsContainerTopRow: {
      maxHeight: Icons.MUTED_BUTTON.height,
      alignSelf: "stretch",
      paddingRight: 20,
    },
    playStopContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minWidth: ((Icons.PLAY_BUTTON.width + Icons.STOP_BUTTON.width) * 3.0) / 2.0,
      maxWidth: ((Icons.PLAY_BUTTON.width + Icons.STOP_BUTTON.width) * 3.0) / 2.0,
    },
    volumeContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minWidth: DEVICE_WIDTH / 2.0,
      maxWidth: DEVICE_WIDTH / 2.0,
    },
    volumeSlider: {
      width: DEVICE_WIDTH / 2.0 - Icons.MUTED_BUTTON.width,
    },
    buttonsContainerBottomRow: {
      maxHeight: Icons.THUMB_1.height,
      alignSelf: "stretch",
      paddingRight: 20,
      paddingLeft: 20,
    },
    timestamp: {
    },
    rateSlider: {
      width: DEVICE_WIDTH / 2.0,
    },
    submitButton: {
        backgroundColor: Colors.light.tint,
        borderRadius: 30,
    },
    text: {
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        color: 'white',
        fontWeight: 'bold', 
        fontSize: 20,
    },
  });

  
