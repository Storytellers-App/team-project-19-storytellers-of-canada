import React, { Component, useEffect, useState } from 'react'
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
import Feed from '../components/Feed';
import NewRecordingButton from '../components/NewRecordingButton';
import { UserType } from '../types';
import AsyncStorage from '@react-native-community/async-storage';




export default function HomeScreen() {
  const ref = React.useRef<ScrollView>(null);
  const [user, setUser] = useState<UserType | null>(null);
  useScrollToTop(ref);

  const colorScheme = useColorScheme();

  const getUser = async () => {
    const username = await AsyncStorage.getItem("username");
    const name = await AsyncStorage.getItem("name");
    const type = await AsyncStorage.getItem("image");
    const image = await AsyncStorage.getItem("image");
    let user = {
      username: username,
      name: name,
      type: type,
      image: image,
    } as UserType;
    setUser(user);
  }

  useEffect(() => {
    getUser();
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: 'white' }}>
        <View style={{ marginLeft: 7 }}>
          <ProfilePicture image={user === null ? undefined : user.image === null ? 'https://ui-avatars.com/api/?background=006699&color=fff&name=' + user.name : user.image} size={45} />
        </View>
        <Appbar.Content title="Home" />
        <Appbar.Action icon="magnify" />
        {/* <Appbar.Action icon="dots-vertical"  />  */}
      </Appbar.Header>
      <Feed></Feed>
      <NewRecordingButton user={user?.username}/>
    </View>
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