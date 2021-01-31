import { FontAwesome, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Audio, AVPlaybackStatus } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";
import * as Permissions from "expo-permissions";
import * as React from 'react';
import * as DocumentPicker from 'expo-document-picker';
import {
  Alert, Dimensions, StyleSheet, Text, TouchableHighlight, View
} from 'react-native';
import Slider from '@react-native-community/slider';
import NewStoryButton from '../components/NewStoryButton';
import Colors from '../constants/Colors';
import { ResponseType as ResponseStory, RootStackParamList, UserType } from '../types';
import * as MediaLibrary from 'expo-media-library';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import { LocalizationContext } from '../LocalizationContext';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
const BACKGROUND_COLOR = "#f6f6f6";
const LIVE_COLOR = "red";
const DISABLED_OPACITY = 0.2;
const RATE_SCALE = 3.0;


type NewRecordingRouteProp = RouteProp<RootStackParamList, 'NewRecording'>;
type NewRecordingNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NewRecording'
>;
type Props = {
  route: NewRecordingRouteProp;
  navigation: NewRecordingNavigationProp;
}

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
  isDownloading: boolean;
};

function StopAudio({ sound }: { sound: Audio.Sound | null }) {
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound && sound?._loaded) {
          sound?.stopAsync()
        }
      };
    }, [sound])
  );
  return null;
}

export default class NewRecordingScreen extends React.Component<Props, State> {
  static contextType = LocalizationContext;
  private recording: Audio.Recording | null;
  private sound: Audio.Sound | null;
  private isSeeking: boolean;
  private shouldPlayAtEndOfSeek: boolean;
  private readonly recordingSettings: Audio.RecordingOptions;
  private user: UserType;
  private mounted: boolean | null;
  private parentStory: ResponseStory | undefined;
  private uri: string | null;
  private navigation: NewRecordingNavigationProp;
  constructor(props: Props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.mounted = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.user = props.route.params.user;
    this.uri = null;
    this.navigation = props.navigation;

    this.parentStory = props.route.params.parent;
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
      isDownloading: false

    };

