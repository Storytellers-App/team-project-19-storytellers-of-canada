import * as React from 'react';
import {StyleSheet} from 'react-native';
import { View , Text} from '../components/Themed';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type NewStoryRouteProp = RouteProp<RootStackParamList, 'NewStory'>;

export type NewStoryNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NewStory'
>;
type Props = {
    route: NewStoryRouteProp;
    navigation: NewStoryNavigationProp;
}

export default function NewStoryScreen({route, navigation}: Props) {
    const { recording, username } = route.params;
    console.log(recording);
    return (
        
        <View>
            <Text>
            {username}
            </Text>
        </View>
    )
}