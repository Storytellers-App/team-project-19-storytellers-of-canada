import React, { useContext } from 'react';
import { Alert, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types';

import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppContext } from '../../AppContext';
import { RotationGestureHandler } from 'react-native-gesture-handler';

const NewRecordingButton = ({ user }: { user?: string }) => {
    const { setIsPlaying, setIsRadioPlaying } = useContext(AppContext);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const onPress = () => {
        console.log('open recording screen');
        if (user === undefined || user === null || user === "") {
            Alert.alert("Please login to record a story");
            return;
        }
        setIsPlaying(false);
        setIsRadioPlaying(false);
        navigation.navigate("NewRecording", { username: user });
    }
    return (<TouchableOpacity style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}>
        <MaterialCommunityIcons name="microphone-plus" size={30} color="white" />


    </TouchableOpacity>
    )
}

export default NewRecordingButton;