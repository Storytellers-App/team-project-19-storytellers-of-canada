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
import StoryPlayer from '../StoryPlayer';
import { Entypo } from '@expo/vector-icons';
import styles from './styles';
import moment from 'moment';
import { UserStoryType, RootStackParamList } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { memo } from 'react';
export type UserStoryProps = {
    story: UserStoryType,
}

const Footer = (props: UserStoryProps) => {
    return (
        <View style={styles.iconcontainer}>
            <View style={styles.icon}>
                <IconButton size={16} icon="heart-outline" />
                {!!props.story.numberOfLikes && <Text style={{
                    marginLeft: 5,
                    color: 'grey',
                    textAlign: 'center'
                }}>{props.story.numberOfLikes}</Text>}
            </View>
            <View style={styles.icon}>
                <IconButton size={16} icon="comment-outline" />
                {!!props.story.numberOfReplies && <Text style={{
                    marginLeft: 5,
                    color: 'grey',
                    textAlign: 'center'
                }}>{props.story.numberOfReplies}</Text>}
            </View>
            <IconButton style={styles.icon} size={16} icon="share-outline" />

        </View>
    );
};



function UserStory(props: UserStoryProps) {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const storyDetails = (story: UserStoryType) => {
        navigation.push("StoryResponse", {'story': story});
    }
    const colorScheme = useColorScheme();
    return (
        <TouchableWithoutFeedback onPress={() => { storyDetails(props.story) }}>
            <Card style={styles.card}>
                <View style={[styles.row, styles.attribution,]}>
                    <ProfilePicture size={42} />
                    <View>
                        <Text style={styles.titleStyle}
                        >{props.story.title} </Text>
                        <View style={styles.userRow}>
                            <Subheading style={styles.author}>{props.story.user.name}</Subheading>
                            <Subheading style={styles.author}>{props.story.user.username}</Subheading>
                            <Text style={styles.dateStyle} >{moment(props.story.creationTime).fromNow()}</Text>

                        </View>
                    </View>

                </View>
                <Card.Content style={styles.content}>
                    <Text>
                        {props.story.description}
                    </Text>
                    <StoryPlayer />
                </Card.Content>
                <Divider />
                <Footer story={props.story} />
            </Card>
        </TouchableWithoutFeedback>
    );
}
export default memo(UserStory);
