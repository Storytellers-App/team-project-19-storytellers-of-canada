import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    Image,
    ScrollView,
    StyleSheet,
    ScrollViewProps,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { useScrollToTop, useTheme } from '@react-navigation/native';
import {
    Card,
    Text,
    Avatar,
    Subheading,
    IconButton,
    Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserStoryType } from '../../types';
import styles from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export type UserStoryProps = {
    story: UserStoryType,
}
let url = "" //local ip address 

const Footer = (props: UserStoryProps) => {
    const [user, setUser] = useState<string | null>(null);
    const [likesCount, setLikesCount] = useState(props.story.num_likes);
    const [userLike, setUserLike] = useState(false); // Temporary. Should add persistent user likes
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
        // if (!user) {
        //     return;
        // }
        if (!userLike) {
            await submitLike()
        } else {
            await removeLike();
        }

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
                <IconButton size={16} icon="comment-outline" />
                {!!props.story.num_replies && <Text style={{
                    marginLeft: 5,
                    color: 'grey',
                    textAlign: 'center'
                }}>{props.story.num_likes}</Text>}
            </View>
            <IconButton style={styles.icon} size={16} icon="share-outline" />

        </View>
    );
};

export default Footer;