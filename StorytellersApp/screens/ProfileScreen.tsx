import { CommonActions } from "@react-navigation/native";
import React from "react";
import {
  Alert, ImageBackground, Platform, StyleSheet, View
} from "react-native";
import base64 from "react-native-base64";
import { Button as UpdateButton, Input } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import {
  Appbar, Avatar,
  Button,
  Dialog,
  IconButton,
  Modal,
  Paragraph,
  Portal, Text, Title
} from "react-native-paper";
import * as Config from "../config";
import { UserType } from "../types";
import { UserContext } from "../UserContext";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { LocalizationContext } from "../LocalizationContext";
import ProfilePicture from "../components/ProfilePicture";

export default function ProfileScreen(props) {
  const { user, setUser } = React.useContext(UserContext);
  const { t, locale, setLocale } = React.useContext(LocalizationContext);
  const [visible, setVisible] = React.useState(false);
  const showNameModal = () => setVisible(true);
  const hideNameModal = () => setVisible(false);
  const [showEmailModal, setEmailModal] = React.useState(false);
  const [showPasswordModal, setPasswordModal] = React.useState(false);
  const [showAdminModal, setAdminModal] = React.useState(false);
  const [showDeactivateModal, setDeactivateModal] = React.useState(false);
  const [showConfirmModal, setConfirmModal] = React.useState(false);
  const [showConfirmPicDelete, setShowConfirmPicDelete] = React.useState(false);
  const [name, setName] = React.useState("");

  // Updating the name in the backend
  const updateName = () => {
    fetch(Config.HOST + `updateName?name=${name}`, {
      method: "POST",
      headers: new Headers({
        Authorization: `${user?.authToken}`,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result["success"]) {
          console.log("Successful response");
          let newUser = {
            username: user?.username,
            name: name,
            type: user?.type,
            email: user?.email,
            authToken: user?.authToken,
            image: user?.image
          } as UserType;
          setUser(newUser);
          Alert.alert(t('nameChangeSuccess'));
          hideNameModal();
          props.navigation.navigate("ProfilePage");
        } else {
          Alert.alert(t('nameUpdateFail'), t('pleaseTryAgain'));
        }
      })
      .catch((error) => {
        Alert.alert("Connection Error");
        console.error(error);
      });
  };

  const [newEmail, setNewEmail] = React.useState("");
  const [confirmEmail, setConfirmEmail] = React.useState("");

  // Validating the email
  const validateEmail = (email) => {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  };

  // Updating the email in the backend
  const updateEmail = () => {
    // Checking if the emails are the same
    if (!(newEmail === confirmEmail)) {
      Alert.alert(
        t('invalidEmail'),
        t('makeSureEmailSame')
      );
    } else if (!validateEmail(newEmail)) {
      Alert.alert(
        t('invalidEmail'),
        t('makeSureValidEmailChange')
      );
    } else {
      fetch(Config.HOST + `updateEmail?email=${newEmail}`, {
        method: "POST",
        headers: new Headers({
          Authorization: `${user?.authToken}`,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result["success"]) {
            console.log("Successful response");
            let newUser = {
              username: user?.username,
              name: user?.name,
              type: user?.type,
              email: newEmail,
              authToken: user?.authToken,
              image: user?.image
            } as UserType;
            setUser(newUser);
            Alert.alert(t('emailChangeSuccess'));
            setEmailModal(false);
            props.navigation.navigate("ProfilePage");
          } else {
            if (result["exists"]) {
              Alert.alert(
                t('emailUpdateFail'),
                t('emailAlreadyRegistered')
              );
            } else {
              Alert.alert(t('emailUpdateFail'), t('pleaseTryAgain'));
            }
          }
        })
        .catch((error) => {
          Alert.alert("Connection Error");
          console.error(error);
        });
    }
  };

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Updating the email in the backend
  const updatePassword = () => {
    // Checking if the emails are the same
    if (!(newPassword === confirmPassword)) {
      Alert.alert(
        t('invalidPasswordEntry'),
        t('passwordMismatch')
      );
    } else if (currentPassword === newPassword) {
      Alert.alert(
        t('invalidPasswordEntry'),
        t('passwordSameOld')
      );
    } else {
      fetch(Config.HOST + `updatePassword`, {
        method: "POST",
        headers: new Headers({
          Authorization: base64.encode(
            `${user?.authToken}:${currentPassword}:${newPassword}`
          ),
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result["success"]) {
            console.log("Successful response");
            Alert.alert("Password Change Successful");
            setPasswordModal(false);
            props.navigation.navigate("ProfilePage");
          } else {
            Alert.alert(
              t('passwordUpdateFail'),
              t('makeSureCorrectCurrPassword')
            );
          }
        })
        .catch((error) => {
          Alert.alert("Connection Error");
          console.error(error);
        });
    }
  };

  const [newAdmin, setNewAdmin] = React.useState("");
  const [confirmNewAdmin, setConfirmNewAdmin] = React.useState("");

  // Updating the email in the backend
  const elevateUser = () => {
    // Checking if the emails are the same
    if (!(newAdmin === confirmNewAdmin)) {
      Alert.alert(
        t('invalidUsernameEntry'),
        t('makeSureUsernameSame')
      );
    } else {
      fetch(Config.HOST + `promoteUser?username=${newAdmin}`, {
        method: "POST",
        headers: new Headers({
          Authorization: `${user?.authToken}`,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result["success"]) {
            console.log("Successful response");
            Alert.alert(
              t('userElevateSuccess'),
              t('promotedLogBackIn')
            );
          } else {
            if (result["error"] == "NOTADMIN") {
              Alert.alert(
                t('userElevateFail'),
                t('mustBeAdmin')
              );
            } else if (result["error"] == "NOAUTH") {
              Alert.alert(
                t('userElevateFail'),
                t('mustBeAuth')
              );
            } else if (result["error"] == "NOUSER") {
              Alert.alert(
                t('userElevateFail'),
                t('userNotFound')
              );
            }
          }
        })
        .then(() => {
          setAdminModal(false);
          props.navigation.navigate("ProfilePage");
        })
        .catch((error) => {
          Alert.alert("Connection Error");
          console.error(error);
        });
    }
  };

  const [deactivatePassword, setDeactivatePassword] = React.useState("");

  const deactivate = () => {
    fetch(Config.HOST + `deactivate`, {
      method: "POST",
      headers: new Headers({
        Authorization: base64.encode(
          `${user?.authToken}:${deactivatePassword}`
        ),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log(result);
        if (result["success"]) {
          console.log("Successful response");
          Alert.alert(t('deactivateSuccess'));
          // Logging out
          setDeactivateModal(false);
          setConfirmModal(false);
          SecureStore.deleteItemAsync('authToken');
          let newUser = undefined;
          setUser(newUser);
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Login" }],
            })
          );
        } else {
          setDeactivateModal(false);
          setConfirmModal(false);
          Alert.alert(
            t('deactivateFail'),
            t('makeSureCorrectCurrPassword')
          );
        }
      })
      .catch((error) => {
        Alert.alert("Connection Error");
        console.error(error);
      });
  };

  const goToConfirm = () => {
    // Continue if a password is entered
    if (deactivatePassword === "") {
      Alert.alert(
        t('invalidPasswordEntry'),
        t('makeSureCorrectCurrPassword')
      );
    } else {
      setConfirmModal(true);
      setDeactivateModal(false);
    }
  };

  const image = {
    uri:
      "https://images.pexels.com/photos/1387022/pexels-photo-1387022.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  };
  const [profilePic, setProfilePic] = React.useState("");

  const removePic = async () => {
    setShowConfirmPicDelete(false);
    if (user === undefined || user.authToken === undefined) {
      return;
    }
    fetch(Config.HOST + 'updateImage', {
      method: "DELETE",
      headers: new Headers({
        Authorization: user?.authToken
      }
      ),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log(result);
        if (result["success"]) {
          let newUser = {
            username: user?.username,
            name: user?.name,
            type: user?.type,
            email: user?.email,
            authToken: user?.authToken,
            image: undefined,
          } as UserType;
          setUser(newUser);
        } else {
          Alert.alert(t('somethingWentWrong'))
        }
      })
      .catch((error) => {
        Alert.alert("Connection Error");
        console.error(error);
      });

  }
  const updatePic = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted') {
        alert(t('cameraRollPermissions'));
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    }).then((result) => {
      if (!result.cancelled) {
        setProfilePic(result.uri)
        // Sending an API request to update the pic
        const formData = new FormData();
        formData.append('image', {
          uri: result.uri,
          name: result.uri,
          type: 'image/*'
        });
        const xhr = new XMLHttpRequest();
        xhr.open('POST', Config.HOST + 'updateImage');
        let auth: string = user?.authToken as string;
        xhr.setRequestHeader('Authorization', auth);
        xhr.send(formData);
        xhr.onreadystatechange = e => {
          if (xhr.status === 200) {
            if (xhr.readyState == 4) {
              let newUser = {
                username: user?.username,
                name: user?.name,
                type: user?.type,
                email: user?.email,
                authToken: user?.authToken,
                image: (JSON.parse(xhr.response))["image"]
              } as UserType;
              console.log(newUser?.image)
              setUser(newUser);
            }
            Alert.alert(t('profilePicUpdateSuccess'));
          } else {
            console.log('error', xhr.responseText);
            Alert.alert(t('profilePicUpdateFail'));
          }
        };
      }
    });
  }

  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        <Portal>
          <Modal
            contentContainerStyle={styles.nameModal}
            visible={visible}
            onDismiss={hideNameModal}
          >
            <View style={{ alignItems: "center", padding: 20 }}>
              <Title>{t('changeFullName')}</Title>
              <Input
                style={styles.input}
                placeholder={t('newName')}
                autoCapitalize="words"
                onChangeText={(text) => {
                  setName(text);
                }}
              />
            </View>
            <UpdateButton
              buttonStyle={styles.button}
              title={t('update')}
              onPress={() => {
                updateName();
              }}
            />
          </Modal>
        </Portal>
        <Portal>
          <Modal
            contentContainerStyle={styles.modal}
            visible={showEmailModal}
            onDismiss={() => {
              setEmailModal(false);
            }}
          >
            <View style={{ alignItems: "center", padding: 20 }}>
              <Title>{t('changeEmail')}</Title>
              <Input
                style={{ fontSize: 16, marginTop: 30 }}
                placeholder={t('newEmail')}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setNewEmail(text);
                }}
              />
              <Input
                style={{ fontSize: 16 }}
                placeholder={t('confirmEmail')}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setConfirmEmail(text);
                }}
              />
            </View>
            <UpdateButton
              buttonStyle={styles.button}
              title={t('update')}
              onPress={() => {
                updateEmail();
              }}
            />
          </Modal>
        </Portal>
        <Portal>
          <Modal
            contentContainerStyle={styles.passwordModal}
            visible={showPasswordModal}
            onDismiss={() => {
              setPasswordModal(false);
            }}
          >
            <View style={{ alignItems: "center", padding: 20 }}>
              <Title>{t('changePassword')}</Title>
              <Input
                style={{ fontSize: 16, marginTop: 30 }}
                placeholder={t('currentPassword')}
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setCurrentPassword(text);
                }}
              />
              <Input
                style={{ fontSize: 16, marginTop: 40 }}
                placeholder={t('newPassword')}
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setNewPassword(text);
                }}
              />
              <Input
                style={{ fontSize: 16 }}
                placeholder={t('confirmPassword')}
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setConfirmPassword(text);
                }}
              />
            </View>
            <UpdateButton
              buttonStyle={styles.button}
              title={t('update')}
              onPress={() => {
                updatePassword();
              }}
            />
          </Modal>
        </Portal>
        <Portal>
          <Modal
            contentContainerStyle={styles.passwordModal}
            visible={showAdminModal}
            onDismiss={() => {
              setAdminModal(false);
            }}
          >
            <View style={{ alignItems: "center", padding: 20 }}>
              <Title>{t('elevateUserToAdmin')}</Title>
              <Input
                style={{ fontSize: 16, marginTop: 30 }}
                placeholder={t('usernameToElevate')}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setNewAdmin(text);
                }}
              />
              <Input
                style={{ fontSize: 16 }}
                placeholder={t('confirmUsername')}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setConfirmNewAdmin(text);
                }}
              />
            </View>
            <UpdateButton
              buttonStyle={styles.button}
              title={t('elevate')}
              onPress={() => {
                elevateUser();
              }}
            />
          </Modal>
        </Portal>
        <Portal>
          <Modal
            contentContainerStyle={styles.modal}
            visible={showDeactivateModal}
            onDismiss={() => {
              setDeactivatePassword("");
              setDeactivateModal(false);
            }}
          >
            <View style={{ alignItems: "center", padding: 20 }}>
              <Title>{t('deactivateAccount')}</Title>
              <Input
                style={{ fontSize: 16, marginTop: 40 }}
                placeholder={t('currentPassword')}
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setDeactivatePassword(text);
                }}
              />
            </View>
            <UpdateButton
              buttonStyle={styles.deactivateButton}
              title={t('deactivateAccount')}
              onPress={() => {
                goToConfirm();
              }}
            />
          </Modal>
        </Portal>
        <Portal>
          <Modal
            contentContainerStyle={styles.modal}
            visible={showConfirmModal}
            onDismiss={() => {
              setDeactivatePassword("");
              setConfirmModal(false);
            }}
          >
            <View style={{ alignItems: "center", padding: 20 }}>
              <Title>{t('confirmDeactivation')}</Title>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 10,
                  marginRight: 10,
                  textAlign: "center",
                }}
              >
                {t('pleaseConfirmDeactivation')}
              </Text>
            </View>
            <UpdateButton
              buttonStyle={styles.deactivateButton}
              title={t('deactivateAccount')}
              onPress={() => {
                deactivate();
              }}
            />
            <UpdateButton
              buttonStyle={styles.cancelButton}
              title={t('cancel')}
              onPress={() => {
                setDeactivatePassword("");
                setConfirmModal(false);
              }}
            />
          </Modal>
        </Portal>
        <Portal>
          <Dialog visible={showConfirmPicDelete} onDismiss={() => setShowConfirmPicDelete(false)} style={{ backgroundColor: 'white' }}>
            <Dialog.Content>
              <Paragraph >{t('deletePicConfirmation')}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowConfirmPicDelete(false)}>{t('cancel')}</Button>
              <Button style={{ marginHorizontal: 15 }} onPress={removePic}>{t('yes')}</Button>
            </Dialog.Actions>

          </Dialog>
        </Portal>
        <Appbar.Header style={{ backgroundColor: "white" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button
              icon="arrow-left"
              labelStyle={{ color: "black", fontSize: 24 }}
              onPress={() => props.navigation.navigate("Home")}
            ></Button>
            <Title style={{ marginBottom: 5 }}>{t('profileInfo')}</Title>
          </View>
        </Appbar.Header>
        <View style={{ justifyContent: "center" }}>
          <ImageBackground source={image} style={styles.image}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5),",
              }}
            >
              <View style={{ marginVertical: 30 }}>

                <ProfilePicture size={120} image={user?.image} name={user?.name}></ProfilePicture>
                {/* <IconButton size={30} color={'white'} style={{position: 'absolute', right: -30,
                bottom: -25,}}icon="close"></IconButton> */}
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Button
                  icon="pencil"
                  labelStyle={{ color: 'white', fontSize: 14 }}
                  style={{ paddingBottom: 10 }}
                  onPress={updatePic}>
                  {t('updatePic')}
                </Button>
                <Button
                  icon="close"
                  labelStyle={{ color: 'white', fontSize: 14 }}
                  style={{ paddingBottom: 10 }}
                  onPress={() => setShowConfirmPicDelete(true)}>
                  {t('removePic')}
                </Button>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.userInfoSection}>
            <View style={styles.userInfo}>
              <Text style={styles.infoHeader}>{t('fullName')}</Text>
              <Text style={styles.info}>{user?.name}</Text>
              <Text style={styles.change} onPress={showNameModal}>
                {t('changeFullName')}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.infoHeader}>{t('email')}</Text>
              <Text style={styles.info}>{user?.email}</Text>
              <Text
                style={styles.change}
                onPress={() => {
                  setEmailModal(true);
                }}
              >
                {t('changeEmail')}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.infoHeader}>{t('username')}</Text>
              <Text style={styles.info}>{user?.username}</Text>
            </View>
          </View>
          <View style={styles.buttons}>
            <Button
              style={{ marginBottom: 5 }}
              labelStyle={{ fontSize: 16, color: "#0062a1" }}
              icon="lock"
              onPress={() => {
                setPasswordModal(true);
              }}
            >
              {t('changePassword')}
            </Button>
            {user?.type == "ADMIN" && (
              <Button
                style={{ marginBottom: 5 }}
                labelStyle={{ fontSize: 16, color: "#008534" }}
                icon="arrow-up-bold"
                onPress={() => {
                  setAdminModal(true);
                }}
              >
                {t('elevateUserToAdmin')}
              </Button>
            )}
            <Button
              labelStyle={{ fontSize: 16, color: "#ab0202" }}
              icon="delete"
              onPress={() => {
                setDeactivateModal(true);
              }}
            >
              {t('deactivateAccount')}
            </Button>
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
  },
  modal: {
    backgroundColor: "white",
    margin: 20,
  },
  nameModal: {
    backgroundColor: "white",
    margin: 20,
  },
  passwordModal: {
    backgroundColor: "white",
    margin: 20,
  },
  userInfo: {
    marginBottom: 20,
  },
  buttons: {
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    fontSize: 22,
    fontWeight: "900",
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
  },
  image: {
    resizeMode: "cover",
    justifyContent: "center",
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
