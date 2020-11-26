import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import HomeScreen from '../screens/HomeScreen';
import StorySaveScreen from '../screens/StorySaveScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import { BottomTabParamList, HomeNavigatorParamList, TabTwoParamList, AdminPanelParamList } from '../types';
import ProfilePicture from '../components/ProfilePicture';
import { ScreenStackHeaderLeftView } from 'react-native-screens';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].tint,
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
          tabBarIcon: ({ color }) => <TabBarIcon name="md-radio" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="AdminPanelScreen"
        component={AdminPanelNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="md-construct" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
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
        options={{
          headerTitle: 'Home',
          headerTitleAlign: "center",
          headerLeftContainerStyle: {
            marginLeft: 15,
          },
          headerLeft: () => (
            <ProfilePicture />
          )
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
        options={{ headerTitle: 'Saved Stories' }}
      />
    </TabTwoStack.Navigator>
  );
}

const TabThreeStack = createStackNavigator<AdminPanelParamList>();

function AdminPanelNavigator() {
  return (
    <TabThreeStack.Navigator>
      <TabThreeStack.Screen
        name="AdminPanelScreen"
        component={AdminPanelScreen}
        options={{ headerTitle: 'Admin Panel' }}
      />
    </TabThreeStack.Navigator>
  );
}
