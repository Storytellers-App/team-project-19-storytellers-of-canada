import React, { useEffect, useState, memo, useContext } from 'react';
import {
    View,
    TextInput,
    Image,
    ScrollView,
    StyleSheet,
    ScrollViewProps,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import { useScrollToTop, useTheme } from '@react-navigation/native';
import {
    Card,
    Text,
    Avatar,
    Subheading,
    IconButton,
    Divider,
    Dialog,
    Portal,
    Button,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserStoryType, ResponseType } from '../../types';
import styles from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { HOST } from '../../config';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../AppContext';

export type UserStoryProps = {
    story: ResponseType,
}
let url = HOST

const Footer = (props: UserStoryProps) => {
    const [user, setUser] = useState<string | null>(null);
    const [likesCount, setLikesCount] = useState(props.story.numLikes);
    const [userLike, setUserLike] = useState(props.story.isLiked);
    const [replyVisible, setReplyVisible] = useState(false);
    const { setIsPlaying , setIsRadioPlaying} = useContext(AppContext);
    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await AsyncStorage.getItem("username");
            setUser(currentUser);
        }
        fetchUser();
    }, [])


    const submitLike = async () => {

        try {
            axios({
                method: 'post', url: url + 'stories/addlike', data: {
                    id: props.story.id,
                    type: props.story.type,
                    username: user
                }

            })
                .then(response => {
                    likesCount === undefined ? 1 :
                        setLikesCount(likesCount + 1);
                    setUserLike(true);
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (e) {
            console.log(e);
        }
    }

    const removeLike = async () => {
        try {
            axios({
                method: 'post', url: url + 'stories/removelike', data: {
                    id: props.story.id,
                    type: props.story.type,
                    username: user
                }

            })
                .then(response => {
                    likesCount === undefined ? 0 :
                        setLikesCount(likesCount - 1);
                    setUserLike(false);
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (e) {
            console.log(e);
        }
    }


    const onLike = async () => {
        if (user === undefined || user === null || user === "") {
            Alert.alert("Please login to like a story");
            return;
        }
        if (!userLike) {
            await submitLike()
        } else {
            await removeLike();
        }

    }

    const navigation = useNavigation()

    const audioReply = () => {
        setReplyVisible(false);
        setIsPlaying(false);
        setIsRadioPlaying(false);
        navigation.navigate("NewRecording", { parent: props.story, username: user });
    }

    const commentReply = () => {
        setReplyVisible(false);
        navigation.navigate("NewComment", { parent: props.story, user: user })
    }

    const hideDialog = () => {
        setReplyVisible(false);
    }

    const showDialog = () => {
        if (user === undefined || user === null || user === "") {
            Alert.alert("Please login to record a story");
            return;
        }
        setReplyVisible(true);
    }


    return (
        <View style={styles.iconcontainer}>
            <View style={styles.icon}>
                <IconButton size={16} icon={!userLike ? "heart-outline" : "heart"} onPress={onLike} color={!userLike ? 'grey' : 'red'} />
                {!!likesCount && <Text style={{
                    marginLeft: 5,
                    color: 'grey',
                    textAlign: 'center'
                }}>{likesCount}</Text>}
            </View>
            <View style={styles.icon}>
                <IconButton size={16} icon="comment-outline" onPress={showDialog} />
                {!!props.story.numReplies && <Text style={{
                    marginLeft: 5,
                    color: 'grey',
                    textAlign: 'center'
                }}>{props.story.numReplies}</Text>}
            </View>
            <Portal>
                <Dialog visible={replyVisible} onDismiss={hideDialog} style={{ backgroundColor: 'white' }}>
                    <Dialog.Title style={{ color: 'black' }}>Reply</Dialog.Title>
                    <Dialog.Content>
                        <View style={styles.replyMenu}>
                            <TouchableOpacity onPress={commentReply}>
                                <View style={styles.replyOption}>
                                    <IconButton size={30} icon="comment-text" />
                                    <Text>Comment</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={audioReply}>
                                <View style={styles.replyOption}>
                                    <IconButton size={30} icon="microphone" />
                                    <Text>Audio</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Dialog.Content>
                </Dialog>
            </Portal>
            <IconButton style={styles.icon} size={16} icon="share-outline" />

        </View>
    );
};

export default memo(Footer);