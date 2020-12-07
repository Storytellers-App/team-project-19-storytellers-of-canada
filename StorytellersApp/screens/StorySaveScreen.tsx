import React, { Component, useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, ScrollView, StatusBar, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import StorySave from '../components/StorySave';
import {
  Searchbar,
  Appbar,
  Button,
  Portal,
} from 'react-native-paper';

export default function StorySaveScreen() {
  const ref = React.useRef<TextInput>(null);
  const [searchText, setSearchText] = React.useState('');
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
              <Text style={styles.message}>This is the Saved Story Collection</Text>
            </View>
            <TouchableOpacity
              style={{ height: "100%" }}
              onPress={() => setHelpOpen(false)}
            />
          </Portal>
        )}
        {/* <Appbar.Action icon="dots-vertical"  />  */}
      </Appbar.Header>
      <StorySave key={searchQuery} search={searchQuery}></StorySave>
    </View>
  );
}

const styles = StyleSheet.create({
  faded: {
    backgroundColor: '#00000099',
    position: 'absolute',
    zIndex: 0,
    height: '100%',
    width: '100%',
},
message: {
    top: '15%',
    margin: '6%',
    padding: '2%',
    backgroundColor: 'white',
    textAlign: "center"
},
});