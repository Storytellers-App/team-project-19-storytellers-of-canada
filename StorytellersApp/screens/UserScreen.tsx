import { AntDesign } from "@expo/vector-icons";
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import {
  Alert,  ImageBackground, Platform, SafeAreaView, ScrollView, StyleSheet,


  TextInput, TouchableOpacity
} from 'react-native';
import { Appbar, Title, Button, Modal } from "react-native-paper";
import { Text, View } from '../components/Themed';
import { HOST } from '../config';
import Colors from "../constants/Colors";
import { LocalizationContext } from "../LocalizationContext";
import { RootStackParamList } from '../types';

import booksImage from "../assets/images/books.jpeg";
import ProfilePicture from "../components/ProfilePicture";
import { UserContext } from '../UserContext';
import { block } from "react-native-reanimated";
let url = HOST

type UserScreenRouteProp = RouteProp<RootStackParamList, 'UserScreen'>;
type UserScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'UserScreen'
>;
type Props = {
  route: UserScreenRouteProp;
  navigation: UserScreenNavigationProp;
}
export default function UserScreen({ route, navigation }: Props) {
  const { t, locale, setLocale } = React.useContext(LocalizationContext);
  const {user} = useContext(UserContext);
  const otherUser = route.params.user;
  const [isLoading, setIsLoading] = useState(false);
  const [blocked, setIsBlocked] = useState(route.params.blocked !== undefined ? route.params.blocked : false);

  const onBlockUser = async () => {
    if (isLoading) {
      return;
    }
    if (user === undefined || user === null || otherUser === null || otherUser === undefined) {
      return;
    }

    setIsLoading(true);
    if(!blocked){
    try {
      axios({
        method: 'post', url: url + 'block', data: {
          auth_token: user.authToken,
          blockUser: otherUser.username,
        }
      })
        .then(response => {
          setIsLoading(false);

          Alert.alert(t('userBlocked'))
          setIsBlocked(true)
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
          Alert.alert(t('somethingWentWrong'));
        });
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      Alert.alert(t('somethingWentWrong'));
    }
    }
    if(blocked){
        try {
            axios({
              method: 'post', url: url + 'unblock', data: {
                auth_token: user.authToken,
                blockUser: otherUser.username,
              }
            })
              .then(response => {
                setIsLoading(false);
      
                Alert.alert(t('userUnBlocked'))
                setIsBlocked(false)
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
  }

  return (
    <ScrollView style={{backgroundColor: 'white' }}>
      <View style={{ flex: 1,  backgroundColor: 'white'}}>
        <Appbar.Header style={{ backgroundColor: "white" }}>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: 'white'}}>
            <Button
              icon="arrow-left"
              labelStyle={{ color: "black", fontSize: 24 }}
              onPress={() => navigation.goBack()}
            ></Button>
            <Title style={{ marginBottom: 5 }}>{t('userProfile')}</Title>
          </View>
        </Appbar.Header>
        <View style={{ justifyContent: "center",  backgroundColor: 'white' }}>
          <ImageBackground source={booksImage} style={styles.image}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5),",
              }}
            >
              <View style={{ marginVertical: 30, backgroundColor: 'transparent' }}>

                <ProfilePicture size={120} image={otherUser?.image} name={otherUser?.name}></ProfilePicture>
                {/* <IconButton size={30} color={'white'} style={{position: 'absolute', right: -30,
                bottom: -25,}}icon="close"></IconButton> */}
              </View>
            </View>
          </ImageBackground>
          <View style={styles.userInfoSection}>
            <View style={styles.userInfo}>
              <Text style={styles.infoHeader}>{t('fullName')}</Text>
              <Text style={styles.info}>{otherUser?.name}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.infoHeader}>{t('username')}</Text>
              <Text style={styles.info}>{otherUser?.username}</Text>
            </View>
          </View>
          <View style={{ justifyContent: "center",   alignItems: "center", backgroundColor: 'white' }}>
          {user?.username !== otherUser.username && <Button style={{borderRadius: 5, backgroundColor: '#8B0000'}} dark={true} icon="block-helper" mode="contained" onPress={() => onBlockUser()}>
           { !blocked ? t('blockUser') : t('unBlockUser')}
        </Button>}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  userInfoSection: {
    marginLeft: 25,
    marginTop: 25,
    marginBottom: 25,
    backgroundColor: 'white',
  },
  userInfo: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  buttons: {
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    fontSize: 22,
    color: 'black',
  },
  change: {
    fontSize: 13,
    fontWeight: "300",
    color: "#0062a1",
    paddingTop: 5,
  },
  infoHeader: {
    fontSize: 15,
    marginBottom: 3,
    fontStyle: "italic",
    color: 'black',
  },
  image: {
    resizeMode: "cover",
    justifyContent: "center",
    overflow: 'hidden',
  },
  input: {
    fontSize: 16,
    marginTop: 30,
  },
  button: {
    borderRadius: 20,
    backgroundColor: "#0062a1",
    marginBottom: 60,
    marginLeft: 50,
    marginRight: 50,
  },
  deactivateButton: {
    borderRadius: 20,
    backgroundColor: "#9e0500",
    marginBottom: 20,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 30,
  },
  cancelButton: {
    borderRadius: 20,
    backgroundColor: "#0062a1",
    marginBottom: 60,
    marginLeft: 50,
    marginRight: 50,
  },
});
