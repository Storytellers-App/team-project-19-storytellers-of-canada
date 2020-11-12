import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

/**
 * Class for the login screen component
 */
export default class LoginScreen extends Component {

    /**
     * Constructor
     */
    constructor() {
        super()
        this.state = { username: "", password: "" }
        this.login = this.login.bind(this)
    }

    /**
     * Redirect to the registration page
     */
    goToRegistration() {
        Actions.RegisterScreen();
    }

    /**
     * Login to the Storytellers app
     */
    login() {
        if (this.state.username === "test" && this.state.password === "test"){
            Actions.HomeScreen();
        }
        /*
        // Submitting a login request
        fetch("https://csc301-assignment-2-67.herokuapp.com/menu")
            .then(response => {
                return response.json()
            })
            .then(result => {
                // Proceeding to the main page if successful
            })
            .catch((error) => {
                console.error(error);
            });
        */
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
            </View>
        );
    }
}

// Styles for this component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        margin: 50,
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
    }
});