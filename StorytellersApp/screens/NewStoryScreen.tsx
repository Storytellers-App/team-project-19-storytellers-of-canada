import { Feather } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Picker, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Input } from 'react-native-elements';
import TagInput from 'react-native-tags-input';
import * as Config from '../config';
import Colors from '../constants/Colors';
import { RootStackParamList } from '../types';
import { Audio } from 'expo-av';


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
    const { parent, recording, user } = route.params;
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [author, setAuthor] = useState("");
    const [isStoredStory, setIsStoredStory] = useState(false);
    const [description, setDescription] = useState("");
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [long, setLong] = useState(false);
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
            const { sound: playbackObject } = await Audio.Sound.createAsync(
                { uri: recording },
                { shouldPlay: false }
            );
    
            playbackObject.loadAsync({ uri: recording });
            playbackObject.getStatusAsync().then((status) => {
                if (status.isLoaded) {
                    try {
                        if (status.durationMillis === undefined ? false : status.durationMillis > 192000) {
                            console.log('LONG SET TO TRUE');
                            setLong(true);
                        }
                    }
    
                    catch (e) {
                        console.log(e);
                    }
                }
            })
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
        setIsLoadingImage(true);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).then((result) => {
            if (!result.cancelled) {

                setImage(result.uri);
                Alert.alert("Image has been selected");
            }
            else {
                Alert.alert("Something went wrong, please try again")
            }
            setIsLoadingImage(false);
        });
        setIsLoadingImage(false);

    }
    const handleSubmit = async () => {
        
        if (recording === null) {
            return;
        }
        if (isLoadingSubmit){
            return;
        }

        if (title === ""){
            Alert.alert("Please give your story a title!");
            return;
        }

        if (isStoredStory && author===""){
            Alert.alert("Please give the story an author!");
            return;
        }
        setIsLoadingSubmit(true);
        const formData = new FormData();
        let uri = recording
        formData.append('auth_token', user.authToken);
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
        if (image !== "") {
            formData.append('image', {
                uri: image,
                name: image,
                type: 'image/*'
            });
        }
        console.log(long);

        if (!isStoredStory && long){
            Alert.alert("Stories must be maximum 3 minutes in length");
            setIsLoadingSubmit(false);
            return;
        }
        else {
            const xhr = new XMLHttpRequest();
        xhr.open('PUT', host + 'stories');
        xhr.send(formData);
        xhr.onreadystatechange = e => {
            console.log('GOT HERE');
            if (xhr.readyState !== 4) {
                setIsLoadingSubmit(false);

                return;
            }
            if (xhr.status === 200) {
                navigation.navigate('HomeScreen')
                setIsLoadingSubmit(false);
                Alert.alert("Your submission is under review!")
            } else {
                setIsLoadingSubmit(false);
                console.log('error', xhr.responseText);
                Alert.alert("Sorry something went wrong, please try again");
            }
        };
        }
        
    }

    return (

        <ScrollView style={styles.container}>
            {/* Registration form */}
            <View>
                <Text style={styles.title}>Submit Your New Story For Review!</Text>
            </View>
            <View>
                {user.type === 'ADMIN' ?
                    <View>
                        <Text style={styles.input}>{' Is this a Story for the Story Save \n Collection?'}</Text>
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
                {image !== "" ? <Image
                    style={styles.tinyLogo}
                    source={{
                        uri: image,
                    }}
                /> : null}
                
            </View>
            <View>
                <View style={styles.loading}>
                    {isLoadingImage ? <ActivityIndicator size="large" color={Colors.light.tint} />
                        : null}

                    {isLoadingImage ? <Text>{'\t \t \t Processing Image...'}</Text>
                        : null}

                    {isLoadingSubmit ? <ActivityIndicator size="large" color={Colors.light.tint} />
                        : null}

                    {isLoadingSubmit ? <Text>{'\t \t \t Submitting Your Story...'}</Text>
                        : null}

                </View>


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
                    disabled={isLoadingSubmit}

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
    loading: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginVertical: 15,
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
    tinyLogo: {
        width: 150,
        height: 150,
        marginVertical: 10,
        resizeMode: 'contain',
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