import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidationComponent from 'react-native-form-validator';

export default class ProfilePage extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      full_name: "",
      email: "",
      photoUrl: "https://ubaya.me/blank.png",
    }
  }

  submitData = async() => {
    const options = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: "full_name=" + this.state.full_name + "&" +
        "photo_url=" + this.state.photoUrl + "&" +
        "email=" + this.state.email
    };
    try {
      fetch('https://ubaya.me/react/160420085/uas/updateprofile.php',
        options)
        .then(response => response.json())
        .then(async resjon => {
          console.log(resjon);
          if (resjon.result === 'success') {  
            try {
              await AsyncStorage.setItem('fullName', this.state.full_name);
              await AsyncStorage.setItem('photoUrl', this.state.photoUrl);
              alert('sukses mengupdate data');
            } catch (error) {
              console.error('Error updating AsyncStorage:', error);
            }
          }
        })
    } catch (error) {
      console.log(error);
    }
  }

  _onPressButton = () => {
    const { full_name } = this.state;

    if (!full_name) {
      alert('Nama tidak boleh kosong');
      return;
    }

    if (this.validate({
      full_name: { required: true },
      photoUrl: { required: true },
    })) {
      this.submitData();
    }
  }
  getUserData = async () => {
    try {
      const storedFullName = await AsyncStorage.getItem('fullName');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPhotoUrl = await AsyncStorage.getItem('photoUrl');

      if (storedFullName !== null) {
        this.setState({ full_name: storedFullName });
      }

      if (storedEmail !== null) {
        this.setState({ email: storedEmail });
      }

      if (storedPhotoUrl !== null) {
        this.setState({ photoUrl: storedPhotoUrl });
      }
    } catch (error) {
      console.error('Error mengambil data dari localstorage:', error);
    }
  };
  componentDidMount() {
    this.getUserData();
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: this.state.photoUrl || 'https://via.placeholder.com/150' }}
          />
          <View style={styles.profileInputs}>
            <TextInput
              style={styles.input}
              value={this.state.full_name}
              onChangeText={(text) => this.setState({ full_name: text })}
              placeholder="Full Name"
            />
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={this.state.email}
              editable={false}
              placeholder="Email"
            />
            <TextInput
              style={styles.input}
              value={this.state.photoUrl}
              onChangeText={(photoUrl) => this.setState({ photoUrl })}
              placeholder="Photo URL"
            />
            <TouchableOpacity style={styles.saveButton} onPress={this._onPressButton}>
              <Text style={styles.buttonText}>Simpan</Text>
            </TouchableOpacity>
             <TouchableOpacity
            style={styles.saveButton}
            onPress={() => this.props.navigation.navigate('UbahPassword')}
          >
            <Text style={styles.buttonText}>Ubah Password</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileInputs: {
    width: '100%',
  },
  input: {
    height: 50,
    width: 350,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#777',
  },
  saveButton: {
    backgroundColor: '#492b7a',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
