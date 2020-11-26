import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Platform,
  Image,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Text, View } from '../components/Themed';
import { AntDesign } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import ProfilePicture from "../components/ProfilePicture";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, UserType } from '../types';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { HOST } from '../config';

let url = HOST

type NewCommentRouteProp = RouteProp<RootStackParamList, 'NewComment'>;
type NewCommentNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NewComment'
>;
type Props = {
  route: NewCommentRouteProp;
  navigation: NewCommentNavigationProp;
}
export default function NewCommentScreen({ route, navigation }: Props) {

  const [comment, setComment] = useState("");
  const parent = route.params.parent;
  const user = route.params.user;

  const onPostComment = async () => {
    if (parent === undefined || comment === "" || user === undefined) {
      return;
    }
    try {
      axios({
        method: 'post', url: url + 'comment', data: {
          parent: parent.id,
          parentType: parent.type,
          username: user,
          comment: comment,
        }
      })
        .then(response => {
          Alert.alert("Your submission is under review!")
          navigation.goBack();
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (e) {
      console.log(e);
    }


  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={30} color={Colors.light.tint} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onPostComment}>
          <Text style={styles.buttonText}>Comment</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.newTweetContainer}>
        <View style={styles.inputsContainer}>
          <TextInput
            value={comment}
            onChangeText={(value) => setComment(value)}
            multiline={true}
            numberOfLines={3}
            style={styles.tweetInput}
            placeholder={"Input your response"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: 'white'
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  button: {
    backgroundColor: Colors.light.tint,
    borderRadius: 30,
  },
  buttonText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  newTweetContainer: {
    flexDirection: 'row',
    padding: 15,
  },
  inputsContainer: {
    marginLeft: 10,
  },
  tweetInput: {
    height: 100,
    maxHeight: 300,
    fontSize: 20,
  },
  pickImage: {
    fontSize: 18,
    color: Colors.light.tint,
    marginVertical: 10,
  },
  image: {
    width: 150,
    height: 150,
  }
});