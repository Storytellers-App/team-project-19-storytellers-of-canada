import * as React from 'react';
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
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import ProfilePicture from '../ProfilePicture';
import { Entypo } from '@expo/vector-icons';
import styles from './styles';
import moment from 'moment';
import { UserStoryType, RootStackParamList, ResponseType, CommentType, UserType } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { memo } from 'react';
import Tags from '../Tags';
export type CommentProps = {
    comment: CommentType,
    admin?: boolean,
    disableResponse?: boolean,
    user: UserType | undefined | null,
}
import Footer from '../CardFooter';
import AdminFooter from '../AdminFooter';

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
    const responseScreen = (header: ResponseType) => {
        navigation.push("StoryResponse", { 'header': header });
    }
    const colorScheme = useColorScheme();
    return (

        <Card style={styles.card}>
            <TouchableWithoutFeedback disabled={props.disableResponse == true ? props.disableResponse : false} onPress={() => { responseScreen(props.comment) }}>
                <View>
                    <View style={[styles.row, styles.attribution,]}>
                        <ProfilePicture image={props.comment.user.image === undefined ? 'https://ui-avatars.com/api/?background=006699&color=fff&name=' + props.comment.user.name : props.comment.user.image} size={42} />
                        <View>
                            <View style={styles.userRow}>
                                <Text style={styles.name}>{props.comment.user.name}</Text>
                                <Text style={styles.username}>{props.comment.user.username}</Text>
                                <Text style={styles.createdAt} >{moment(props.comment.creationTime).fromNow()}</Text>
                            </View>
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
