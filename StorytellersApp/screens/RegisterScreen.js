import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import {Actions} from 'react-native-router-flux';

/**
 * Class for the registration screen component
 */
class RegisterScreen extends Component {

    /**
     * Redirect to the login page
     */
    goToLogin(){
        Actions.LoginScreen();
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
                    />
                    <Input
                        style={styles.input}
                        placeholder="Email"
                    />
                    <Input
                        style={styles.input}
                        placeholder="Username"
                    />
                    <Input
                        secureTextEntry={true}
                        style={styles.input}
                        placeholder="Password"
                    />
                </View>
                <View>
                    <Button
                        buttonStyle={styles.signUpButton}
                        title="Register"
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
        margin: 50,
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