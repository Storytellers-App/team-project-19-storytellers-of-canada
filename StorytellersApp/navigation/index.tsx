import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList, currentStory } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

import NewRecordingScreen from '../screens/NewRecordingScreen';
import NewStoryScreen from '../screens/NewStoryScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StoryResponseScreen from '../screens/StoryResponseScreen';
import NewCommentScreen from '../screens/NewCommentScreen';
import { Drawer } from 'react-native-paper';
import { AppContext } from '../AppContext';

import BottomPlayer from '../components/BottomPlayer';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
// { colorScheme }: { colorScheme: ColorSchemeName }, admin : any
export default function Navigation(props: any) {
  const [story, setStory] = useState<currentStory | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [position, setPosition] = useState<number|null>(null);
  const [isSeekingComplete, setIsSeekingComplete] = useState<boolean>(false);
  return (
    <AppContext.Provider value={{
      story: story,
      isPlaying: isPlaying,
      position: position,
      isSeekingComplete: isSeekingComplete,
      setStory: (newStory: currentStory) => setStory(newStory),
      setPosition: (newPosition: number) => setPosition(newPosition),
      setIsPlaying: (isPlaying: boolean) => setIsPlaying(isPlaying),
      setIsSeekingComplete: (isSeekingComplete: boolean) => setIsSeekingComplete(isSeekingComplete),
    }}>
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={ DefaultTheme}>
      <RootNavigator admin={props.admin}/>
      <BottomPlayer></BottomPlayer>
    </NavigationContainer>
    </AppContext.Provider>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();
const NavigationDrawer = createDrawerNavigator();
function BaseNavigation({ navigation, route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Root" >
    {props => <BottomTabNavigator admin={route.params.admin}/>}
    </Stack.Screen>
    <Stack.Screen name="NewRecording" component={NewRecordingScreen} />
    <Stack.Screen name="NewStory" component={NewStoryScreen} />
    <Stack.Screen name="StoryResponse" component={StoryResponseScreen} />
    <Stack.Screen name="NewComment" component={NewCommentScreen} />
    <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
  </Stack.Navigator>
  );
}
function RootNavigator({admin} : {admin: boolean}) {
  let adminClean = admin === true ? admin : false;
  return (
    <NavigationDrawer.Navigator>
      <NavigationDrawer.Screen name="Home" component={BaseNavigation} initialParams={{admin: adminClean}} />
      <NavigationDrawer.Screen name="NotFound" component={NotFoundScreen}/>
    </NavigationDrawer.Navigator>
   
  );
}
