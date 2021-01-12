import React, { useContext, useEffect } from 'react';
import {
  StyleSheet, TextInput, View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
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

export default function HomeScreen({navigation}) {
  
  const ref = React.useRef<TextInput>(null);
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
          {  user === null || user === undefined ? <IconButton size={25} icon={"menu"} /> : <ProfilePicture
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
      <Feed key={searchQuery} search={searchQuery} user={user}></Feed>
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