    // this.recordingSettings = Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY;
    // outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    // audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
    // ADTS is more for streaming
    this.recordingSettings = {
      android: {
        extension: '.m4a',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
      },
      // ios: {
      //     extension: '.mp3',
      //     audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
      //     sampleRate: 44100,
      //     numberOfChannels: 2,
      //     bitRate: 128000,
      //     linearPCMBitDepth: 16,
      //     linearPCMIsBigEndian: false,
      //     linearPCMIsFloat: false,
      // },
      ios: {
        extension: '.m4a',
        outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      }
    };

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
    this.mounted = true;
    this._askForPermissions();
  }
  componentWillUnmount() {
    this.mounted = false;
    if (this.sound) {
      this.sound.stopAsync();
      this.sound.unloadAsync();
    }
    if (this.recording) {
      if (this.state.isRecording) {
        this.recording.stopAndUnloadAsync();
      }
    }
  }

  private _askForPermissions = async () => {
    if (!this.mounted) {
      return;
    }
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === "granted",
    });
  };

  private _updateScreenForSoundStatus = (status: AVPlaybackStatus) => {
    if (!this.mounted) {
      return;
    }
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
    if (!this.mounted) {
      return;
    }

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
    if (status.durationMillis > 192000) {
      this._stopRecordingAndEnablePlayback();
      Alert.alert(this.context.t('maxLengthAlert'))

    }
  };

  private async _stopPlaybackAndBeginRecording() {
    if (!this.mounted) {
      return;
    }
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
    this.uri = null;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoading: false,
    });
  }

  private async _stopRecordingAndEnablePlayback() {
    if (!this.mounted) {
      return;
    }
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
    this.uri = this.recording.getURI();
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

  // private handleNext() {
  //     const navigation = useNavigation();
  //     console.log( this.route.params.parent);
  //     console.log( this.route.params.username);
  //     navigation.navigate("NewStory", {parent: this.route.params.parent, username: this.route.params.username, recording: this.recording});
  //     console.warn('Next Up')

  // }
  private setPlaybackUpload = async (audioUri: string) => {
    if (!this.mounted) {
      return;
    }
    this.setState({
      isLoading: true,
    });
    if (this.sound) {
      await this.sound.unloadAsync();
    }
    if (audioUri === null || audioUri === undefined || audioUri === "") {
      return;
    }
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.setState({ recordingDuration: 0 });
      this.recording = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus
    )
    this.sound = newSound;
    this.uri = audioUri;
    this.setState({
      isLoading: false,
    });
  }

  private onUploadPress = async () => {
    await DocumentPicker.getDocumentAsync({ type: 'audio/*' }).then(resp => {
      if (resp.type === 'success') {
        this.setPlaybackUpload(resp.uri)
      }
      // else{
      //     Alert.alert("There was a problem. Please try again");

      // }
    })
  }
  private onDownloadPress = async () => {
    this.setState({isDownloading: true})
    const perm = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (perm.status != 'granted') {
      Alert.alert(this.context.t('audioFilesPermission'));
      this.setState({isDownloading: false})
      return;
    }
    try {
      if (this.uri) {
        const asset = await MediaLibrary.createAssetAsync(this.uri);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      }
      this.setState({isDownloading: false})
      Alert.alert(this.context.t('downloadSuccess'));
    }
    catch (e) {
      this.setState({isDownloading: false})
      Alert.alert(this.context.t('downloadFail'));
    }
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
            {this.context.t('audioPermissionPrompt')}
            </Text>
          <View />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor:  BACKGROUND_COLOR}}>
      <Appbar.BackAction onPress={() => this.navigation.goBack()} />
      </Appbar.Header>
      <View style={styles.container}>
        <StopAudio sound={this.sound}></StopAudio>
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
              // trackImage={Icons.TRACK_1.module}
              // thumbImage={Icons.THUMB_1.module}
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
                // trackImage={Icons.TRACK_1.module}
                // thumbImage={Icons.THUMB_2.module}
                value={1}
                onValueChange={this._onVolumeSliderValueChange}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
              />
            </View>
            <View style={styles.playStopContainer}>
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={{ paddingLeft: 10 }}
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
              {this.state.isDownloading ? <ActivityIndicator size="large" color='red' /> :  <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this.onDownloadPress}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
              >
                {/* <Image style={styles.image} source={Icons.STOP_BUTTON.module} /> */}
                <MaterialIcons name="file-download" size={34} color="black" />
              </TouchableHighlight> }
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

            <NewStoryButton recording={this.uri} user={this.user} parent={this.parentStory} time={this.state.recordingDuration} />
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
              </TouchableHighlight>*/}
        </View>
        <View />

        <View
          style={[
            styles.halfScreenContainerBottom,
            {
              opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
            },
          ]}
        >

          {/* <View style={styles.recordingContainer}> */}
          <View style={styles.bottom}>
            <View style={styles.recordingStatus}>
              <Text
                style={[
                  styles.recordingTimestamp,
                ]}
              >
                {this._getRecordingTimestamp() === "00:00" ? this.context.t('maxLengthStatic'): this._getRecordingTimestamp()}
              </Text>
            </View>
            <View style={styles.recordButton}>
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onRecordPressed}
                disabled={this.state.isLoading}
              >
                {/* <Image style={styles.image} source={Icons.RECORD_BUTTON.module} /> */}
                {this.state.isRecording ? <FontAwesome name="stop" size={64} color="red" /> : <MaterialCommunityIcons name="record-circle" size={64} color="red" style={styles.image} />}

              </TouchableHighlight>
            </View>

            {/* <Text
                  style={[styles.liveText, ]}
                >
                  {this.state.isRecording ? "Stop" : "Record"}
                </Text> */}
            {/* <View style={styles.recordingDataContainer}> */}
            <View />

            {/* </View> */}
            <View />


            {/* </View> */}
            <View />

          </View>

          <TouchableHighlight style={{
            backgroundColor: Colors.light.tint,
            borderRadius: 30,
            alignItems: 'center',
            opacity: this.state.isLoading || this.state.isRecording ? DISABLED_OPACITY : 1.0,
          }}
            disabled={this.state.isLoading || this.state.isRecording}
            onPress={this.onUploadPress}
          >
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <MaterialIcons style={{ paddingLeft: 10 }} name="file-upload" size={30} color="white" />
              <Text
                style={{
                  paddingRight: 20,
                  paddingVertical: 10,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 15,
                }}>
                {this.context.t('uploadExistingFile')}
                    </Text>
            </View>
          </TouchableHighlight>


        </View>

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
  bottom: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
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
    flex: 3,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "stretch",
    paddingTop: 10,

  },
  halfScreenContainerBottom: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    //marginBottom: 50,
    paddingBottom: 50,


  },
  recordingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: 119,
    maxHeight: 119,
  },
  recordButton: {
    flexDirection: 'row',
    flex: 3,
    marginTop: 10,

  },
  recordingDataContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 119,
    maxHeight: 119,
    minWidth: 70 * 3.0,
    maxWidth: 70 * 3.0,
  },
  recordingDataRowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 14,
    maxHeight: 14,
  },
  recordingStatus: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  playbackContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: 19 * 2.0,
    maxHeight: 19 * 2.0,

  },
  playbackSlider: {
    alignSelf: "stretch",
    marginHorizontal: 10,
  },
  liveText: {
    color: LIVE_COLOR,
  },
  recordingTimestamp: {
    color: 'green',
  },
  playbackTimestamp: {
    textAlign: "right",
    alignSelf: "stretch",
    paddingRight: 20,
  },
  image: {
  },
  textButton: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 10,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginHorizontal: 15,
  },
  buttonsContainerTopRow: {
    maxHeight: 58,
    alignSelf: "stretch",
    paddingRight: 20,
  },
  playStopContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 30,
    justifyContent: "space-between",
    //minWidth: ((34 + 22) * 3.0) / 2.0,
    //maxWidth: ((34 + 22) * 3.0) / 2.0,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    //minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0 - 67,
    marginHorizontal: 0,
  },
  buttonsContainerBottomRow: {
    maxHeight: 19,
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


