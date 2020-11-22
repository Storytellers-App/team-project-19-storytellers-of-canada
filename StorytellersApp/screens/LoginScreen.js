import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage'

import * as Config from '../config';

/**
 * Class for the login screen component
 */
export default class LoginScreen extends Component {

    /**
     * Constructor
     */
    constructor() {
        super()
        this.state = { username: "", password: "", name: "", email: "", authToken: "" }
        this.login = this.login.bind(this)
        this.host = Config.HOST
    }

    /**
     * Redirect to the registration page
     */
    goToRegistration() {
        Actions.RegisterScreen();
    }

    /**
     * Redirect to the main page
     */
    goToHome() {
        Actions.HomeScreen();
    }

    /**
     * Set app-wide user information
     */
    setUserInfo = async () => {
        await AsyncStorage.setItem("username", this.state.username);
        await AsyncStorage.setItem("name", this.state.name);
        await AsyncStorage.setItem("email", this.state.email);
        await AsyncStorage.setItem("authToken", this.state.authToken);
    }

    /**
     * Login to the Storytellers app
     */
    login = async () => {
        
        if (this.state.username === "" || this.state.password === "") {
            Alert.alert(
                "Missing Login Information",
                "Please make sure you have entered information in all fields before trying to login."
            );
        } else {
            // Submitting a login request
            fetch(this.host + `login?username=${this.state.username}&password=${this.state.password}`)
                .then(response => {
                    return response.json()
                })
                .then(result => {
                    if (result["success"]) {
                        console.log("Successful response")
                        // Setting app-wide info
                        this.state.authToken = result["authToken"]
                        this.state.name = result["name"]
                        this.state.email = result["email"]
                        this.setUserInfo()
                        // Going to the home screen
                        this.goToHome();
                    } else {
                        Alert.alert(
                            "Invalid Login Information",
                            "Please make sure the username and password you enter is valid."
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

    /**
     * Render the login screen
     */
    render() {
        return (
            <View style={styles.container}>
                {/* Storytellers of Canada logo */}
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/images/SCCC_logo.png')}
                    />
                </View>
                {/* Login form */}
                <View>
                    <Text style={styles.title}>Login to the Storytellers App</Text>
                </View>
                <View>
                    <Input
                        style={styles.input}
                        placeholder="Username"
                        onChangeText={(text) => this.setState({ username: text })}
                    />
                    <Input
                        style={styles.input}
                        secureTextEntry={true}
                        placeholder="Password"
                        onChangeText={(text) => this.setState({ password: text })}
                    />
                </View>
                <View>
                    <Button
                        buttonStyle={styles.signInButton}
                        title="Sign In"
                        onPress={this.login}
                    />
                    <Button
                        buttonStyle={styles.registerButton}
                        titleStyle={styles.registerText}
                        onPress={this.goToRegistration}
                        title="Register a New Account"
                        type="outline"
                    />
                </View>
                {/* Option to enter the app as a guest */}
                <View style={styles.guestButtonText}>
                    <Text style={styles.text}>Don't want an account?</Text>
                    <TouchableOpacity onPress={this.goToHome}>
                        <Text style={styles.buttonText}> Login as a Guest</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// Styles for this component
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
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,

    },
    input: {
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