import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import base64 from 'react-native-base64'
import { LocalizationContext } from '../LocalizationContext';
import * as WebBrowser from 'expo-web-browser';
import * as Config from '../config';

/**
 * Class for the registration screen component
 */
class RegisterScreen extends Component {

    /**
     * Constructor
     */
    static contextType = LocalizationContext;
    constructor() {
        super()
        this.state = { name: "", email: "", username: "", password: "", confirmedPassword: "" }
        this.register = this.register.bind(this)
        this.host = Config.HOST
    }
    openTOSPage = async () => {
        WebBrowser.openBrowserAsync('https://radioapp.storytellers-conteurs.ca/tos/index.html');
     }
    openPrivacyPolicyPage = async () => {
        WebBrowser.openBrowserAsync('https://radioapp.storytellers-conteurs.ca/tos/index.html');
     }

    /**
     * Redirect to the login page
     */
    goToLogin() {
        // Actions.LoginScreen();
        Actions.LoginScreen();
    }

    /**
     * Go to the email verification page
     */
    goToEmailVerification() {
        console.log('Go to email verification');
        Actions.EmailVerification({ email: this.state.email, code: "", username: "" });
    }

    validateEmail(email) {
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(email);
    }

    /**
     * Register a Storytellers account
     */
    register() {
        if (this.state.name === "" || this.state.email === "" || this.state.username === "" || this.state.password === "") {
            Alert.alert(
                this.context.t('missingRegistrationInfo'),
                this.context.t('missingRegistrationInfo'),
            );
        } else {
            // Check if the passwords match
            if (this.state.password != this.state.confirmedPassword) {
                Alert.alert(this.context.t('passwordMismatch'));
                return;
            }
            // Validating email
            if (!this.validateEmail(this.state.email)) {
                Alert.alert(
                    this.context.t('invalidEmail'),
                    this.context.t('makeSureValidEmailEntered'),
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
                                this.context.t('invalidRegistration')
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
                    <Text style={styles.title}>{this.context.t('createYourAccountMessage')}</Text>
                </View>
                <View>
                    <Input
                        style={styles.input}
                        placeholder={this.context.t('fullName')}
                        onChangeText={(text) => this.setState({ name: text })}
                    />
                    <Input
                        style={styles.input}
                        placeholder={this.context.t('email')}
                        onChangeText={(text) => this.setState({ email: text })}
                    />
                    <Input
                        style={styles.input}
                        placeholder={this.context.t('username')}
                        onChangeText={(text) => this.setState({ username: text })}
                    />
                    <Input
                        secureTextEntry={true}
                        style={styles.input}
                        placeholder={this.context.t('password')}
                        autoCapitalize='none'
                        onChangeText={(text) => this.setState({ password: text })}
                    />
                    <Input
                        secureTextEntry={true}
                        style={styles.input}
                        placeholder={this.context.t('confirmPassword')}
                        autoCapitalize='none'
                        onChangeText={(text) => this.setState({ confirmedPassword: text })}
                    />
                </View>
                <View>
                    <Button
                        buttonStyle={styles.signUpButton}
                        title={this.context.t('register')}
                        onPress={this.register}
                    />
                    <Text style={{ marginTop: 15, textAlign: 'center' }}>{this.context.t('termsOfServiceMessage')}</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <TouchableOpacity onPress={this.openTOSPage}><Text style={{ textDecorationLine: 'underline', textAlign: 'center' }}>{this.context.t('termsOfService')}</Text></TouchableOpacity>
                        <Text style={{ textAlign: 'center' }}> {this.context.t('and')} </Text>
                        <TouchableOpacity onPress={this.openPrivacyPolicyPage}><Text style={{ textDecorationLine: 'underline', textAlign: 'center' }}>{this.context.t('privacyPolicy')}</Text></TouchableOpacity>
                    </View>
                </View>

                {/* Option to return to the login screen */}
                <View style={styles.loginButtonText}>
                    <Text style={styles.text}>{this.context.t('alreadyHaveAccount')}</Text>
                    <TouchableOpacity onPress={this.goToLogin}>
                        <Text style={styles.buttonText}> {this.context.t('login')}</Text>
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