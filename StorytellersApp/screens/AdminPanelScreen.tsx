import { useScrollToTop } from "@react-navigation/native";
import * as React from "react";
import {useContext} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, StatusBar, View, Text, TouchableOpacity} from 'react-native';
import { Appbar, Button, Portal } from "react-native-paper";
import  AdminFeed from '../components/AdminFeed';
import { LocalizationContext } from "../LocalizationContext";
import { UserContext } from "../UserContext";

export default function AdminPanelScreen() {
  const [helpOpen, setHelpOpen] = React.useState(false);
  const { t, locale, setLocale } = React.useContext(LocalizationContext);
  const {user} = useContext(UserContext);
  const scrollRef = React.useRef(null);
  useScrollToTop(scrollRef);
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        style={{ backgroundColor: "white", marginLeft: 20, display: "flex" }}
      >
        <Text style={{ fontSize: 20 }}>{t('adminPanel')}</Text>
        <Button
          style={{ marginLeft: "auto" }}
          onPress={() => {
            setHelpOpen(!helpOpen);
          }}
        >
          {t('helpCapitals')}
        </Button>
      </Appbar.Header>
      {helpOpen && (
        <Portal>
          <View style={styles.faded}>
            <View style={styles.message}>
              <Text style={styles.messageTextLoud}>{t('helpAdminTitle')}</Text>
              <Text style={styles.messageText}>{t('helpAdminStories')}</Text>
              <Text style={styles.messageText}>{t('helpAdminControls')}</Text>
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
      <AdminFeed scrollRef={scrollRef} user={user}></AdminFeed>
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
