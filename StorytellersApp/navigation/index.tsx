import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import { AppContext } from '../AppContext';
import LoginScreen from '../screens/LoginScreen';
import NewCommentScreen from '../screens/NewCommentScreen';
import NewRecordingScreen from '../screens/NewRecordingScreen';
import NewStoryScreen from '../screens/NewStoryScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserScreen from '../screens/UserScreen';
import StoryResponseScreen from '../screens/StoryResponseScreen';
import { currentStory, ResponseType, RootStackParamList, UserType } from '../types';
import { UserContext } from '../UserContext';
import BottomTabNavigator from './BottomTabNavigator';
import { DrawerContent } from './DrawerContent';
import LinkingConfiguration from './LinkingConfiguration';


// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
// { colorScheme }: { colorScheme: ColorSchemeName }, admin : any
export default function Navigation(props: any) {

  return (
    <NavigationContainer 
      linking={LinkingConfiguration}
      theme={DefaultTheme}>     
      <RootNavigator userProp={props.user} />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();
const NavigationDrawer = createDrawerNavigator();

function BaseNavigation({ navigation, route }) {
  const [story, setStory] = useState<currentStory | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [position, setPosition] = useState<number | null>(null);
  const [isSeekingComplete, setIsSeekingComplete] = useState<boolean>(false);
  const [isRadioPlaying, setIsRadioPlaying] = useState<boolean>(false);
  const [fullStory, setFullStory] = useState<ResponseType | null>(null);
  return (
    <AppContext.Provider value={{
      story: story,
      isPlaying: isPlaying,
      position: position,
      isSeekingComplete: isSeekingComplete,
      isRadioPlaying: isRadioPlaying,
      fullStoryType: fullStory,
      setStory: (newStory: currentStory) => setStory(newStory),
      setPosition: (newPosition: number) => setPosition(newPosition),
      setIsPlaying: (isPlaying: boolean) => setIsPlaying(isPlaying),
      setIsSeekingComplete: (isSeekingComplete: boolean) => setIsSeekingComplete(isSeekingComplete),
      setIsRadioPlaying: (isRadioPlaying: boolean) => setIsRadioPlaying(isRadioPlaying),
      setFullStoryType: (fullStoryType: ResponseType) => setFullStory(fullStoryType)
    }}>
      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" >
          {props =>
              <BottomTabNavigator user={route.params.user} />
          }
        </Stack.Screen>
        <Stack.Screen name="NewRecording" component={NewRecordingScreen} />
        <Stack.Screen name="NewStory" component={NewStoryScreen} />
        <Stack.Screen name="StoryResponse" component={StoryResponseScreen} />
        <Stack.Screen name="NewComment" component={NewCommentScreen} />
        <Stack.Screen name="UserScreen" component={UserScreen} />
        <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      </Stack.Navigator>
    </AppContext.Provider>

  );
}
function RootNavigator({ userProp }: { userProp: UserType | undefined }) {
  const [user, setUser] = useState<UserType | undefined>(userProp);

  return (
    <UserContext.Provider value={{
      user: user,
      setUser: (user: UserType | undefined) => setUser(user)
    }}>
      <NavigationDrawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
        <NavigationDrawer.Screen name="Home" component={BaseNavigation} initialParams={{ user: userProp }} />
        <NavigationDrawer.Screen name="ProfilePage" component={ProfileScreen} />
        <NavigationDrawer.Screen name="Privacy" component={PrivacyScreen} />
        <NavigationDrawer.Screen name="Login" component={LoginScreen} />
      </NavigationDrawer.Navigator>
    </UserContext.Provider>


  );
}
