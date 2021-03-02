import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import * as React from 'react';
import { memo } from 'react';
import {
    Image,
    TouchableWithoutFeedback, View
} from 'react-native';
import {
    Card,
    Divider, Text
} from 'react-native-paper';
import useColorScheme from '../../hooks/useColorScheme';
import { ResponseType, RootStackParamList, UserStoryType, UserType } from '../../types';
import AdminFooter from '../AdminFooter';
import AudioPlayer from '../AudioPlayer';
import Footer from '../CardFooter';
import ProfilePicture from '../ProfilePicture';
import Tags from '../Tags';
import styles from './styles';
export type UserStoryProps = {
    story: UserStoryType,
    admin?: boolean,
    user: UserType | undefined | null,
    disableResponse?: boolean;
}



function UserStory(props: UserStoryProps) {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const responseScreen = (header: ResponseType) => {
        navigation.push("StoryResponse", { 'header': header });
    }
    const Controls = () => {
        if (props.admin == true) {
            return <AdminFooter story={props.story} user={props.user}></AdminFooter>;
        }
        else {
            return <Footer story={props.story} user={props.user}></Footer>;
        }
    }
  
    const colorScheme = useColorScheme();
    return (

        <Card style={styles.card}>
            <TouchableWithoutFeedback disabled={props.disableResponse == true ? props.disableResponse : false} onPress={() => { responseScreen(props.story) }}>
                <View>
                    <View style={[styles.row, styles.attribution,]}>
                        <ProfilePicture image={props.story.user.image} size={45} name={props.story.user.name} />
                        <View style={{ flex: 1 }}>

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
                        {!!props.story.image && <Image
                            style={styles.topImage}
                            source={{
                                uri: props.story.image,
                            }}
                        />}
                        <Text style={{ marginBottom: 15 }}>
                            {props.story.description}
                        </Text>
                        <AudioPlayer newStory={props.story}></AudioPlayer>
                    </Card.Content>
                </View>
            </TouchableWithoutFeedback>
            <Tags tags={props.story.tags}></Tags>
            <Divider />
            <Controls ></Controls>
        </Card>

    );
}
function areEqual(prevProps, nextProps) {
    return prevProps.story.id === nextProps.story.id;
  }

export default memo(UserStory, areEqual);
