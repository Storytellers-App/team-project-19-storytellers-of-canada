import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, TouchableHighlight, ScrollView, Alert, Platform, Picker } from 'react-native';
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
import * as ImagePicker from 'expo-image-picker';

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
    const { parent, recording, username, userType } = route.params;
    console.log('Usertype: ' + userType);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [author, setAuthor] = useState("");
    const [isStoredStory, setIsStoredStory] = useState(false);
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState({
        tag: '',
        tagsArray: [],
    });

    const [currentTag, setCurrentTag] = useState("");

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to allow you to select a thumbnail image from your device!');
                }
            }
        })();
    }, []);

    const handleOnChangeTitle = (text: string) => {
        setTitle(text);
    }
    const handleOnChangeAuthor = (text: string) => {
        setAuthor(text);
    }

    const handleOnChangeDescription = (text: string) => {
        setDescription(text);
    }

    const onImagePickerPress = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            Alert.alert("Your image has been selected!")
        }
        else {
            Alert.alert("Something went wrong, please try again")
        }
    }
    const handleSubmit = async () => {
        if (recording === null) {
            return;
        }
        const formData = new FormData();
        let uri = recording
        formData.append('username', username);
        // file type: setting mp3 
        if (Platform.OS === 'ios') {
            formData.append('extension', 'm4a');
        } else {
            formData.append('extension', 'm4a');
        }
        formData.append('title', title);
        if (parent != null && parent != undefined) {
            formData.append('parent', parent.id.toString());
            formData.append('parent_type', parent.type);
        }
        formData.append('description', description);
        if (isStoredStory) {
            formData.append('author', author);
            formData.append('type', "storysave");
        }
        else {
            formData.append('type', 'userstory');
        }
        tags.tagsArray.forEach(element => {
            formData.append('tags', element);
        });
        /*@ts-ignore*/
        formData.append('recording', {
            uri: uri,
            name: uri,
            type: 'audio/mpeg'
        });

        formData.append('image', {
            uri: image,
            name: image,
            type: 'image/*'
        });
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', host + 'stories');
        xhr.send(formData);
        xhr.onreadystatechange = e => {
            console.log('GOT HERE');
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200) {
                navigation.navigate('HomeScreen')
                Alert.alert("Your submission is under review!")
            } else {
                console.log('error', xhr.responseText);
                Alert.alert("Sorry something went wrong, please try again");
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
                {userType === 'ADMIN' ?
                    <View>
                        <Text style={styles.input}>Is this a Story for the Story Save Collection?</Text>
                        <Picker
                            selectedValue={isStoredStory}
                            style={{ height: 50, width: 100 }}
                            onValueChange={(itemValue, itemIndex) => setIsStoredStory(itemValue)}>
                            <Picker.Item label="Yes" value={true} />
                            <Picker.Item label="No" value={false} />
                        </Picker>


                        {isStoredStory
                            ? <Input
                                style={styles.input}
                                placeholder="Author"
                                onChangeText={(text) => handleOnChangeAuthor(text)}
                            />
                            : null
                        }

                    </View> :
                    null
                }

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
                    style={styles.submitButtonImage}
                    onPress={onImagePickerPress}
                // disabled={title === ""}
                >
                    <Text
                        style={styles.buttonTextImage}>
                        Upload Thumbnail Image
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.submitButton}
                    onPress={handleSubmit}
                // disabled={title === ""}
                >
                    <Text
                        style={styles.buttonText}>
                        Submit
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
    textImagePicker: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: Colors.light.tint,
        fontSize: 15,
        textDecorationLine: 'underline',
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
    submitButtonImage: {
        backgroundColor: Colors.light.text,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    buttonTextImage: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
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