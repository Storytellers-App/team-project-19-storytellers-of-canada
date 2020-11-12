
import * as React from 'react';
import {
  View,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  ScrollViewProps,
} from 'react-native';
import { useScrollToTop, useTheme } from '@react-navigation/native';
import {
  Card,
  Text,
  Avatar,
  Subheading,
  IconButton,
  Divider,
} from 'react-native-paper';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ProfilePicture from '../components/ProfilePicture';
import UserStory from '../components/UserStory';
import Feed from '../components/Feed';
import NewRecordingButton from '../components/NewRecordingButton';
type Props = Partial<ScrollViewProps> & {
  date?: number;
};


export default function NewsFeed(props: Props) {
  const ref = React.useRef<ScrollView>(null);

  useScrollToTop(ref);

  const colorScheme = useColorScheme();

  return (

    <View style={{flex:1}}>
      <Feed></Feed>
      <NewRecordingButton />
    </View>

  );
}

const styles = StyleSheet.create({
  input: {
    padding: 16,
    backgroundColor: 'transparent',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    flex: 1,
  },
});