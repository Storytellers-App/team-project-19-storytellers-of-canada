import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { memo, useContext, useState } from 'react';
import {
    Alert, TouchableOpacity, View
} from 'react-native';
import {
    Button, Dialog, IconButton,
    Paragraph, Portal, Text
} from 'react-native-paper';
import { AppContext } from '../../AppContext';
import { HOST } from '../../config';
import { LocalizationContext } from '../../LocalizationContext';
import { ResponseType, UserType } from '../../types';
import styles from './styles';

export type UserStoryProps = {
    story: ResponseType,
    user: UserType | undefined | null,
}
let url = HOST

const Footer = (props: UserStoryProps) => {
    const { t, locale, setLocale } = React.useContext(LocalizationContext);
    const {user} = props;
    const [loading, setLoading] = useState(false);
    const [userLike, setUserLike] = useState(props.story.isLiked);
    const [likesCount, setLikesCount] = useState(props.story.numLikes);
    const [replyVisible, setReplyVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const { setIsPlaying, setIsRadioPlaying } = useContext(AppContext);

    const submitLike = async () => {
        try {
            setLoading(true);
            setUserLike(true);
            likesCount === undefined ? 1 :
                setLikesCount(likesCount + 1);
            axios({
                method: 'post', url: url + 'stories/addlike', data: {
                    id: props.story.id,
                    type: props.story.type,
                    auth_token: user?.authToken,
                }
            })
                .then(response => {
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    }

    const removeLike = async () => {
        try {
            setLoading(true);
            setUserLike(false);
            likesCount === undefined ? 0 :
                setLikesCount(likesCount - 1);

            axios({
                method: 'post', url: url + 'stories/removelike', data: {
                    id: props.story.id,
                    type: props.story.type,
                    auth_token: user?.authToken
                }
            })
                .then(response => {
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    }


    const onLike = async () => {
        if (user === undefined || user === null) {
            Alert.alert(t('pleaseLoginToLike'));
            return;
        }
        if (loading) {
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
        navigation.navigate("NewRecording", { parent: props.story, user: user });
    }

    const commentReply = () => {
        setReplyVisible(false);
        navigation.navigate("NewComment", { parent: props.story, user: user })
    }

    const hideDialog = () => {
        setReplyVisible(false);
    }

    const showDialog = () => {
        if (user === undefined || user === null || user.username === "") {
            Alert.alert(t('pleaseLoginToRecord'));
            return;
        }
        setReplyVisible(true);
    }

    const showConfirmDelete = () => {
        if (user === undefined || user === null) {
            return;
        }
        setDeleteVisible(true);
    }

    const hideConfirmDelete = () => {
        setDeleteVisible(false);
    }

    const onDelete = async () => {
        if(loading){
            return;
        }
        let path = "stories"
        if(props.story.type === 'comment'){
            path = 'comment'
        }
        try {
            setLoading(true);
            setDeleted(true);
            hideConfirmDelete();
            axios({
                method: 'delete', url: url + path, data: {
                    id: props.story.id,
                    auth_token: user?.authToken,
                }
            })
                .then(response => {
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
}
    if(deleted){
      return (
        <View style={{  flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
             justifyContent: "space-around",}}>
        <IconButton size={16} icon="delete-forever-outline" />
        </View>
      );
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
                    <Dialog.Title style={{ color: 'black' }}>{t('reply')}</Dialog.Title>
                    <Dialog.Content>
                        <View style={styles.replyMenu}>
                            <TouchableOpacity onPress={commentReply}>
                                <View style={styles.replyOption}>
                                    <IconButton size={30} icon="comment-text" />
                                    <Text>{t('comment')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={audioReply}>
                                <View style={styles.replyOption}>
                                    <IconButton size={30} icon="microphone" />
                                    <Text>{t('audio')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Dialog.Content>
                </Dialog>
                <Dialog visible={deleteVisible} onDismiss={hideConfirmDelete} style={{ backgroundColor: 'white' }}>
                <Dialog.Content>
                    <Paragraph >{t('deleteConfirmation')}</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
            <Button onPress={hideConfirmDelete}>{t('cancel')}</Button>
            <Button style={{marginHorizontal: 15}}onPress={onDelete}>{t('yes')}</Button>
          </Dialog.Actions>
        
                </Dialog>
            </Portal>
            {(user?.type === 'ADMIN' ||  (props.story.user != null && props.story.user != undefined && props.story.user.username === user?.username)) && <View style={styles.icon}>
           <IconButton size={17} icon="delete-outline" onPress={showConfirmDelete}/>
            </View>}
        </View>
    );
};
export default memo(Footer);