import { AntDesign } from "@expo/vector-icons";
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import React, { useState } from 'react';
import {
  Alert, Platform, SafeAreaView, StyleSheet,


  TextInput, TouchableOpacity
} from 'react-native';
import { Text, View } from '../components/Themed';
import { HOST } from '../config';
import Colors from "../constants/Colors";
import { LocalizationContext } from "../LocalizationContext";
import { RootStackParamList } from '../types';



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
  const { t, locale, setLocale } = React.useContext(LocalizationContext);
  const [comment, setComment] = useState("");
  const parent = route.params.parent;
  const user = route.params.user;
  const [isLoading, setIsLoading] = useState(false);

  const onPostComment = async () => {
    if (isLoading) {
      return;
    }
    if (parent === undefined || comment === "" || user === undefined || user === null) {
      return;
    }

    setIsLoading(true);
    try {
      axios({
        method: 'post', url: url + 'comment', data: {
          parent: parent.id,
          parentType: parent.type,
          auth_token: user.authToken,
          comment: comment,
        }
      })
        .then(response => {
          setIsLoading(false);

          Alert.alert(t('submissionUnderReview'))
          navigation.goBack();
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
          Alert.alert('somethingWentWrong');
        });
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      Alert.alert('somethingWentWrong');
    }


  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={30} color={Colors.light.tint} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onPostComment}>
          <Text style={styles.buttonText}>{t('comment')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.newCommentContainer}>
        <View style={styles.inputsContainer}>
          <TextInput
            value={comment}
            onChangeText={(value) => setComment(value)}
            multiline={true}
            numberOfLines={3}
            style={styles.commentInput}
            placeholder={t('inputResponse')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'android' ? 45 : 0,
    backgroundColor: 'white'
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white'
   
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
  newCommentContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white'
  },
  inputsContainer: {
    marginLeft: 10,
    backgroundColor: 'white'
  },
  commentInput: {
    height: 100,
    maxHeight: 300,
    fontSize: 20,
    backgroundColor: 'white'
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