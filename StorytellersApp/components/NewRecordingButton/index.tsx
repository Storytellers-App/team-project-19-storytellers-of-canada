import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { AppContext } from '../../AppContext';
import { RootStackParamList, UserType } from '../../types';
import styles from './styles';


const NewRecordingButton = ({ user }: { user?: UserType}) => {
    const { setIsPlaying, setIsRadioPlaying } = useContext(AppContext);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const onPress = () => {
        console.log('open recording screen');
        if (user === undefined || user === null || user.username === "") {
            Alert.alert("Please login to record a story");
            return;
        }
        setIsPlaying(false);
        setIsRadioPlaying(false);
        navigation.navigate("NewRecording", { user: user});
    }
    return (<TouchableOpacity style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}>
        <MaterialCommunityIcons name="microphone-plus" size={30} color="white" />


    </TouchableOpacity>
    )
}

export default NewRecordingButton;