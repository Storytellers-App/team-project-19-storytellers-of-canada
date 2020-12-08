import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import base64 from 'react-native-base64'

import * as Config from '../config';

/**
 * Class for the registration screen component
 */
class RegisterScreen extends Component {

    /**
     * Constructor
     */
    constructor() {
        super()
        this.state = { name: "", email: "", username: "", password: "" }
        this.register = this.register.bind(this)
        this.host = Config.HOST
    }

    /**
     * Redirect to the login page
     */
    goToLogin(){
        // Actions.LoginScreen();
        Actions.LoginScreen();
    }

    /**
     * Go to the email verification page
     */
    goToEmailVerification() {
        console.log('Go to email verification');
        Actions.EmailVerification({email: this.state.email, code: "", username: ""});
    }

    validateEmail(email) {
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(email);
    }

    /**
     * Register a Storytellers account
     */
    register(){
        if (this.state.name === "" || this.state.email === "" || this.state.username === "" || this.state.password === ""){
            Alert.alert(
                "Missing Registration Information",
                "Please make sure you have entered information in all fields before trying to register."
            );
        } else {
            // Validating email
            if (!this.validateEmail(this.state.email)){
                Alert.alert(
                    "Invalid Email",
                    "Please make sure you have entered a valid email before trying to register."
                );
            } else {
                console.log(this.host + `register?name=${this.state.name}&email=${this.state.email}`)
                fetch(this.host + `register?name=${this.state.name}&email=${this.state.email}`, {
                        method: 'POST',
                        headers: new Headers({
                            'Authorization': base64.encode(`${this.state.username}:${this.state.password}`)
                        })
                    })
                    .then(response => {
                        return response.json()
                    })
                    .then(result => {
                        if (result["success"]) {
                            console.log("Successful response")
                            // Going to the email screen
                            this.goToEmailVerification();
                        } else {
                            Alert.alert(
                                "Invalid Registration Information"
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
    }

    /**
     * Render the registration screen
     */
    render() {
        return (
            <View style={styles.container}>
                {/* Registration form */}
                <View>
                    <Text style={styles.title}>Create Your Storytellers Account</Text>
                </View>
                <View>
                    <Input
                        style={styles.input}
                        placeholder="Full Name"
                        onChangeText={(text) => this.setState({ name: text })}
                    />
                    <Input
                        style={styles.input}
                        placeholder="Email"
                        onChangeText={(text) => this.setState({ email: text })}
                    />
                    <Input
                        style={styles.input}
                        placeholder="Username"
                        onChangeText={(text) => this.setState({ username: text })}
                    />
                    <Input
                        secureTextEntry={true}
                        style={styles.input}
                        placeholder="Password"
                        autoCapitalize = 'none'
                        onChangeText={(text) => this.setState({ password: text })}
                    />
                </View>
                <View>
                    <Button
                        buttonStyle={styles.signUpButton}
                        title="Register"
                        onPress={this.register}
                    />
                </View>
                {/* Option to return to the login screen */}
                <View style={styles.loginButtonText}>
                    <Text style={styles.text}>Already have an account?</Text>
                    <TouchableOpacity onPress={this.goToLogin}>
                        <Text style={styles.buttonText}> Login</Text>
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
        marginTop: 90,
        marginBottom: 90,
        marginLeft: 50,
        marginRight: 50,
    },
    title: {
        textAlignVertical: "center",
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 60,
    },
    input: {
        fontSize: 16,
    },
    signUpButton: {
        borderRadius: 50,
        backgroundColor: "#0062a1",
    },
    loginButtonText: {
        flexGrow: 1,
        alignItems: "flex-end",
        justifyContent: "center",
        paddingVertical: 16,
        flexDirection: "row",
    },
    text: {
        fontSize: 16,
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 16,
    }
});


export default RegisterScreen;