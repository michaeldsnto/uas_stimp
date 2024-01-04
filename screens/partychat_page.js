import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { FlatList } from 'react-native-web';

export default class PartyChatPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            messageText: '',
            room_id: 0,
            user_id: 0,
        };
    }
    componentDidMount() {
        const user_id = localStorage.getItem('userId');
        this.setState({ user_id });

        const { route } = this.props;
        const room_id = route.params.room_id;
        this.setState({ room_id }, () => {
            this.fetchData();
        });
    }
    fetchData = () => {
        const { room_id } = this.state;
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "room_id=" + room_id
        };

        try {
            fetch('https://ubaya.me/react/160420085/uas/partychat.php', options)
                .then(response => response.json())
                .then(resjson => {
                    this.setState({
                        data: resjson.data
                    });
                })
                .catch(error => {
                    console.log('Error fetching data chat:', error);
                });
        } catch (error) {
            console.log(error);
        }
    }
    renderMessage = ({ item }) => {
        return (
            <View style={styles.messageContainer}>
                <Text style={styles.messageName}>{item.full_name}</Text>
                <Text style={styles.messageText}>{item.message}</Text>
            </View>
        );
    };
    sendMessage = () => {
        const { user_id, room_id, messageText } = this.state;
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "sender_id=" + user_id + "&" +
                "room_id=" + room_id + "&" + 
                "message=" + messageText
        };
        try {
            fetch('https://ubaya.me/react/160420085/uas/kirimpesan.php', options)
                .then(response => response.json())
                .then(resjson => {
                    console.log("Response:", resjson);
                    this.fetchData();
                    alert("Pesan berhasil terkirim");
                })
                .catch(error => {
                    console.log('Error :', error);
                });
        } catch (error) {
            console.log(error);
        }
    };



    render() {
        const { data, messageText } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.namadolan}>Nama Dolan</Text>

                <ScrollView style={styles.chatContainer}>
                    <FlatList
                        style={styles.chatContainer}
                        data={data}
                        renderItem={this.renderMessage}
                        keyExtractor={(item, index) => index.toString()}
                    />

                </ScrollView>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={messageText}
                        onChangeText={(text) => this.setState({ messageText: text })}
                        placeholder="Tulis pesan..."
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={this.sendMessage}>
                        <IconButton icon="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    namadolan: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginLeft: 20,
    },
    chatContainer: {
        flex: 1,
        padding: 10,
    },
    messageContainer: {
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 20,
    },
    messageText: {
        fontSize: 16,
        paddingLeft: 10
    },
    messageName: {
        fontSize: 16,
        paddingLeft: 10,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    input: {
        flex: 1,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#3498db',
        borderRadius: 25,
        padding: 1,
    },
});





