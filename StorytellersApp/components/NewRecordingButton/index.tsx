import React from 'react';
import { TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types';

import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


const NewRecordingButton = ({user}: {user?: string}) => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const onPress = () => {
        console.log('open recording screen');
        if (user === undefined){
            return;
        }
        navigation.navigate("NewRecording", {username: user});  
    }
    return (<TouchableOpacity style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}>
        <MaterialCommunityIcons name="microphone-plus" size={30} color="white" />


    </TouchableOpacity>
    )
}

export default NewRecordingButton;