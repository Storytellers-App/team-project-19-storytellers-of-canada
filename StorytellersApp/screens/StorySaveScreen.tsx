import React, { Component, useEffect, useState, useContext } from 'react'
import { SafeAreaView, View, StyleSheet, ScrollView, StatusBar, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import StorySave from '../components/StorySave';
import {
  Searchbar,
  Appbar,
  Button,
  Portal,
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { UserType } from '../types';
import { UserContext } from '../UserContext';

export default function StorySaveScreen() {
  const ref = React.useRef<TextInput>(null);
  const [searchText, setSearchText] = React.useState('');
  const { user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);

  const onChangeSearch = (query: string) => {
    setSearchText(query);
  }

  useEffect(() => {
    if (searchText == '' && !ref.current?.isFocused()) {
      setSearchQuery(searchText);
    }
  }, [searchText, focus])

  const onSubmit = () => {
    setSearchQuery(searchText);
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: 'white' }}>
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
                <Text style={styles.messageTextLoud}>This is the Saved Stories Screen</Text>
                <Text style={styles.messageText}>All of the stories here are from the SC-Radio-CC StorySave collection. You can scroll through them, or click on any story to view its comments.</Text>
                <Text style={styles.messageText}>If you want to "like" a story, tap the heart. If you want to comment on a story, tap the speech bubble.</Text>
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
      <StorySave key={searchQuery} search={searchQuery} user={user}></StorySave>
    </View>
  );
}

const styles = StyleSheet.create({
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