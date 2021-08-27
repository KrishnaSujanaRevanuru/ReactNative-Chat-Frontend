import React, { Component } from "react";
import io from "socket.io-client";
import { connect } from 'react-redux';
import { ScrollView, Text, StyleSheet, View, Pressable, TextInput} from "react-native"

class ChatRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chatMessage: "",
            message: '',
            messages: [],

        }
    }
    socket = null;
    componentDidMount = () => {
        this.socket = io("https://ptchatindia.herokuapp.com/", { transports: ['websocket'] });
        this.socket.emit("joinRoom", { username: this.props.user.username, client2: this.props.client.username });
        this.socket.once("messages", this.onMessages);
        this.socket.on("message", this.onMessage);
    }

    componentWillUnmount() {
        this.socket.off('message', this.onMessage);
        this.socket.off('messages', this.onMessages);
    }

    onMessage = (data) => {
        let messages = this.state.messages;
        messages.push(data);
        this.previousDate = null;
        this.setState({ messages: messages });
    }

    onMessages = (data) => {
        this.setState({ messages: data.messages });
        this.socket.off("messages", true);
    }

    send = () => {
        if (this.state.chatMessage) {
            this.socket.emit("chat", {
                username: this.props.user.username,
                client2: this.props.client.username,
                message: this.state.chatMessage
            });
            this.setState({ chatMessage: "" });
        }
    }

    render() {
        const { messages } = this.state;
        return (
            <ScrollView contentContainerStyle={styles.chat_room}>
                <View style={styles.msg_container}>
                    {messages && !!messages.length && messages.map((message, index) => {
                        return (<View style={styles.message_field} key={index}>
                            {message.username === this.props.user.username ?
                                (<View style={styles.msg_field_container} >
                                    <Text style={styles.msg_right}>{message.message}</Text>
                                </View>) :
                                (<View >
                                    <Text style={styles.msg_left}>{message.message}</Text>
                                </View>)
                            }
                        </View>)
                    })}
                </View>
                <View style={styles.footer}>
                    <View style={styles.emoji}>

                    </View>
                    <View style={styles.message_input}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a Message"
                            placeholderTextColor="white"
                            value={this.state.chatMessage}
                            onSubmitEditing={() => this.send()}
                            onChangeText={chatMessage => {
                                this.setState({ chatMessage });
                            }}
                        />
                    </View>
                    <View style={styles.submit_button}>
                        <Pressable onPress={() => this.send()} >
                            <Text style={styles.text}>Send</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    chat_room: {
        height: '100%',
        width: '100%',
        backgroundColor: "#202124"
    },

    msg_container: {
        width: '90%',
        height: '80%',
        backgroundColor: '#383a3f',
        flexDirection: 'column',
        justifyContent: "flex-end",
        overflow: 'hidden',
        marginLeft: '5%',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    msg_right: {
        color: "white",
        fontSize: 16,
        alignSelf: 'flex-end',
        backgroundColor: "#8a8787",
        fontWeight: 'bold',
        padding: '2%',
        marginBottom: '5%',
        marginRight:"3%",
        borderRadius: 6
    },
    msg_left: {
        color: 'white',
        fontSize: 16,
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        backgroundColor: "#8a8787",
        padding: '2%',
        marginBottom: '5%',
        marginLeft:"3%",
        borderRadius: 6

    },
  
    footer: {
        width: '90%',
        height: '10%',
        bottom: 10,
        top: 0.8,
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#373a3f",
        marginLeft: '5%',
        borderRadius: 20,
        borderTopRightRadius: 1,
        borderTopLeftRadius: 1,
    },
    emoji: {
        width: '9%',
        height: '46%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#7652bf',
        marginTop: 30,
        left: 4
    },

    message_input: {
        height: '100%',
        width: '70%',
    },

    input: {
        borderWidth: 1,
        borderRadius: 10,
        width: '90%',
        height: '50%',
        backgroundColor: 'rgba(0,0,0,.25)',
        fontWeight: "bold",
        alignSelf: "center",
        color: "white",
        marginTop: 30
    },

    submit_button: {
        height: '50%',
        width: "18%",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#7652bf',
        marginTop: 30,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    }
})

const mapStateToProps = (state) => (
    console.log('map state to props', state),
    {
        user: state.user.userDetails,
        client: state.user.client,
        socket: state.socket
    }

);

export default connect(mapStateToProps, null)(ChatRoom);