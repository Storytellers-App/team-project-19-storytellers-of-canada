
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

const Story = ({ route, navigation }: Props) => {
    const story = route.params.story
    if ((story as StorySaveType).author) {
        return <Text>Testing stored story</Text>;
    }
    else {
        return <UserStory story={route.params.story as UserStoryType}></UserStory>;
    }
}
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
        <SafeAreaView>
        <FlatList
            ListHeaderComponent={<Story route={route} navigation={navigation}></Story>}
            data={userstories as UserStoryType[]}
            renderItem={({ item }) => <UserStory story={item} />}
            keyExtractor={item => item.id.toString()}
            // refreshing={loading}
            // onRefresh={fetchStories}
            // onEndReached={loadMore}
            // onEndReachedThreshold={0.5}
        />
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    input: {
        padding: 16,
        backgroundColor: 'transparent',
        margin: 0,
    },
    card: {
        marginVertical: 8,
        borderRadius: 0,
    },
    cover: {
        height: 160,
        borderRadius: 0,
    },
    content: {
        marginBottom: 12,
    },
    attribution: {
        margin: 12,
    },
    author: {
        marginHorizontal: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        flex: 1,
    },
});