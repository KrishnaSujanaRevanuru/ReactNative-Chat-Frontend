import React, { Component } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import MessagePop from './messagePop';
import EmojiAdd from '../../../assests/emoji-add-icon.png';
import SendButton from '../../../assests/send.png';
import { Dimensions } from 'react-native';

const { screenHeight, screenWidth } = Dimensions.get('window');
class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: '',
      message: '',
      messages: [],
      isOponentTyping: false,
      showEmoji: false
      // MessagePopUp:false
    };
  }
  socket = null;
  componentDidMount = () => {
    this.socket = io('https://ptchatindia.herokuapp.com/', {
      transports: ['websocket'],
    });
    this.socket.emit('joinRoom', {
      username: this.props.user.username,
      client2: this.props.client.username,
    });
    this.socket.once('messages', this.onMessages);
    this.socket.on('message', this.onMessage);
    this.socket.on('typing-start', this.onTyping);
    this.socket.on('typing-end', this.onTyping);
  };

  componentWillUnmount() {
    this.socket.off('message', this.onMessage);
    this.socket.off('messages', this.onMessages);
    this.socket.off('typing-start', this.onTyping);
    this.socket.off('typing-end', this.onTyping);
  }

  onTyping = data => {
    if (this.props.user.username !== data.username) {
      this.setState({ isOponentTyping: data.typing });
    }
  };

  onMessage = data => {
    let messages = this.state.messages;
    Object.assign(data, { messagePopUp: false });
    messages.push(data);
    this.previousDate = null;
    this.setState({ messages: messages });
  };

  onMessages = data => {
    this.setState({ messages: data.messages });
    this.socket.off('messages', true);
  };

  sendTypingStartStatus = () => {
    this.socket.emit('typing-start', {
      username: this.props.user.username,
      client2: this.props.client.username,
    });
  };

  sendTypingEndStatus = () => {
    this.socket.emit('typing-end', {
      username: this.props.user.username,
      client2: this.props.client.username,
    });
  };

  send = () => {
    if (this.state.chatMessage) {
      this.socket.emit('chat', {
        username: this.props.user.username,
        client2: this.props.client.username,
        message: this.state.chatMessage,
      });
      this.setState({ chatMessage: "" });
    }
  };

  onShowEmoji = () => {
    this.setState({ showEmoji: !this.state.showEmoji });
  }

  addEmoji = (emoji) => {
    this.setState({ chatMessage: this.state.chatMessage + emoji })
  }

  handleText = (msg) => {
    this.setState({ chatMessage: msg })
  }

  getTimeByTimestamp = timestamp => {
    let date = new Date(timestamp * 1000);
    let ampm = date.getHours() >= 12 ? 'pm' : 'am';
    let hours = date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
    return hours + ':' + date.getMinutes() + ampm;
  };

  previousDate = null;
  getDateByTimestamp = timestamp => {
    let date = new Date(timestamp * 1000);
    if (!this.previousDate) {
      this.previousDate = date;
      return (
        <Text style={styles.chatroom_date}>
          {date.getDate() +
            '/' +
            (date.getMonth() + 1) +
            '/' +
            date.getFullYear()}
        </Text>
      );
    } else {
      if (this.previousDate.getDate() < date.getDate())
        return (
          <Text className="chatroom-date">
            {date.getDate() +
              '/' +
              (date.getMonth() + 1) +
              '/' +
              date.getFullYear()}
          </Text>
        );
    }
  };

  messagePopUp = (messageObj) => {
    let messages = this.state.messages;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].id !== messageObj.id)
        messages[i].messagePopUp = false;
      else messages[i].messagePopUp = messages[i].messagePopUp ? false : true;
    }
    this.setState({ messages: messages });
  };

  setMsgPopToFalse = (msgObj) => {
    let messages = this.state.messages;
    for (let i = 0; i < messages.length; i++) messages[i].messagePopUp = false;
    this.setState({ messages: messages }, () => {
      this.socket.emit('delete', { username: this.props.user.username, client: this.props.client.username, messageId: msgObj.id })
      this.socket.once('messages', this.onMessages);
    })
  }

  render() {
    const { messages } = this.state;
    return (
      <View style={styles.chat_room}>
        <View style={styles.header}>
          <Image style={styles.headerProfile} source={{ uri: this.props.user.profile }} />
          <Text style={styles.headerText}>{this.props.client.username}</Text>
          <Text style={styles.headerMenu}>...</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {messages && !!messages.length && messages.map((message, index) => {
            return (
              <View style={styles.message_field} key={index}>
                {this.getDateByTimestamp(message.timestamp)}
                {message.username === this.props.user.username ? (
                  <>
                    {message.is_delete !== 1 &&
                      <View style={styles.msg_field_container}>
                        <View style={styles.msg_right}>
                          <Text style={styles.message}>{message.message}</Text>
                          <Text style={styles.messageOptions} onPress={() => this.messagePopUp(message)} >&#8942;</Text>
                        </View>
                        <Text style={styles.msg_time_right}>
                          {this.getTimeByTimestamp(message.timestamp)}
                        </Text>
                        <View>{message.messagePopUp ? <MessagePop messageDetails={message} optionsCategorey={"right message"} callBack={this.setMsgPopToFalse} /> : null}</View>
                      </View>
                    }
                  </>
                ) : (
                  <>
                    {message.is_delete !== 1 &&
                      <View style={styles.msg_field_container}>
                        <View style={styles.msg_left}>
                          <Text style={styles.message} >{message.message}</Text>
                          <Text style={styles.messageOptions} onPress={() => this.messagePopUp(message)} >&#8942;</Text>
                        </View>
                        <Text style={styles.msg_time_left}>
                          {this.getTimeByTimestamp(message.timestamp)}
                        </Text>
                        <View>{message.messagePopUp ? <MessagePop messageDetails={message} optionsCategorey={"left message"} callBack={this.setMsgPopToFalse} /> : null}</View>
                      </View>
                    }
                  </>
                )}
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.emoji_view} onPress={() => { this.onShowEmoji() }}>
            <Image style={styles.emoji_add} source={EmojiAdd} />
          </TouchableOpacity>
          <TextInput
            style={styles.message_input}
            placeholder="Type a Message"
            placeholderTextColor="white"
            value={this.state.chatMessage}
            onChangeText={(msg) => { this.handleText(msg) }}
          />
          <TouchableOpacity onPress={() => this.send()} style={styles.send_btn}>
            <Image style={styles.message_send} source={SendButton} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chat_room: {
    height: '100%',
    backgroundColor: '#202124',
  },
  header: {
    display: "flex",
    width: screenWidth,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: "row",
    backgroundColor: "#373a3f",
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  headerProfile: {
    width: 50,
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 25
  },
  headerText: {
    color: "white",
    fontSize: 22,
    marginLeft: 15
  },
  headerMenu: {
    textAlign: 'right',
    color: 'white',
    alignSelf: 'center',
    fontSize: 24,
    right: 10,
    position: 'absolute'
  },
  scrollViewContainer: {
    height: screenHeight,
    width: screenWidth,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  chatroom_date: {
    alignSelf: 'center',
    color: 'white',
    padding: '2%',
    marginBottom: '5%',
  },
  msg_right: {
    color: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: '#8E1FC4',
    padding: '2%',
    marginTop: '5%',
    marginBottom: '1%',
    marginRight: '2%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 0,
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  msg_time_right: {
    color: 'white',
    alignSelf: 'flex-end',
    marginRight: '3%',
  },
  msg_time_left: {
    color: 'white',
    alignSelf: 'flex-start',
    marginLeft: '3%',
  },
  emojiContainer: {
    height: '60%',
    width: '100%',
    position: 'absolute'
  },
  msg_left: {
    color: 'white',
    alignSelf: 'flex-start',
    backgroundColor: '#8a8787',
    display: 'flex',
    flexDirection: 'row',
    padding: '2%',
    marginTop: '5%',
    marginBottom: '1%',
    marginLeft: '3%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 30,
  },

  footer: {
    display: "flex",
    width: "97%",
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#373a3f',
    borderRadius: 50,
    bottom: 10,
    right: 5,
    position: 'absolute',
  },
  emoji_add: {
    height: 30,
    width: 30,
  },
  emoji: {
    width: '9%',
    height: '46%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#7652bf',
    marginTop: 30,
    left: 4,
  },

  message_input: {
    height: '100%',
    width: '70%',
    borderRadius: 15,
    marginLeft: '6%',
    alignSelf: 'center',
    color: 'white',
    fontSize: 15,
    backgroundColor: 'rgba(0,0,0,.25)',
  },
  send_btn: {
    backgroundColor: '#3273E5',
    height: 40,
    width: 40,
    borderRadius: 20,
    position: 'absolute',
    padding: '15%',
    right: 10,
  },
  message_send: {
    height: 30,
    width: 30,

  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  options: {
    color: 'white',
    fontSize: 16,
  },
  messageOptions: {
    fontSize: 15,
    color: 'white',
    marginLeft: 5,
  },
  messagePopUp: {
    alignSelf: 'flex-start'
  }
});

const mapStateToProps = state => (
  {
    user: state.user.userDetails,
    client: state.user.client,
    socket: state.socket,
  }
);

export default connect(mapStateToProps, null)(ChatRoom);
