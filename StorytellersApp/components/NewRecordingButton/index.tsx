import React from 'react';
import { TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from './styles';

const NewRecordingButton = () => {

    const onPress = () => {
        console.warn('open recording screen');
    }
    return (<TouchableOpacity style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}>
        <MaterialCommunityIcons name="microphone-plus" size={30} color="white" />


    </TouchableOpacity>
    )
}

export default NewRecordingButton;