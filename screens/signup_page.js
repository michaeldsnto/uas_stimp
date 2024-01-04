import React, { Component, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, AsyncStorage, NativeModules } from 'react-native';

export default class SignUpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        };
    }

    doSignUp = async (name, email, password) => {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "full_name=" + name + "&" + "email=" + email + "&" + 
                    "password=" + password
            };
    
            const response = await fetch('https://ubaya.me/react/160420085/uas/signup.php', options);
            const json = await response.json();
    
            if (json.result === 'success') {
                alert('Daftar berhadil');
                this.props.navigation.navigate('SignIn');
            } else {
                alert('Gagal Daftar: ' + json.message);
            }
        } catch (error) {
            console.error('Error :', error);
        }
    };

    handleSignUp = () => {
        const { fullName, email, password, confirmPassword } = this.state;

        if (!fullName || !email || !password || !confirmPassword) {
            alert('Harap isi semua kolom.');
            return;
        }
    
        if (password !== confirmPassword) {
            alert('Password dan konfirmasi password tidak sesuai.');
            return;
        }
        this.doSignUp(fullName, email, password);
    };

    handleSignIn = () => {
        this.props.navigation.navigate('SignIn');
    };

    render() {
        const { fullName, email, password, confirmPassword } = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Sign Up</Text>
                <Text style={styles.subtitle}>Sebelum nikmatin fasilitas DolanYuk, bikin akun dulu yuk!</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={(text) => this.setState({ fullName: text })}
                />
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
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={(text) => this.setState({ confirmPassword: text })}
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={this.handleSignIn}>
                        <Text style={styles.backButtonText}>Kembali</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signUpButton} onPress={this.handleSignUp}>
                        <Text style={styles.signUpButtonText}>Sign Up</Text>
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
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
        alignSelf: 'flex-start',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 20,
        alignSelf: 'flex-start',
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: 'purple',
    },
    signUpButton: {
        backgroundColor: 'purple',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    signUpButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});
