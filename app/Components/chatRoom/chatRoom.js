import React, { Component } from "react";
import { ScrollView, Text, StyleSheet, View, Pressable, TextInput, Image, KeyboardAvoidingView, Button, TouchableOpacity, TouchableHighlightBase } from "react-native"
import EmojiAdd from '../../../assests/emoji-add-icon.png';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import { getSocket } from '../../../service/socket';
import { connect } from 'react-redux';

class ChatRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: "",
            showEmoji: false,
            messages: [],

        }
    }
    socket = null;

    componentDidMount = () => {
        this.socket = getSocket();
    }

    onShowEmoji = () => {
        this.setState({ showEmoji: !this.state.showEmoji });
    }

    addEmoji = (emoji) => {
        this.setState({ message: this.state.message + emoji })
    }

    handleText = (msg) => {
        console.log(msg);
        this.setState({ message: msg })
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.chat_room}>
                <View style={styles.msg_container}>
                    {this.state.showEmoji &&
                        <View style={styles.emojiContainer}>
                            <EmojiSelector
                                onEmojiSelected={(emoji) => { this.addEmoji(emoji) }}
                                showTabs={true}
                                showSearchBar={false}
                                showHistory={true}
                                showSectionTitles={true}
                                category={Categories.all}
                            />
                        </View>
                    }
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.emojiview} onPress={() => { this.onShowEmoji() }}>
                        <Image style={styles.emojiadd} source={EmojiAdd} />
                    </TouchableOpacity>
                    <KeyboardAvoidingView style={styles.message_input}>
                        <TextInput
                            value={this.state.message}
                            onChangeText={(msg) => { this.handleText(msg) }}
                            style={styles.input}
                            placeholder="Type a Message"
                            placeholderTextColor="white"
                        />
                    </KeyboardAvoidingView>
                    <View style={styles.submit_button}>
                        <Pressable>
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
        top: 0,
        left: 0,
        backgroundColor: "#202124"
    },

    msg_container: {
        width: '90%',
        height: '85%',
        backgroundColor: '#383a3f',
        flexDirection: 'column',
        justifyContent: "flex-end",
        overflow: 'hidden',
        marginLeft: '5%',
        borderRadius: 0,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,

    },
    msg_text: {
        color: "white",
    },

    footer: {
        width: '90%',
        height: '100%',
        bottom: 10,
        top: 0.5,
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#373a3f",
        marginLeft: '5%',
        borderRadius: 20,
        borderTopRightRadius: 1,
        borderTopLeftRadius: 1,
    },
    emojiview: {
        top: '9%',
        left: '5%'
    },
    emojiadd: {
        height: 30,
        width: 30
    },
    message_input: {
        height: '100%',
        width: '70%',
    },
    emojiContainer: {
        height: '60%',
        width: '100%',
        position: 'absolute'
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        width: '90%',
        height: '60%',
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