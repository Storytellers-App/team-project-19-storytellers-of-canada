import React, { Component, useEffect, useState } from 'react'
import { View, StyleSheet, ImageBackground, KeyboardAvoidingView, Alert } from 'react-native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TextInput,
    TouchableRipple,
    Switch,
    Button,
    Appbar,
    Modal,
    Portal,
} from 'react-native-paper';
import { Input, Button as UpdateButton } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { UserType, RootStackParamList } from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Actions } from 'react-native-router-flux';
import { ScrollView } from 'react-native-gesture-handler';
import base64 from 'react-native-base64'
import { UserContext } from '../UserContext';

import * as Config from '../config';
import { CommonActions } from '@react-navigation/native';

export default function ProfileScreen(props) {

    const { user, setUser } = React.useContext(UserContext)

    const [visible, setVisible] = React.useState(false);
    const showNameModal = () => setVisible(true);
    const hideNameModal = () => setVisible(false);
    const [showEmailModal, setEmailModal] = React.useState(false);
    const [showPasswordModal, setPasswordModal] = React.useState(false);
    const [showDeactivateModal, setDeactivateModal] = React.useState(false);
    const [showConfirmModal, setConfirmModal] = React.useState(false);

    const [name, setName] = React.useState("")

    // Updating the name in the backend
    const updateName = () => {
        fetch(Config.HOST + `updateName?name=${name}`, {
            method: 'POST',
            headers: new Headers({
                'Authorization': `${user?.authToken}`
            })
        })
            .then(response => {
                return response.json()
            })
            .then((result) => {
                if (result["success"]) {
                    console.log("Successful response")
                    let newUser = {
                        username: user?.username,
                        name: name,
                        type: user?.type,
                        email: user?.email,
                        authToken: user?.authToken
                    } as UserType;
                    setUser(newUser)
                    Alert.alert(
                        "Name Change Successful"
                    )
                    hideNameModal()
                    props.navigation.navigate("ProfilePage")
                } else {
                    Alert.alert(
                        "Name Update Failed.",
                        "Please Try Again"
                    )
                }
            })
            .catch((error) => {
                Alert.alert(
                    "Connection Error"
                )
                console.error(error);
            });
    }

    const [newEmail, setNewEmail] = React.useState("")
    const [confirmEmail, setConfirmEmail] = React.useState("")

    // Validating the email
    const validateEmail = (email) => {
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(email);
    }

    // Updating the email in the backend
    const updateEmail = () => {
        // Checking if the emails are the same
        if (!(newEmail === confirmEmail)) {
            Alert.alert(
                "Invalid Email Entry",
                "Please make sure that your email is the same for both fields."
            )        
        } else if (!validateEmail(newEmail)){
            Alert.alert(
                "Invalid Email Entry",
                "Please make sure the email you enter is a valid email address."
            )
        } else {
            fetch(Config.HOST + `updateEmail?email=${newEmail}`, {
                method: 'POST',
                headers: new Headers({
                    'Authorization': `${user?.authToken}`
                })
            })
                .then(response => {
                    return response.json()
                })
                .then((result) => {
                    if (result["success"]) {
                        console.log("Successful response")
                        let newUser = {
                            username: user?.username,
                            name: user?.name,
                            type: user?.type,
                            email: newEmail,
                            authToken: user?.authToken
                        } as UserType;
                        setUser(newUser)
                        Alert.alert(
                            "Email Change Successful"
                        )
                        setEmailModal(false)
                        props.navigation.navigate("ProfilePage")
                    } else {
                        if (result["exists"]){
                            Alert.alert(
                                "Email Update Failed.",
                                "This email is already registered."
                            )
                        } else {
                            Alert.alert(
                                "Email Update Failed.",
                                "Please Try Again"
                            )
                        }
                        
                    }
                })
                .catch((error) => {
                    Alert.alert(
                        "Connection Error"
                    )
                    console.error(error);
                });
        }
    }

    const [currentPassword, setCurrentPassword] = React.useState("")
    const [newPassword, setNewPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")

    // Updating the email in the backend
    const updatePassword = () => {
        // Checking if the emails are the same
        if (!(newPassword === confirmPassword)) {
            Alert.alert(
                "Invalid Password Entry",
                "Please make sure that your new password is the same for both fields."
            )
        } else if (currentPassword === newPassword){
            Alert.alert(
                "Invalid Password Entry",
                "You cannot choose your new password to be your current one."
            )
        } else {
            fetch(Config.HOST + `updatePassword`, {
                method: 'POST',
                headers: new Headers({
                    'Authorization': base64.encode(`${user?.authToken}:${currentPassword}:${newPassword}`)
                })
            })
                .then(response => {
                    return response.json()
                })
                .then((result) => {
                    if (result["success"]) {
                        console.log("Successful response")
                        Alert.alert(
                            "Password Change Successful"
                        )
                        setPasswordModal(false)
                        props.navigation.navigate("ProfilePage")
                    } else {
                        Alert.alert(
                            "Password Update Failed.",
                            "Please make sure you have entered the correct current password."
                        )
                    }
                })
                .catch((error) => {
                    Alert.alert(
                        "Connection Error"
                    )
                    console.error(error);
                });
        }
    }

    const [deactivatePassword, setDeactivatePassword] = React.useState("")

    const deactivate = () => {
        fetch(Config.HOST + `deactivate`, {
            method: 'POST',
            headers: new Headers({
                'Authorization': base64.encode(`${user?.authToken}:${deactivatePassword}`)
            })
        })
            .then(response => {
                return response.json()
            })
            .then((result) => {
                console.log(result)
                if (result["success"]) {
                    console.log("Successful response")
                    Alert.alert(
                        "Deactivation Successful",
                        "You will now be logged out."
                    )
                    // Logging out
                    setDeactivateModal(false)
                    setConfirmModal(false)
                    let newUser = { username: "", authToken: "", name: "", email: "", type: "" }
                    setUser(newUser)
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'Login' },
                            ],
                        })
                    );
                } else {
                    setDeactivateModal(false)
                    setConfirmModal(false)
                    Alert.alert(
                        "Deactivation Failed.",
                        "Please make sure you have entered the correct current password."
                    )
                }
            })
            .catch((error) => {
                Alert.alert(
                    "Connection Error"
                )
                console.error(error);
            });
    }

    const goToConfirm = () => {
        // Continue if a password is entered
        if (deactivatePassword === "") {
            Alert.alert(
                "Invalid Password Information",
                "Please make sure you have entered your password."
            )
        } else {
            setConfirmModal(true)
            setDeactivateModal(false)
        }
    }

    const image = { uri: "https://images.pexels.com/photos/1387022/pexels-photo-1387022.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" };

    return (
        <View style={{ flex: 1 }}>
            <Portal>
                <Modal contentContainerStyle={styles.nameModal} visible={visible} onDismiss={hideNameModal}>
                    <View style={{ alignItems: 'center', padding: 20 }}>
                        <Title>Change Full Name</Title>
                        <Input
                            style={styles.input}
                            placeholder="New Name"
                            autoCapitalize='words'
                            onChangeText={(text) => { setName(text) }}
                        />
                    </View>
                    <UpdateButton buttonStyle={styles.button} title="Update" onPress={() => { updateName() }} />
                </Modal>
            </Portal>
            <Portal>
                <Modal contentContainerStyle={styles.modal} visible={showEmailModal} onDismiss={() => { setEmailModal(false) }}>
                    <View style={{ alignItems: 'center', padding: 20 }}>
                        <Title>Change Email</Title>
                        <Input
                            style={{ fontSize: 16, marginTop: 30 }}
                            placeholder="New Email"
                            autoCapitalize='none'
                            onChangeText={(text) => { setNewEmail(text) }}
                        />
                        <Input
                            style={{ fontSize: 16 }}
                            placeholder="Confirm Email"
                            autoCapitalize='none'
                            onChangeText={(text) => { setConfirmEmail(text) }}
                        />
                    </View>
                    <UpdateButton buttonStyle={styles.button} title="Update" onPress={() => { updateEmail() }} />
                </Modal>
            </Portal>
            <Portal>
                <Modal contentContainerStyle={styles.passwordModal} visible={showPasswordModal} onDismiss={() => { setPasswordModal(false) }}>
                    <View style={{ alignItems: 'center', padding: 20 }}>
                        <Title>Change Password</Title>
                        <Input
                            style={{ fontSize: 16, marginTop: 30 }}
                            placeholder="Current Password"
                            secureTextEntry={true}
                            autoCapitalize='none'
                            onChangeText={(text) => { setCurrentPassword(text) }}
                        />
                        <Input
                            style={{ fontSize: 16, marginTop: 40 }}
                            placeholder="New Password"
                            secureTextEntry={true}
                            autoCapitalize='none'
                            onChangeText={(text) => { setNewPassword(text) }}
                        />
                        <Input
                            style={{ fontSize: 16 }}
                            placeholder="Confirm Password"
                            secureTextEntry={true}
                            autoCapitalize='none'
                            onChangeText={(text) => { setConfirmPassword(text) }}
                        />
                    </View>
                    <UpdateButton buttonStyle={styles.button} title="Update" onPress={() => { updatePassword() }} />
                </Modal>
            </Portal>
            <Portal>
                <Modal contentContainerStyle={styles.modal} visible={showDeactivateModal} onDismiss={() => {
                    setDeactivatePassword("")
                    setDeactivateModal(false)
                }}>
                    <View style={{ alignItems: 'center', padding: 20 }}>
                        <Title>Deactivate Account</Title>
                        <Input
                            style={{ fontSize: 16, marginTop: 40 }}
                            placeholder="Current Password"
                            secureTextEntry={true}
                            autoCapitalize='none'
                            onChangeText={(text) => { setDeactivatePassword(text) }}
                        />
                    </View>
                    <UpdateButton buttonStyle={styles.deactivateButton} title="Deactivate Account" onPress={() => { goToConfirm() }} />
                </Modal>
            </Portal>
            <Portal>
                <Modal contentContainerStyle={styles.modal} visible={showConfirmModal} onDismiss={() => {
                    setDeactivatePassword("")
                    setConfirmModal(false)
                }}>
                    <View style={{ alignItems: 'center', padding: 20 }}>
                        <Title>Confirm Deactivation</Title>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, marginLeft: 10, marginRight: 10, textAlign: 'center' }}>Please confirm that you are deactivating your account.</Text>
                    </View>
                    <UpdateButton buttonStyle={styles.deactivateButton} title="Deactivate Account" onPress={() => { deactivate() }} />
                    <UpdateButton buttonStyle={styles.cancelButton} title="Cancel" onPress={() => {
                        setDeactivatePassword("")
                        setConfirmModal(false)
                    }} />
                </Modal>
            </Portal>
            <Appbar.Header style={{ backgroundColor: "white" }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Button icon="arrow-left"
                        labelStyle={{ color: 'black', fontSize: 24 }}
                        onPress={() => props.navigation.navigate('Home')}>
                    </Button>
                    <Title style={{ marginBottom: 5 }}>Profile Information</Title>
                </View>
            </Appbar.Header>
            <View style={{ justifyContent: 'center' }}>
                <ImageBackground source={image} style={styles.image}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5),' }}>
                        <Avatar.Image
                            source={{
                                uri: "https://ui-avatars.com/api/?background=006699&color=fff&name=" + user?.name
                            }}
                            size={120}
                            style={{ marginTop: 30, marginBottom: 30 }}
                        />
                        {/*<Button
                            icon="pencil"
                            labelStyle={{ color: 'white', fontSize: 14 }}
                            style={{ paddingBottom: 10 }}>
                            Update Picture
                        </Button>*/}
                    </View>
                </ImageBackground>
                <View style={styles.userInfoSection}>
                    <View style={styles.userInfo}>
                        <Text style={styles.infoHeader}>Full Name</Text>
                        <Text style={styles.info}>{user?.name}</Text>
                        <Text style={styles.change} onPress={showNameModal}>Change Full Name</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.infoHeader}>Email</Text>
                        <Text style={styles.info}>{user?.email}</Text>
                        <Text style={styles.change} onPress={() => { setEmailModal(true) }}>Change Email</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.infoHeader}>Username</Text>
                        <Text style={styles.info}>{user?.username}</Text>
                    </View>
                </View>
                <View style={styles.buttons}>
                    <Button
                        style={{ marginBottom: 5 }}
                        labelStyle={{ fontSize: 16, color: '#0062a1' }}
                        icon="lock"
                        onPress={() => { setPasswordModal(true) }}>
                        Change Password
                        </Button>
                    <Button
                        labelStyle={{ fontSize: 16, color: '#ab0202' }}
                        icon="delete"
                        onPress={() => { setDeactivateModal(true) }}>
                        Deactivate Account
                        </Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    userInfoSection: {
        marginLeft: 25,
        marginTop: 25,
        marginBottom: 25
    },
    modal: {
        backgroundColor: 'white',
        margin: 20,
    },
    nameModal: {
        backgroundColor: 'white',
        margin: 20,
    },
    passwordModal: {
        backgroundColor: 'white',
        margin: 20,
    },
    userInfo: {
        marginBottom: 20
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        fontSize: 22,
        fontWeight: "900"
    },
    change: {
        fontSize: 13,
        fontWeight: "300",
        color: '#0062a1',
        paddingTop: 5
    },
    infoHeader: {
        fontSize: 15,
        marginBottom: 3,
        fontStyle: 'italic'
    },
    image: {
        resizeMode: "cover",
        justifyContent: "center"
    },
    input: {
        fontSize: 16,
        marginTop: 30
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
        marginTop: 30
    },
    cancelButton: {
        borderRadius: 20,
        backgroundColor: "#0062a1",
        marginBottom: 60,
        marginLeft: 50,
        marginRight: 50,
    }
});