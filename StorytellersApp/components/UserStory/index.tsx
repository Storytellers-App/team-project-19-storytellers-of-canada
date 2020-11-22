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
import Tags from '../Tags';
export type UserStoryProps = {
    story: UserStoryType,
    admin?: boolean,
}
import Footer from '../CardFooter';
import AdminFooter from '../AdminFooter';

type ControlProps = {
    props: UserStoryProps,
}
const Controls = ({props} : ControlProps) => {
    if(props.admin == true){
        return <AdminFooter story={props.story}></AdminFooter>;
    }
    else{
        return <Footer story={props.story} ></Footer>;
    }
}
function UserStory(props: UserStoryProps) {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const storyDetails = (story: UserStoryType) => {
        navigation.push("StoryResponse", { 'story': story });
    }
    const colorScheme = useColorScheme();
    return (

        <Card style={styles.card}>
            <TouchableWithoutFeedback onPress={() => { storyDetails(props.story) }}>
                <View>
                    <View style={[styles.row, styles.attribution,]}>
                        <ProfilePicture image={props.story.user.image === undefined ? 'https://ui-avatars.com/api/?background=006699&color=fff&name=' + props.story.user.name : props.story.user.image} size={42} />
                        <View>
                            <Text style={styles.titleStyle}
                            >{props.story.title} </Text>
                            <View style={styles.userRow}>
                                <Text style={styles.name}>{props.story.user.name}</Text>
                                <Text style={styles.username}>{props.story.user.username}</Text>
                                <Text style={styles.createdAt} >{moment(props.story.creationTime).fromNow()}</Text>

                            </View>
                        </View>

                    </View>
                    <Card.Content style={styles.content}>
                        <Text>
                            {props.story.description}
                        </Text>
                        <StoryPlayer />

                    </Card.Content>
                </View>
            </TouchableWithoutFeedback>
            <Tags tags={props.story.tags}></Tags>
            <Divider />
            <Controls props={props}></Controls>
        </Card>

    );
}
export default memo(UserStory);
