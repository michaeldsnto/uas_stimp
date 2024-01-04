import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FAB, Icon, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from "@rneui/themed";
import { Modal } from 'react-native-web';

export default class JadwalPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            user_id: 0,
            isModalVisible: false,
            dataAnggota: {},
            jumlahAnggota: 0,
            batasAnggota: 0,
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
            console.log('Error dalam mengambil data local storage:', error);
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
            fetch('https://ubaya.me/react/160420085/uas/jadwal_list.php', options)
                .then(response => response.json())
                .then(resjson => {
                    this.setState({
                        data: resjson.data || [],
                    });
                })
                .catch(error => {
                    console.log('Error fetching data jadwal:', error);
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
                    this.setState({
                        dataAnggota: resjson.data,
                        isModalVisible: true,
                        jumlahAnggota: jumlahAnggota,
                        batasAnggota: batasAnggota
                    })
                })
                .catch(error => {
                    console.log('Error fetching data anggota:', error);
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

    handlePartyChat = (room_id) => {
        this.setState({ room_id }, () => {
            this.props.navigation.navigate('PartyChat', { room_id: this.state.room_id });
        });
    };

    renderItem = ({ item }) => {
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
                <TouchableOpacity
                    style={styles.partyChatButton}
                    onPress={() => this.handlePartyChat(item.room_id)}
                >
                    <Text style={styles.partyChatText}>
                        <IconButton icon="chat" size={20} color="#000" />
                        Party Chat
                    </Text>
                </TouchableOpacity>
            </Card>
        );
    };

    render() {
        const { data, isModalVisible } = this.state;

        return (
            <View style={styles.container}>
                {data && data.length === 0 ? (
                    <Text style={styles.emptyText}>
                        Jadwal masih kosong nih <br></br> Cari teman main atau buat jadwal baru aja
                    </Text>
                ) : (
                    <FlatList
                        data={data}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                )}

                <FAB
                    style={styles.fab}
                    icon="pencil"
                    onPress={() => this.props.navigation.navigate('BuatJadwal')}
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

const styles = StyleSheet.create({
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
    partyChatButton: {
        backgroundColor: '#9ed2f7',
        borderRadius: 20,
        width: 130,
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    partyChatText: {
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
        marginTop: 100,
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