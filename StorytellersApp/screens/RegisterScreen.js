import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

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
        Actions.EmailVerification({email: this.state.email, code: ""});
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
            console.log(this.host + `register?username=${this.state.username}&password=${this.state.password}&name=${this.state.name}&email=${this.state.email}`)
            fetch(this.host + `register?username=${this.state.username}&password=${this.state.password}&name=${this.state.name}&email=${this.state.email}`, {
                    method: 'POST'
                })
                .then(response => {
                    return response.json()
                })
                .then(result => {
                    if (result["success"]) {
                        console.log("Successful response")
                        // Going to the login screen
                        this.goToLogin();
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