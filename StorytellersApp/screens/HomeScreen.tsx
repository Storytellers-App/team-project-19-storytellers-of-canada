import React, { useContext, useEffect } from 'react';
import {
  StyleSheet, TextInput, View
} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import {
  Appbar,
  Button,
  IconButton,
  Portal, Searchbar, Text
} from 'react-native-paper';
import Feed from '../components/Feed';
import NewRecordingButton from '../components/NewRecordingButton';
import ProfilePicture from '../components/ProfilePicture';
import useColorScheme from '../hooks/useColorScheme';
import { UserContext } from '../UserContext';
import { useScrollToTop } from '@react-navigation/native';
import { LocalizationContext } from '../LocalizationContext';

export default function HomeScreen({navigation}) {
  const { t, locale, setLocale } = React.useContext(LocalizationContext);
  const ref = React.useRef<TextInput>(null);
  const scrollRef = React.useRef(null);
  useScrollToTop(scrollRef);
  const {user} = useContext(UserContext);
  const [searchText, setSearchText] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  
  const colorScheme = useColorScheme();


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

  
  const openDrawer = () => {
    navigation.toggleDrawer();
  }
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: "white" }}>
        <View style={{ marginLeft: 7 }}>
          <TouchableOpacity onPress={openDrawer}>
          {  user === null || user === undefined || user.image === "" ? <IconButton size={25} icon={"menu"} /> : <ProfilePicture
            image={
              user === null || user === undefined
                ? undefined
                : user.image === null || user.image === undefined 
                ? "https://ui-avatars.com/api/?background=006699&color=fff&name=" +
                  user.name
                : user.image
            }
            size={45}
          />}
          </TouchableOpacity>
        </View>
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
                <Text style={styles.messageTextLoud}>{t('helpHomeTitle')}</Text>
                <Text style={styles.messageText}>{t('helpHomeStories')}</Text>
                <Text style={styles.messageText}>{t('helpHomeLikes')}</Text>
              </View>
              <View style={styles.message2}>
              <Text style={styles.messageText}>{t('helpHomeRecording')}</Text>
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
      <Feed scrollRef={scrollRef} key={searchQuery} search={searchQuery} user={user}></Feed>
      <NewRecordingButton user={user}/>
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