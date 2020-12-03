import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, TouchableHighlight, ScrollView, Alert, Platform } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Input, Button } from 'react-native-elements';
import Colors from '../constants/Colors';
import TagInput from 'react-native-tags-input';
import { Feather } from '@expo/vector-icons';
import * as Config from '../config';
import axios from 'axios';

type NewStoryRouteProp = RouteProp<RootStackParamList, 'NewStory'>;

export type NewStoryNavigationProp = StackNavigationProp<
    RootStackParamList,
    'NewStory'
>;
type Props = {
    route: NewStoryRouteProp;
    navigation: NewStoryNavigationProp;
}

export default function NewStoryScreen({ route, navigation }: Props) {
    const host = Config.HOST;
    const { parent, recording, username } = route.params;
   
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState({
        tag: '',
        tagsArray: [],
    });
    
    const [currentTag, setCurrentTag] = useState("");

    const handleOnChangeTitle = (text: string) => {
        setTitle(text);
    }

    const handleOnChangeDescription = (text: string) => {
        setDescription(text);
    }

    
    const handleSubmit = async () => {
        if (recording === null){
            return;
        }
        const formData = new FormData();
        let uri =  recording
        formData.append('username', username);
        // file type: setting mp3 
        if (Platform.OS === 'ios'){
            formData.append('extension', 'm4a');
        } else {
            formData.append('extension', 'aac');
        }
        formData.append('title', title);
        if (parent != null && parent != undefined){
            formData.append('parent', parent.id.toString());
            formData.append('parent_type', parent.type);
        }
        formData.append('description', description);
        tags.tagsArray.forEach(element => {
            formData.append('tags', element);
        });
        /*@ts-ignore*/
        formData.append('recording', {uri: uri, 
            name: uri,
             type: 'audio/mpeg'});
        formData.append('type', 'userstory');
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', host + 'stories'); 
        xhr.send(formData);
        xhr.onreadystatechange = e => {
          if (xhr.readyState !== 4) {
            return;
          }
          if (xhr.status === 200) {
            navigation.navigate('HomeScreen')
            Alert.alert("Your submission is under review!")
          } else {
            console.log('error', xhr.responseText);
          }
        };
    }

    return (

        <ScrollView style={styles.container}>
            {/* Registration form */}
            <View>
                <Text style={styles.title}>Submit Your New Story For Review!</Text>
            </View>
            <View>
                <Input
                    style={styles.input}
                    placeholder="Title"
                    onChangeText={(text) => handleOnChangeTitle(text)}
                />
                <Input
                    style={styles.input}
                    placeholder="Description"
                    multiline={true}
                    maxLength={350}
                    onChangeText={(text) => handleOnChangeDescription(text)}
                />
            </View>
            <View style={styles.tagsContainer}>
                <TagInput
                    tags={tags}
                    updateState={(state) => {
                        setTags(state);
                    }}
                    placeholder="Tags..."
                    tagStyle={styles.tag}
                    keysForTag={'done'}
                    tagTextStyle={styles.tagText}
                    deleteElement={<Feather name="x" size={16} color="white" />}
                />
            </View>
            <View>
                <TouchableHighlight
                    style={styles.submitButton}
                    onPress={handleSubmit}
                // disabled={title === ""}
                >
                    <Text
                        style={styles.buttonText}>
                        submit
                    </Text>
                </TouchableHighlight>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        // paddingTop: 90,
        // paddingBottom: 90,
        paddingLeft: 50,
        paddingRight: 50,
        marginVertical: 10,

    },
    title: {
        textAlignVertical: "center",
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 60,
        marginTop: 50,
    },
    input: {
        fontSize: 16,
    },
    text: {
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: Colors.light.tint,
        borderRadius: 30,
        alignItems: 'center',
    },
    buttonText: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    tag: {
        backgroundColor: Colors.light.tint,

    },
    tagText: {
        color: 'white',
    },
    tagsContainer: {
        marginBottom: 20,
    }

});