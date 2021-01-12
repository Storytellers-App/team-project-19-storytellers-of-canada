import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as DocumentPicker from 'expo-document-picker';
import React from 'react';
import { Alert, StyleSheet, TouchableHighlight } from 'react-native';
import { Text } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { ResponseType, RootStackParamList, UserType } from '../../types';

export type Props = {
    recording: string | null;
    user: UserType,
    parent?: ResponseType;
};

const UploadStoryButton = ({recording, user, parent}:Props) => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const onPress = async () => {
        await DocumentPicker.getDocumentAsync({type: 'audio/*'}).then(resp => {
            if (resp.type === 'success'){
                console.log("Success")
                recording = resp.uri
                navigation.navigate("NewStory", { 'recording': recording , 'user': user, 'parent': parent, });    
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