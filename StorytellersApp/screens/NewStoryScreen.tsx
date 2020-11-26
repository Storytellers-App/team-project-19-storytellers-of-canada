import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, TouchableHighlight, ScrollView, Alert } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Input, Button } from 'react-native-elements';
import Colors from '../constants/Colors';
import TagInput from 'react-native-tags-input';
import { Feather } from '@expo/vector-icons';
import * as Config from '../config';


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
    const { recording, username } = route.params;
    console.log("TIS TIME TO SEE URI");
    console.log(recording);

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
        // let blob = await fetch(recording).then(r => r.blob());
        // console.log("the blobbbbbbbbbbbbbbbbbbbbbb");
        
        // const formData = new FormData();
        // formData.append('username', username);
        // formData.append('title', title);
        // formData.append('description', description);
        // formData.append('tags', JSON.stringify(tags.tagsArray));
        // formData.append('recording', blob , 'recording');
        // fetch(host + 'stories', {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //         // 'Content-Type': 'application/x-www-form-urlencoded',
        //       },
        //     method: 'PUT',
        //     body: formData
        // }).then(response => response.json())
        // .then((responseData) => {
        //     console.log(responseData);
        //     navigation.navigate('HomeScreen')
        //     //Alert.alert("Your submission is under review!")
        // })
        // .catch((error) => {
        //     Alert.alert("Sorry something went wrong")
        //     console.error(error);
        // });
        Alert.alert("Your submission is under review!");
        
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