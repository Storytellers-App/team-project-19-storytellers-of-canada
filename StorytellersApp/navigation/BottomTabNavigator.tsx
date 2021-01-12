import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import HomeScreen from '../screens/HomeScreen';
import RadioPlayer from '../screens/RadioPlayer';
import StorySaveScreen from '../screens/StorySaveScreen';
import { AdminPanelParamList, BottomTabParamList, HomeNavigatorParamList, RadioPlayerParamList, TabTwoParamList, UserType } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator({user} : {user: UserType}) {
  const colorScheme = useColorScheme();
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: Colors.light.tint,
        showLabel: false,
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="md-home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="StoredStories"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIconMat name="book-play" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="RadioPlayer"
        component={RadioNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="md-radio" color={color} />,
        }}
      />
       {user != null && user.type === 'ADMIN' ? <BottomTab.Screen
        name="AdminPanelScreen"
        component={AdminPanelNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="md-construct" color={color} />,
        }}
      /> : null}
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}
function TabBarIconMat(props: { name: string; color: string }) {
  return <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<HomeNavigatorParamList>();

function HomeNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options= {{
          headerShown: false
        }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={StorySaveScreen}
        options= {{
          headerShown: false
        }}
      />
    </TabTwoStack.Navigator>
  );
}

const RadioPlayerStack = createStackNavigator<RadioPlayerParamList>();

function RadioNavigator() {
  return (
    <RadioPlayerStack.Navigator>
      <RadioPlayerStack.Screen
        name="RadioPlayer"
        component={RadioPlayer}
        options={{ headerShown: false }}
      />
    </RadioPlayerStack.Navigator>
  )
}

const TabThreeStack = createStackNavigator<AdminPanelParamList>();

function AdminPanelNavigator() {
  return (
    <TabThreeStack.Navigator>
      <TabThreeStack.Screen
        name="AdminPanelScreen"
        component={AdminPanelScreen}
        options={{ headerShown: false }}
      />
    </TabThreeStack.Navigator>
  );
}
