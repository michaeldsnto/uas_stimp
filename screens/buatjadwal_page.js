import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Picker } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { DatePickerModal } from 'react-native-paper-dates';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class BuatJadwalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tanggal: '',
      jam: '',
      lokasi: '',
      alamat: '',
      dolanUtamaData: [],
      selectedDolan: 0,
      minimalMember: 0,
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      user_id:0,
    };
  }

  submitData = () => {

    const options = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: "tanggal=" + this.state.tanggal + "&" +
        "jam=" + this.state.jam + "&" +
        "lokasi=" + this.state.lokasi + "&" +
        "alamat=" + this.state.alamat + "&" +
        "dolan_utama=" + this.state.selectedDolan + "&" +
        "minimal_member=" + this.state.minimalMember + "&" + 
        "user_id=" + this.state.user_id
    };

    try {
      fetch('https://ubaya.me/react/160420085/uas/buatjadwal.php',
        options)
        .then(response => response.json())
        .then(resjson => {
          console.log(resjson);
          if (resjson.result === 'success') {
            this.props.navigation.navigate('JadwalPage');
            alert('Sukses membuat jadwal!');
          }
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
      console.log('Error retrieving data:', error);
    });
    fetch('https://ubaya.me/react/160420085/uas/getdolanutama.php')
      .then(response => response.json())
      .then(resjson => {
        if (resjson.result === 'success') {
          this.setState({ dolanUtamaData: resjson.data });
        } else {
          console.error('Error fetching data:', resjson.message);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  _onPressButton = () => {
      this.submitData();
  }
  showTanggalPicker = () => {
    this.setState({ isDatePickerVisible: true });
  };

  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  showTImePicker = () => {
    this.setState({ isTimePickerVisible: true });
  };

  hideTimePicker = () => {
    this.setState({ isTimePickerVisible: false });
  };


  handleDatePicked = date => {
    this.setState({
      tanggal: date.date.getFullYear() + "-" +
        (date.date.getMonth() + 1) + "-" +
        date.date.getDate()
    });
    this.hideDatePicker();
  };

  handleTimePicked = time => {
    this.setState({
      jam: time.date.getHours() + ":" + time.date.getMinutes()
    });
    this.hideTimePicker();
  };


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textInfo}>Bikin jadwal dolananmu yuk!</Text>
        <View style={styles.viewRow}>
          <TextInput
            style={styles.input}
            placeholder="Tanggal Dolan"
            onChangeText={(tanggal) => this.setState({ tanggal })}
            value={this.state.tanggal}
          />
          <Button title="Pilih tanggal" onPress={this.showTanggalPicker} />
        </View>
        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDatePicker}
        />
        <DatePickerModal
          locale="en"
          mode="single"
          visible={this.state.isDatePickerVisible}
          onDismiss={this.hideDatePicker}
          date={this.state.tanggal}
          onConfirm={this.handleDatePicked}
        />

        <View style={styles.viewRow}>
          <TextInput
            style={styles.input}
            placeholder="Jam Dolan"
            onChangeText={(jam) => this.setState({ jam })}
            value={this.state.jam}
          />
          <Button title="Pilih jam" onPress={this.showTImePicker} />
        </View>
        <DateTimePicker
          isVisible={this.state.isTimePickerVisible}
          mode="time"
          onConfirm={this.handleTimePicked}
          onCancel={this.hideTimePicker}
        />
        <DatePickerModal
          locale="en"
          mode="single"
          visible={this.state.isTimePickerVisible}
          onDismiss={this.hideTimePicker}
          date={this.state.jam}
          onConfirm={this.handleTimePicked}
        />


        <TextInput
          style={styles.input}
          placeholder="Lokasi"
          onChangeText={(lokasi) => this.setState({ lokasi })}
          value={this.state.lokasi}
        />

        <TextInput
          style={styles.input}
          placeholder="Alamat"
          onChangeText={(alamat) => this.setState({ alamat })}
          value={this.state.alamat}
        />

        <Picker
          selectedValue={this.state.selectedDolan}
          style={styles.input}
          onValueChange={(itemValue) => this.setState({ selectedDolan: itemValue })}
        >
          {this.state.dolanUtamaData.length > 0 ? (
            this.state.dolanUtamaData.map((item, index) => (
              <Picker.Item key={index} label={item.nama_dolan} value={item.id} />
            ))
          ) : (
            <Picker.Item label="Loading..." value="" />
          )}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Minimal Member"
          keyboardType="numeric"
          onChangeText={(minimalMember) => this.setState({ minimalMember })}
          value={this.state.minimalMember}
        />
        <Button title="Buat Jadwal" onPress={this._onPressButton} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  picker: {
    height: 40,
    width: 350,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    width: 340,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  textInfo: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 5,
  },
});




