
import * as React from 'react';
import {
    View,
    TextInput,
    Image,
    ScrollView,
    StyleSheet,
    ScrollViewProps,
} from 'react-native';
import { useScrollToTop, useTheme } from '@react-navigation/native';
import {
    Card,
    Text,
    Avatar,
    Subheading,
    IconButton,
    Divider,
    Appbar,
} from 'react-native-paper';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ProfilePicture from '../components/ProfilePicture';
import UserStory from '../components/UserStory';
import { StoryType, UserStoryType, RootStackParamList, StorySaveType } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import userstories from '../data/userstoriestest';
import ResponseFeed from '../components/ResponseView'


type StoryDetailsRouteProp = RouteProp<RootStackParamList, 'StoryResponse'>;
type StoryDetailsNavigationProp = StackNavigationProp<
    RootStackParamList,
    'StoryResponse'
>;
type Props = {
    route: StoryDetailsRouteProp;
    navigation: StoryDetailsNavigationProp;
}

export default function StoryResponseScreen({ route, navigation }: Props) {
    const ref = React.useRef<ScrollView>(null);
    const story = route.params.story;
    useScrollToTop(ref);

    const colorScheme = useColorScheme();
    return (
        <View style={{flex: 1}}>
        <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.BackAction  onPress={() => navigation.goBack()}/>
        <Appbar.Content title="Responses"/>
        {/* <Appbar.Action icon="magnify"  />
        <Appbar.Action icon="dots-vertical"  /> */}
        </Appbar.Header>
        <ResponseFeed story={route.params.story}></ResponseFeed>
        </View>
    );
}
