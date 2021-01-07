import * as React from "react";
import {useContext} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, StatusBar, View, Text, TouchableOpacity} from 'react-native';
import { Appbar, Button, Portal } from "react-native-paper";
import  AdminFeed from '../components/AdminFeed';
import { UserContext } from "../UserContext";

export default function AdminPanelScreen() {
  const [helpOpen, setHelpOpen] = React.useState(false);
  const {user} = useContext(UserContext);
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        style={{ backgroundColor: "white", marginLeft: 20, display: "flex" }}
      >
        <Text style={{ fontSize: 20 }}>Admin Panel</Text>
        <Button
          style={{ marginLeft: "auto" }}
          onPress={() => {
            setHelpOpen(!helpOpen);
          }}
        >
          HELP
        </Button>
      </Appbar.Header>
      {helpOpen && (
        <Portal>
          <View style={styles.faded}>
            <View style={styles.message}>
              <Text style={styles.messageTextLoud}>This is the Admin Panel</Text>
              <Text style={styles.messageText}>Here you can approve or reject stories that are awaiting approval.</Text>
              <Text style={styles.messageText}>Tap the green thumbs up to approve a story, or tap the red thumbs down to reject a story.</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ height: "100%" }}
            onPress={() => {
              setHelpOpen(false);
            }}
          />
        </Portal>
      )}
      <AdminFeed user={user}></AdminFeed>
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
