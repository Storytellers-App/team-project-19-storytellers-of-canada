import * as React from "react";
import {SafeAreaView, StyleSheet, ScrollView, StatusBar} from 'react-native';
import StorySave from '.././components/StorySave';

export default function TabTwoScreen() {
  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <StorySave />
      </ScrollView>
    </SafeAreaView>
  );
}
