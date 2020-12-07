import * as React from "react";
import {SafeAreaView, StyleSheet, ScrollView, StatusBar, View, Text, TouchableOpacity} from 'react-native';
import { Appbar, Button, Portal } from "react-native-paper";
import  AdminFeed from '../components/AdminFeed';

export default function AdminPanelScreen() {
  const [helpOpen, setHelpOpen] = React.useState(false);

  return (
    <SafeAreaView>
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
            <Text style={styles.message}>This is the Admin Panel Screen</Text>
          </View>
          <TouchableOpacity
            style={{ height: "100%" }}
            onPress={() => {
              setHelpOpen(false);
            }}
          />
        </Portal>
      )}
      <AdminFeed></AdminFeed>
    </SafeAreaView>
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
