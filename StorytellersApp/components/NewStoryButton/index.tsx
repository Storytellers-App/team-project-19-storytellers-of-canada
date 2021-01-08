import React from 'react';
import { TouchableOpacity, TouchableHighlight, Alert } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';

import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import {Text, View} from '../../components/Themed';
import { RootStackParamList, ResponseType} from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';
import NewStoryNavigationProp from '../../screens/NewStoryScreen';
import AsyncStorage from '@react-native-community/async-storage';
export type Props = {
    recording: string | null;
    username: string;
    userType: string;
    parent?: ResponseType;
    time: number | null;
};

const NewStoryButton = ({recording, username, parent, userType, time}:Props) => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const onPress = async () => {
            
        navigation.navigate("NewStory", { 'recording': recording , 'username': username, 'parent': parent, 'userType': userType});    
            
    }
    return (
        
     <TouchableHighlight
                    style = {styles.submitButton}
                    onPress={onPress}
                    disabled={recording === null}
                >
                    <Text 
                    style={styles.text}>
                        Next
                    </Text>
                </TouchableHighlight> 
            
    )
}

export default NewStoryButton;


const styles = StyleSheet.create({
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