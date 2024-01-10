import React from "react";
import { StyleSheet, View, Text, FlatList, TextInput } from "react-native";
import { Card } from "@rneui/themed";
import { useNavigation } from '@react-navigation/native';
import { Modal, TouchableOpacity } from "react-native-web";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton } from "react-native-paper";

class CariPage extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      isModalVisible: false,
      dataAnggota: {},
      jumlahAnggota: 0,
      batasAnggota: 0,
      user_id: 0,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('userId').then((user_id) => {
      if (user_id) {
        this.setState({ user_id: user_id }, () => {
          this.fetchData();
        });
      }
    }).catch((error) => {
      console.log('Error retrieving data:', error);
    });
  }

  fetchData = () => {
    const options = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: "user_id=" + this.state.user_id
    };
    try {
      fetch('https://ubaya.me/react/160420085/uas/carijadwal.php', options)
        .then(response => response.json())
        .then(resjson => {
          this.setState({
            data: resjson.data
          }, () => {
          });
        })
        .catch(error => {
          console.log('Error fetching jadwal data:', error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  fetchDataAnggota = (jadwal_id, jumlahAnggota, batasAnggota) => {
    const options = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: "jadwal_id=" + jadwal_id
    };
    try {
      fetch('https://ubaya.me/react/160420085/uas/cekanggota.php', options)
        .then(response => response.json())
        .then(resjson => {
          console.log('Data Anggota:', resjson.data);
          this.setState({
            dataAnggota: resjson.data,
            isModalVisible: true,
            jumlahAnggota: jumlahAnggota,
            batasAnggota: batasAnggota
          })
        })
        .catch(error => {
          console.log('Error fetching members data:', error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };
  handleJoinButton = (jadwal_id) => {
    const { user_id } = this.state;
  
    const options = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: "jadwal_id=" + jadwal_id + "&" + 
        "user_id=" + user_id
    };
  
    try {
      fetch('https://ubaya.me/react/160420085/uas/joindolan.php', options)
        .then(response => response.json())
        .then(resjson => {
          console.log("resjson response:", resjson);
          this.fetchData();
        })
        .catch(error => {
          console.log('Error:', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  renderMember = ({ item }) => {
    return (
      <View style={styles.memberContainer}>
        <View style={styles.userContainer}>
          <View style={styles.avatarContainer}>
            <img
              src={item.photo_url}
              alt="User Avatar"
              style={styles.avatar}
            />
          </View>
          <Text style={styles.fullName}>{item.full_name}</Text>
        </View>
      </View>
    );
  };


  renderItem = ({ item }) => {
    const isFull = item.jumlah_anggota >= item.minimal_member;

    return (
      <Card style={styles.cardContainer}>
        <Card.Image style={styles.cardPhoto} source={{ uri: item.photoUrl }} />
        <Card.Divider />
        <Card.Title style={styles.title}>{item.nama_dolan}</Card.Title>
        <Text>{item.tanggal}</Text>
        <Text>{item.jam}</Text>
        <TouchableOpacity style={styles.anggota}><Text><IconButton icon="car" size={20} color="#000" onPress={() => this.fetchDataAnggota(item.id, item.jumlah_anggota, item.minimal_member)} />{item.jumlah_anggota}/{item.minimal_member} orang </Text></TouchableOpacity>
        <Text style={styles.alamat}>{item.lokasi}</Text>
        <Text>{item.alamat}</Text>
        {
          isFull ? (
            <TouchableOpacity style={[styles.joinButton, { backgroundColor: 'grey' }]} disabled>
              <Text style={styles.joinText}> <IconButton icon="door-open" size={20} color="#000" />Join</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.joinButton} onPress={() => this.handleJoinButton(item.id)}>
              <Text style={styles.joinText}> <IconButton icon="door-open" size={20} color="#000" />Join</Text>
            </TouchableOpacity>
        )}
      </Card>
    );
  };

  render() {
    const { data, isModalVisible } = this.state;

    return (
      <View style={styles.container}>
        <Card>
          <View style={styles.viewRow}>
            <Text>Cari Dolan</Text>
            <TextInput
              style={styles.input}
              onChangeText={(cari) => this.setState({ cari })}
              onSubmitEditing={this.fetchData}
            />
          </View>
        </Card>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={this.toggleModal}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Konco Dolanan</Text>
            <Text style={styles.jumlahAnggota}>Member bergabung: {this.state.jumlahAnggota}/{this.state.batasAnggota}</Text>
            <FlatList
              data={this.state.dataAnggota}
              renderItem={this.renderMember}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={this.toggleModal}
            >
              <Text style={styles.closeText}>Keren!</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  return <CariPage {...props} navigation={navigation} />;
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    borderWidth: 1,
    padding: 10,
    marginRight: 0,
  },
  viewRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: 'center',
    paddingRight: 50,
    margin: 3
  },
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#bedcfa',
  },
  cardPhoto: {
    height: 50,
    margin: 0,
    padding: 0,
  },
  cardContainer: {
    margin: 0,
    padding: 0,
    borderRadius: 20,
    backgroundColor: '#6d94b0',

  },
  anggota: {
    borderWidth: 1,
    width: 120,
    height: 50,
    borderRadius: 20,
    marginTop: 10,
    fontSize: 10,
},
  alamat: {
    paddingTop: 10,
  },
  title: {
    textAlign: 'left',
  },
  joinButton: {
    backgroundColor: '#9ed2f7',
    borderRadius: 20,
    width: 100,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  joinText: {
    color: 'black',
    textAlign: 'left',
  },
  memberContainer: {
    padding: 10,
},
modalView: {
    margin: 20,
    backgroundColor: '#e6ecf0',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: 300,
    marginLeft: 40,
    marginTop:100,
},
modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    alignSelf: 'flex-start',
},
closeButton: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    alignSelf: 'flex-end',
},
closeText: {
    color: 'blue',
    fontWeight: 'bold',
    textAlign: 'center',
},
jumlahAnggota: {
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 1,
    textAlign: 'center',
    alignSelf: 'flex-start',
},
userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 299,
    height: 60,
    marginBottom: 20,
},
avatarContainer: {
    marginRight: 20,
    alignItems: 'center',
    marginLeft: 20,
},
avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
},
fullName: {
    fontSize: 16,
    textAlign: 'center',
},
});
