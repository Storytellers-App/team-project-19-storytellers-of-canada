import React, { Component, useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Button
} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import AsyncStorage from '@react-native-community/async-storage';
import { Input } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';



export default function EmailVerification() {

    const resendEmail = async () => {
        console.log("Send the email");

        Actions.
    }

    const verifyCode = async () => {
        console.log("verify the code");
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>A code was sent to your email</Text>
                <Text style={styles.title}>Please enter it here to verify your email</Text>
            </View>
            <View>
                <Input
                    style={styles.input}
                    placeholder="Verification Code"
                />
                <Button
                    onPress={verifyCode}
                    title="Confirm"
                />
                <Button
                    onPress={resendEmail}
                    title="Resend verification code"
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