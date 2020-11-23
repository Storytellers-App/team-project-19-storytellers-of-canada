import React from 'react';
import { TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from './styles';
import { useNavigation } from '@react-navigation/native';

const NewRecordingButton = () => {

    const navigation = useNavigation();

    const onPress = () => {
        console.log('open recording screen');
        navigation.navigate("NewRecording");
    }
    return (<TouchableOpacity style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}>
        <MaterialCommunityIcons name="microphone-plus" size={30} color="white" />


    </TouchableOpacity>
    )
}

export default NewRecordingButton;