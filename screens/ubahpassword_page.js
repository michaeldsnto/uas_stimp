import React, { useState, useEffect, Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidationComponent from 'react-native-form-validator';

export default class UbahPasswordPage extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: "",
            newPassword: "",
            user_id: "",
        }
    }

    submitData = () => {
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "user_id=" + this.state.user_id + "&" +
                "old_password=" + this.state.oldPassword + "&" +
                "new_password=" + this.state.newPassword
        };
        try {
            fetch('https://ubaya.me/react/160420085/uas/ubahpassword.php', options)
                .then(response => response.json())
                .then(resjon => {
                    console.log(resjon);
                    if (resjon.result === 'success') {
                        alert('sukses mengupdate data');
                    }
                })
                .catch(error => {
                    console.error('Error updating password:', error);
                });
        } catch (error) {
            console.log(error);
        }

    }
    componentDidMount() {
        AsyncStorage.getItem('userId').then((userId) => {
            if (userId) {
                this.setState({ user_id: userId });
            }
        }).catch((error) => {
            console.log('Error mengambil data dari localstorage:', error);
        });
    }
    _onPressButton = () => {
        const { user_id, oldPassword, newPassword } = this.state;

        if (!oldPassword) {
            alert('Password Lama tidak boleh kosong');
            return;
        }
        if (!newPassword) {
            alert('Password Baru tidak boleh kosong');
            return;
        }

        if (this.validate({
            oldPassword: { required: true },
            newPassword: { required: true },
        })) {
            this.submitData();
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        value={this.state.oldPassword}
                        onChangeText={(text) => this.setState({ oldPassword: text })}
                        placeholder="Password Lama"
                        secureTextEntry={true}
                    />
                    <TextInput
                        style={styles.input}
                        value={this.state.newPassword}
                        onChangeText={(text) => this.setState({ newPassword: text })}
                        placeholder="Password Baru"
                        secureTextEntry={true}
                    />
                    <TouchableOpacity style={styles.changePasswordButton} onPress={this._onPressButton}>
                        <Text style={styles.buttonText}>Ubah Password</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    passwordContainer: {
        width: '100%',
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    changePasswordButton: {
        backgroundColor: '#492b7a',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
