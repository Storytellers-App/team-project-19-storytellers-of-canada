import React, { Component, useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity
} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import AsyncStorage from '@react-native-community/async-storage';
import { Input, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import { HOST } from '../config';

let url = HOST

type Props = {
    email: String;
}

export default function ForgotPasswordScreen({email}: Props) {


    const resetPassword = async () => {
        console.log("verify the code");
        var endpoint_url = url + 'sendForgotPasswordEmail';
        try {
            axios({
                method: 'post', url: endpoint_url, headers: {
                    email: email
                }
            })
            .then(response => {
                if (response.data.success === true) {
                    Actions.ResetPasswordScreen({email: email});
                } else {
                    Alert.alert("There was a problem with the server, please try again");
                }
            })
        } catch (e) {
            Alert.alert("There was a problem reaching the server. Please try again");
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Please enter your email</Text>
            </View>
            <View>
                <Input
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={(value) => email = value}
                />
                <Button
                    buttonStyle={styles.signInButton}
                    onPress={resetPassword}
                    title="Confirm"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginTop: 70,
        marginBottom: 50,
        marginLeft: 50,
        marginRight: 50,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlignVertical: "center",
        textAlign: "center",
        fontSize: 17,

    },
    input: {
        marginTop: 30,
        fontSize: 16,
    },
    signInButton: {
        borderRadius: 20,
        backgroundColor: "#0062a1",
        marginBottom: 20,
    },
    registerButton: {
        borderRadius: 20,
        borderColor: "#0062a1",
        borderWidth: 2,
    },
    registerText: {
        color: "#0062a1",
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 40,
    },
    text: {
        fontSize: 15,
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 15,
    },
    guestButtonText: {
        flexGrow: 1,
        alignItems: "flex-end",
        justifyContent: "center",
        paddingVertical: 16,
        flexDirection: "row",
    },
});