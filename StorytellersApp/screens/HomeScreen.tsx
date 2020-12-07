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
  Searchbar,
  Appbar,
  Button,
  Portal,
} from 'react-native-paper';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ProfilePicture from '../components/ProfilePicture';
import UserStory from '../components/UserStory';
import Feed from '../components/Feed';
import NewRecordingButton from '../components/NewRecordingButton';
import { UserType } from '../types';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-paper/lib/typescript/src/components/Avatar/Avatar';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SearchBar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';




export default function HomeScreen() {
  const ref = React.useRef<TextInput>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [searchText, setSearchText] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
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

  const onChangeSearch = (query: string) => {
    setSearchText(query);
  }

  const onSubmit = () => {
    setSearchQuery(searchText);
  }

  useEffect(() => {
    if (searchText == '' && !ref.current?.isFocused()) {
      setSearchQuery(searchText);
    }
  }, [searchText, focus])

  useEffect(() => {
    getUser();
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: "white" }}>
        <View style={{ marginLeft: 7 }}>
          <ProfilePicture
            image={
              user === null
                ? undefined
                : user.image === null
                ? "https://ui-avatars.com/api/?background=006699&color=fff&name=" +
                  user.name
                : user.image
            }
            size={45}
          />
        </View>
        {/* <Appbar.Content title="Home" /> */}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Searchbar
            ref={ref}
            style={{ elevation: 0 }}
            placeholder="Search"
            onFocus={() => setFocus(true)}
            onChangeText={onChangeSearch}
            value={searchText}
            onSubmitEditing={onSubmit}
            onEndEditing={() => setFocus(false)}
          />
        </View>
        <Button
          onPress={() => {
            setHelpOpen(!helpOpen);
          }}
        >
          HELP
        </Button>
        {helpOpen && (
          <Portal>
            <View style={styles.faded}>
              <View style={styles.message}>
                <Text style={styles.messageTextLoud}>This is the Home Screen</Text>
                <Text style={styles.messageText}>All of the stories made by users will appear here. You can scroll through them, or click on any story to view its comments.</Text>
                <Text style={styles.messageText}>If you want to "like" a story, tap the heart. If you want to comment on a story, tap the speech bubble.</Text>
              </View>
              <View style={styles.message2}>
              <Text style={styles.messageText}>Tap the blue microphone button to record your own story!</Text>
              </View>
            </View>
            <TouchableOpacity
              style={{ height: "100%" }}
              onPress={() => setHelpOpen(false)}
            />
          </Portal>
        )}
        {/* <Appbar.Action icon="dots-vertical"  />  */}
      </Appbar.Header>
      <Feed key={searchQuery} search={searchQuery}></Feed>
      <NewRecordingButton user={user?.username} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 16,
    backgroundColor: "transparent",
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
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    flex: 1,
  },
  faded: {
    backgroundColor: "#00000099",
    position: "absolute",
    zIndex: 0,
    height: "100%",
    width: "100%",
  },
  message: {
    top: "15%",
    margin: "6%",
    padding: "2%",
    backgroundColor: "white",
    textAlign: "center",
  },
  message2: {
    top: "30%",
    margin: "15%",
    marginRight: "35%",
    padding: "0%",
    backgroundColor: "white",
    textAlign: "center",
  },
  messageText: {
    textAlign: "left",
    fontSize: 14,
    margin: 12,
  },
  messageTextLoud: {
    textAlign: "center",
    fontWeight: "bold",
    padding: 3,
    fontSize: 16,
  },
});