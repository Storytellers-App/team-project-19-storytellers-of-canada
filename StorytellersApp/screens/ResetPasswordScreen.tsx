import axios from 'axios';
import React from 'react';
import {
    Alert, StyleSheet, Text, View
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { HOST } from '../config';
import { LocalizationContext } from '../LocalizationContext';


let url = HOST

type Props = {
    email: String;
    verificationCode: String;
    password: String;
    confirmPassword: String;
}

export default function ResetPasswordScreen({email, verificationCode, password, confirmPassword}: Props) {

    const { t, locale, setLocale } = React.useContext(LocalizationContext);
    const verifyCode = async () => {
        console.log("verify the code");
        if (password === confirmPassword) {
            var endpoint_url = url + 'resetForgotPassword';
            try {
                axios({
                    method: 'post', url: endpoint_url, headers: {
                        email: email,
                        password: password,
                        token: verificationCode
                    }
                })
                .then(response => {
                    if (response.data.success === true) {
                        Actions.LoginScreen();
                    } else {
                        Alert.alert(t('somethingWentWrong'));
                    }
                })
            } catch (e) {
                Alert.alert(t('somethingWentWrong'));
            }
        } else {
            Alert.alert(t('passwordMismatch'));
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>{t('codeSentToEmailReset')}</Text>
            </View>
            <View>
                <Input
                    style={styles.input}
                    placeholder={t('verificationCode')}
                    onChangeText={(value) => verificationCode = value}
                />
                <Input
                    style={styles.input}
                    placeholder={t('password')}
                    secureTextEntry={true}
                    onChangeText={(value) => password = value}
                />
                <Input
                    style={styles.input}
                    placeholder={t('confirmPassword')}
                    secureTextEntry={true}
                    onChangeText={(value) => confirmPassword = value}
                />
                <Button
                    buttonStyle={styles.signInButton}
                    onPress={verifyCode}
                    title={t('confirm')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginTop: -50,
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