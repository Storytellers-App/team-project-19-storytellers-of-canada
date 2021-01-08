import React from 'react';
import { TouchableOpacity, TouchableHighlight, Alert } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';
import * as DocumentPicker from 'expo-document-picker';

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
};

const UploadStoryButton = ({recording, username, parent, userType}:Props) => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const onPress = async () => {
        await DocumentPicker.getDocumentAsync({type: 'audio/*'}).then(resp => {
            if (resp.type === 'success'){
                console.log("Success")
                recording = resp.uri
                navigation.navigate("NewStory", { 'recording': recording , 'username': username, 'parent': parent, 'userType': userType});    
            }
            else{
                Alert.alert("There was a problem. Please try again");

            }
        })
    }
    return (
        
     <TouchableHighlight style={styles.button}
                    onPress={onPress}
                >
                    <Text 
                    style={styles.text}>
                        Upload an mp3 audio file from your device
                    </Text>
                </TouchableHighlight> 
            
    )
}

export default UploadStoryButton;


const styles = StyleSheet.create({

button: {
    backgroundColor: Colors.light.tint,
        borderRadius: 30,
        alignItems: 'center',
},
text: {
    paddingHorizontal: 20,
        paddingVertical: 10,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
},

});