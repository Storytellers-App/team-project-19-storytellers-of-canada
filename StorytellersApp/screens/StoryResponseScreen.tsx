
import { RouteProp, useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import {
    ScrollView, View
} from 'react-native';
import {
    Appbar
} from 'react-native-paper';
import ResponseFeed from '../components/ResponseView';
import useColorScheme from '../hooks/useColorScheme';
import { RootStackParamList } from '../types';
import { UserContext } from '../UserContext';


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
    const story = route.params.header;
    const { user } = React.useContext(UserContext);
    useScrollToTop(ref);

    const colorScheme = useColorScheme();
    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header style={{ backgroundColor: 'white' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Responses" />
                {/* <Appbar.Action icon="magnify"  />
        <Appbar.Action icon="dots-vertical"  /> */}
            </Appbar.Header>
            <ResponseFeed response={route.params.header} user={user}></ResponseFeed>
        </View>
    );
}
