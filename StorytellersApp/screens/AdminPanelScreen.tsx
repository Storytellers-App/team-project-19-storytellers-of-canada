import * as React from "react";
import {SafeAreaView, StyleSheet, ScrollView, StatusBar} from 'react-native';
import  AdminFeed from '../components/AdminFeed';

export default function AdminPanelScreen() {
  return (
    <SafeAreaView>
      <AdminFeed></AdminFeed>
    </SafeAreaView>
  );
}