import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import * as SecureStore from 'expo-secure-store';
import base64 from 'react-native-base64'
import { LocalizationContext } from '../LocalizationContext';
import * as Config from '../config';
/**
 * Class for the login screen component
 */
export default class LoginScreen extends Component {
    /**
     * Constructor
     */
    static contextType = LocalizationContext;
    constructor() {
        super()
        this.state = { username: "", password: "", name: "", email: "", authToken: "", type: "", renderScreen: false }
        this.login = this.login.bind(this)
        this.host = Config.HOST
        this.checkPrevLogin();

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
    goToHome(user = null) {
        Actions.reset("HomeScreen", { user: user });
    }

    /**
     * Redirect to the admin page
     */
    goToAdmin() {
        Actions.AdminScreen();
    }

    /**
     * Redirect to the email verification page
     */
    goToEmailVerification() {
        Actions.EmailVerification({ email: "", code: "", username: this.state.username });
    }

    /**
     * Reset password
     */
    goToForgotPassword() {
        Actions.ForgotPasswordScreen();
    }
    /**
     * Set app-wide user information
     */
    setUserInfo = async () => {
        await SecureStore.setItemAsync("authToken", this.state.authToken)
    }

    checkAuth = async (authToken) => {
        // Submitting a login request
        fetch(this.host + 'authTokenLogin', {
            headers: new Headers({
                'Authorization': authToken
            })
        })
            .then(response => {
                return response.json()
            })
            .then(result => {
                if (result["success"]) {
                    // Setting app-wide info
                    this.state.username = result['username']
                    this.state.authToken = result["authToken"]
                    this.state.name = result["name"]
                    this.state.email = result["email"]
                    this.state.type = result["type"]
                    let user = { username: result['username'], authToken: result["authToken"], name: result["name"], email: result["email"], type: result["type"], image: result["image"] }
                    this.setUserInfo();
                    this.goToHome(user);
                }
            })
            .catch((error) => {
                Alert.alert(
                    "Connection Error"
                )
                console.error(error);
            });
    }
    /**
     * Login to the Storytellers app
     */
    login = async () => {

        if (this.state.username === "" || this.state.password === "") {
            Alert.alert(
                this.context.t('missingLogin'),
                this.context.t('makeSureInfoEntered')
            );
        } else {
            // Submitting a login request
            fetch(this.host + 'login', {
                headers: new Headers({
                    'Authorization': base64.encode(`${this.state.username}:${this.state.password}`)
                })
            })
                .then(response => {
                    return response.json()
                })
                .then(result => {
                    if (result["success"]) {
                        // Setting app-wide info
                        this.state.authToken = result["authToken"]
                        this.state.name = result["name"]
                        this.state.email = result["email"]
                        this.state.type = result["type"]
                        let user = { username: this.state.username, authToken: result["authToken"], name: result["name"], email: result["email"], type: result["type"], image: result["image"] }
                        this.setUserInfo();
                        this.goToHome(user);

                    } else {
                        if (result["active"] === undefined) {
                            // Invalid login information
                            Alert.alert(
                                this.context.t('invalidLogin'),
                                this.context.t('makeSureUserValid')
                            )
                        } else {
                            // active is defined, check to see if inactive
                            if (!result["active"]) {
                                this.goToEmailVerification();
                            }
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
    checkPrevLogin = async () => {

        let authToken = await SecureStore.getItemAsync("authToken")

        if (authToken != "" && authToken != null && authToken != undefined) {
            this.checkAuth(authToken);
            return;
        }
        this.setState({ renderScreen: true });
    }

    /**
     * Render the login screen
     */
    render() {
        if (!this.state.renderScreen) {
            return null;
        }

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
                    <Text style={styles.title}>{this.context.t('loginMessage')}</Text>
                </View>
                <View>
                    <Input
                        style={styles.input}
                        placeholder={this.context.t('username')}
                        autoCapitalize='none'
                        onChangeText={(text) => this.setState({ username: text })}
                    />
                    <Input
                        style={styles.input}
                        secureTextEntry={true}
                        placeholder={this.context.t('password')}
                        autoCapitalize='none'
                        onChangeText={(text) => this.setState({ password: text })}
                    />
                </View>
                <View>
                    <Button
                        buttonStyle={styles.signInButton}
                        title={this.context.t('signIn')}
                        onPress={this.login}
                    />
                    <Button
                        buttonStyle={styles.registerButton}
                        titleStyle={styles.registerText}
                        onPress={this.goToRegistration}
                        title={this.context.t('registerMessage')}
                        type="outline"
                    />
                </View>
                <View style={styles.guestButtonText}>
                    <TouchableOpacity onPress={this.goToForgotPassword}>
                        <Text style={styles.buttonText}>{this.context.t('forgotPassword')}</Text>
                    </TouchableOpacity>
                </View>
                {/* Option to enter the app as a guest */}
                <View style={styles.guestButtonText}>
                    <Text style={styles.text}>{this.context.t('dontWantAccount')}</Text>
                    <TouchableOpacity onPress={() => { this.goToHome() }}>
                        <Text style={styles.buttonText}> {this.context.t('loginAsGuest')}</Text>
                    </TouchableOpacity>
                </View>
                {this.context.locale === 'en' ? (
                    <TouchableOpacity onPress={() => this.context.setLocale('fr')}>
                        <Text style={styles.languageChoice}>Français</Text>
                    </TouchableOpacity>
                ) : (
                        <TouchableOpacity onPress={() => this.context.setLocale('en')}>
                            <Text style={styles.languageChoice}>English</Text>
                        </TouchableOpacity>
                    )}
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
    languageChoice: {
        color: 'black',
        fontSize: 15,
        alignSelf: 'center'
    }
});