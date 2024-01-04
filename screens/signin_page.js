import React, { Component, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, NativeModules } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SignInPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    saveUserData = async (email, fullName, photoUrl, userId) => {
        try {
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('fullName', fullName);
            await AsyncStorage.setItem('photoUrl', photoUrl);
            await AsyncStorage.setItem('userId', userId.toString());
        } catch (e) {
            console.error('Error menyimpan data ke local storage:', e);
        }
    };

    doLogin = async (email, password) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "email=" + email + "&" + "password=" + password
        };

        const response = await fetch('https://ubaya.me/react/160420085/uas/signin.php', options);
        const json = await response.json();
        console.log(json);

        if (json.result === 'success') {
            const { full_name: fullName, email, photo_url: photoUrl, id: userId } = json.users[0];

            try {
                await this.saveUserData(email, fullName, photoUrl, userId);
                alert('Login successfull');
                NativeModules.DevSettings.reload();
            } catch (e) {
                console.error('Error during login:', e);
            }
        } else {
            alert('Incorrect email or password');
        }
    };

    handleSignIn = () => {
        const { email, password } = this.state;

        if (!email || !password) {
            alert('Email dan password harus diisi');
            return;
        }

        this.doLogin(email, password);
    };

    handleSignUp = () => {
        this.props.navigation.navigate('SignUp');
    };

    render() {
        const { email, password } = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>DolanYuk</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => this.setState({ email: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => this.setState({ password: text })}
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={this.handleSignUp}>
                        <Text style={[styles.buttonText, styles.signUpText]}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.signInButton]} onPress={this.handleSignIn}>
                        <Text style={[styles.buttonText, styles.signInText]}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '80%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '80%',
    },
    button: {
        borderRadius: 20,
        marginLeft: 10,
        backgroundColor: 'lightblue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpButton: {
        backgroundColor: 'transparent',
        borderColor: '#492b7a',
        borderWidth: 1,
    },
    signUpText: {
        color: '#492b7a',
    },
    signInButton: {
        backgroundColor: '#492b7a',
    },
    signInText: {
        color: 'white',
    },
});
