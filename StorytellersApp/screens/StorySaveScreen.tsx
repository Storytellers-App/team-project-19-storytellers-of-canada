import * as React from "react";
import {SafeAreaView,View, StyleSheet, ScrollView, StatusBar,  Image, Text } from 'react-native';
import StorySave from '../components/StorySave';

export default function StorySaveScreen() {
  return (
    <SafeAreaView>
      <StorySave></StorySave>
    </SafeAreaView>
  );
}
