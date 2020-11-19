import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
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
     * Redirect to the main page
     */
    goToHome(){
        Actions.HomeScreen();
    }

    /**
     * Login to the Storytellers app
     */
    login() {
        if (this.state.username === "" || this.state.password === ""){
            Alert.alert(
                "Missing Login Information",
                "Please make sure you have entered information in all fields before trying to login."
            );
        }
        if (this.state.username === "test" && this.state.password === "test"){
            this.goToHome();
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