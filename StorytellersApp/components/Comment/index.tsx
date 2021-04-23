import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import * as React from 'react';
import { memo } from 'react';
import {
    Alert,
    TouchableWithoutFeedback, View
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import {
    Card,
    Divider, IconButton, Menu, Text
} from 'react-native-paper';
import useColorScheme from '../../hooks/useColorScheme';
import { CommentType, ResponseType, RootStackParamList, UserType } from '../../types';
import AdminFooter from '../AdminFooter';
import Footer from '../CardFooter';
import ProfilePicture from '../ProfilePicture';
import { LocalizationContext } from '../../LocalizationContext';
import { HOST } from '../../config';
import styles from './styles';
import axios from 'axios';
export type CommentProps = {
    comment: CommentType,
    admin?: boolean,
    disableResponse?: boolean,
    user: UserType | undefined | null,
}

type ControlProps = {
    props: CommentProps,
}
const Controls = ({ props }: ControlProps) => {
    if (props.admin == true) {
        return <AdminFooter story={props.comment} user={props.user}></AdminFooter>;
    }
    else {
        return <Footer story={props.comment} user={props.user}></Footer>;
    }
}
function Comment(props: CommentProps) {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { t, locale, setLocale } = React.useContext(LocalizationContext);
    const responseScreen = (header: ResponseType) => {
        navigation.push("StoryResponse", { 'header': header });
    }
    const colorScheme = useColorScheme();
    const [menuOpen, setMenuOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false);
    const submitFlag = async () => {
        try {
            setLoading(true);

            axios({
                method: 'post', url: HOST + 'flag', data: {
                    id: props.comment.id,
                    type: "comment",
                    auth_token: props.user?.authToken,
                }
            })
                .then(response => {
                    setLoading(false);
                    setMenuOpen(false);
                    Alert.alert(t('flagSentForReview'));
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                    setMenuOpen(false);
                });
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    }
    return (

        <Card style={styles.card}>
            <TouchableWithoutFeedback disabled={props.disableResponse == true ? props.disableResponse : false} onPress={() => { responseScreen(props.comment) }}>
                <View>
                    <View style={[styles.row, styles.attribution,]}>
                        <TouchableOpacity onPress={() => navigation.push("UserScreen", { 'user': props.comment.user })}>
                            <ProfilePicture image={props.comment.user.image === undefined || props.comment.user.image === null || props.comment.user.image === "" ? 'https://ui-avatars.com/api/?background=006699&color=fff&name=' + props.comment.user.name : props.comment.user.image} size={42} />
                        </TouchableOpacity>
                        <View style={{flex: 1}}>
                            <View style={styles.userRow}>
                                <Text style={styles.name}>{props.comment.user.name}</Text>
                                <Text style={styles.username}>{props.comment.user.username}</Text>
                                <Text style={styles.createdAt} >{moment(props.comment.creationTime).fromNow()}</Text>
                            </View>
                        </View>

                        <View style={{marginRight: -15}}>
                            <Menu
                                visible={menuOpen}
                                onDismiss={() => setMenuOpen(false)}
                                anchor={<IconButton size={23} icon="dots-vertical" onPress={() => setMenuOpen(true)} />}>
                                <Menu.Item icon='flag' onPress={() => submitFlag()} title="Flag Post" />
                            </Menu>
                        </View>

                    </View>
                    <Card.Content style={styles.content}>
                        <Text>
                            {props.comment.comment}
                        </Text>
                    </Card.Content>
                </View>
            </TouchableWithoutFeedback>
            <Divider />
            <Controls props={props}></Controls>
        </Card>

    );
}
export default memo(Comment);
