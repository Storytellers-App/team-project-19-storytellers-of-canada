import { useScrollToTop } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  Appbar,
  Button,
  Portal, Searchbar
} from 'react-native-paper';
import StorySave from '../components/StorySave/';
import { LocalizationContext } from '../LocalizationContext';
import { UserContext } from '../UserContext';

export default function StorySaveScreen() {
  const { t, locale, setLocale } = React.useContext(LocalizationContext);
  const ref = React.useRef<TextInput>(null);
  const scrollRef = React.useRef(null);
  useScrollToTop(scrollRef);
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
            placeholder={t('search')}
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
          {t('helpCapitals')}
        </Button>
        {helpOpen && (
          <Portal>
            <View style={styles.faded}>
              <View style={styles.message}>
                <Text style={styles.messageTextLoud}>{t('helpStorySaveTitle')}</Text>
                <Text style={styles.messageText}>{t('helpStorySaveStories')}</Text>
                <Text style={styles.messageText}>{t('helpHomeLikes')}</Text>
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
      <StorySave scrollRef={scrollRef} key={searchQuery} search={searchQuery} user={user}></StorySave>
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