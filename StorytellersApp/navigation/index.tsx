import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

import NewRecordingScreen from '../screens/NewRecordingScreen';
import NewStoryScreen from '../screens/NewStoryScreen';

import StoryResponseScreen from '../screens/StoryResponseScreen';
import NewCommentScreen from '../screens/NewCommentScreen';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
// { colorScheme }: { colorScheme: ColorSchemeName }, admin : any
export default function Navigation(props: any) {

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={ DefaultTheme}>
      <RootNavigator admin={props.admin}/>
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator({admin} : {admin: boolean}) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" >
      {props => <BottomTabNavigator admin={admin}/>}
      </Stack.Screen>
      <Stack.Screen name="NewRecording" component={NewRecordingScreen} />
      <Stack.Screen name="NewStory" component={NewStoryScreen} />
      <Stack.Screen name="StoryResponse" component={StoryResponseScreen} />
      <Stack.Screen name="NewComment" component={NewCommentScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
