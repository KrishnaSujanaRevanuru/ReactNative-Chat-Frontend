import React, { Component } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import MessagePop from './messagePop';
import SendButton from '../../../assests/send.png';
import { Dimensions } from 'react-native';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import Options from './options';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { screenHeight, screenWidth } = Dimensions.get('window');
class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: '',
      message: '',
      messages: [],
      isOponentTyping: false,
      showEmoji: false,
      reactionData: {},
      tempReaction: false,
      showOptions: false
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
    this.socket.on('messages', this.onMessages);
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
    Keyboard.dismiss();
    if (this.state.chatMessage) {
      this.socket.emit('chat', {
        username: this.props.user.username,
        client2: this.props.client.username,
        message: this.state.chatMessage,
      });
      this.setState({ chatMessage: "", showEmoji: false });
    }
  };

  onShowEmoji = () => {
    this.setState({ showEmoji: !this.state.showEmoji });
  }

  addEmoji = (emoji) => {
    if (this.state.showEmoji && this.state.tempReaction) {
      this.userReaction(emoji, this.state.reactionData)
    }
    else
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
  handleReaction = (obj) => {
    if (this.state.showEmoji === false) {
      this.setState({ reactionData: obj, showEmoji: true, tempReaction: true });
    }
    else if (this.state.showEmoji === true) {
      this.setState({ showEmoji: false })
    }
  }
  removeReaction = (obj) => {
    this.socket.emit("reaction", { username: this.props.user.username, client: this.props.client.username, messageId: obj.id })
    this.socket.once('messages', this.onMessages);
  }
  userReaction = (reaction, obj) => {
    this.socket.emit("reaction", { username: this.props.user.username, client: this.props.client.username, messageId: obj.id, reaction: reaction })
    this.socket.once('messages', this.onMessages);
    this.setState({ reactionData: {}, showEmoji: false, tempReaction: false });
  }
  showPopUp = () => {
    this.setState({ showOptions: this.state.showOptions ? false : true })
  }
  showProfile = () => {
    this.setState({ viewOptions: false })
    this.props.navigation.navigate('clientProfile');

  }
  setPopUpCallBack = () => {
    this.setState({ showOptions: false })
  }

  render() {
    const { messages } = this.state;
    return (
      <View style={styles.chat_room}>
        <View style={styles.header}>
          <Text onPress={() => { this.props.navigation.goBack() }}> <Icon size={22} color="white" name="arrow-back" /></Text>
          <Image style={styles.headerProfile} source={{ uri: this.props.user.profile }} />
          <Text style={styles.headerText}>{this.props.client.username}</Text>
          <Text style={styles.headerMenu} onPress={() => { this.showPopUp() }}>&#8942;</Text>
        </View>
        <View style={styles.popUp1}>{this.state.showOptions && <Options showProfile={this.showProfile} callBack={this.setPopUpCallBack} />}</View>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {messages && !!messages.length && messages.map((message, index) => {
            return (
              <View style={styles.message_field} key={index}>
                {this.getDateByTimestamp(message.timestamp)}
                {message.username === this.props.user.username ? (
                  <>
                    {message.is_delete !== 1 &&
                      <View>
                        <View style={styles.msg_right}>
                          <Text style={styles.message}>{message.message}</Text>
                          <Text style={styles.messageOptions} onPress={() => this.messagePopUp(message)} >&#8942;</Text>
                        </View>
                        {message && message.reaction && <TouchableOpacity style={styles.msg_right_reaction}><Text >{message.reaction}</Text></TouchableOpacity>}
                        <Text style={styles.msg_time_right}>
                          {this.getTimeByTimestamp(message.timestamp)}
                        </Text>
                        <View style={styles.popUp}>{message.messagePopUp ? <MessagePop messageDetails={message} optionsCategorey={"mssgPopup"} callBack={this.setMsgPopToFalse} /> : null}</View>
                      </View>
                    }
                  </>
                ) : (
                  <>
                    {message.is_delete !== 1 &&
                      <View style={styles.msg_field_container}>
                        <View style={styles.msg_left}>
                          <Text style={styles.message} onLongPress={() => { this.handleReaction(message) }}  >{message.message}</Text>
                          <Text style={styles.messageOptions} onPress={() => this.messagePopUp(message)} >&#8942;</Text>
                        </View>
                        {message && message.reaction && <TouchableOpacity onPress={() => { this.removeReaction(message) }} ><Text style={styles.msg_left_reaction}>{message.reaction}</Text></TouchableOpacity>}
                        <Text style={styles.msg_time_left}>
                          {this.getTimeByTimestamp(message.timestamp)}
                        </Text>
                        <View style={styles.popUp}>{message.messagePopUp ? <MessagePop messageDetails={message} optionsCategorey={"mssgPopup"} callBack={this.setMsgPopToFalse} /> : null}</View>
                      </View>}
                  </>)}
              </View>
            );
          })}
          <View>
            {this.state.isOponentTyping && <Text style={styles.typing}>{this.props.client.username}  typing...</Text>}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.emoji_view} onPress={() => { this.onShowEmoji() }}>
            <Text style={styles.emoji_add}><Icon size={28} color="#D5D4D0" name="emoji-emotions" /></Text>
          </TouchableOpacity>
          <TextInput
            style={styles.message_input}
            placeholder="Type a Message"
            placeholderTextColor="white"
            value={this.state.chatMessage}
            onChangeText={(msg) => { this.handleText(msg) }}
            onFocus={() => { this.setState({ showEmoji: false }) }}
            onSubmitEditing={() => this.send()}
          />
          <TouchableOpacity onPress={() => this.send()} style={styles.send_btn}>
            <Image style={styles.message_send} source={SendButton} />
          </TouchableOpacity>
        </View>
        {this.state.showEmoji &&
          <View style={styles.emojiContainer} onPress={Keyboard.dismiss()}>
            <EmojiSelector
              onEmojiSelected={(emoji) => { this.addEmoji(emoji) }}
              showTabs={true}
              showSearchBar={false}
              showHistory={true}
              showSectionTitles={true}
              category={Categories.all}
              columns={10}
            />
          </View>
        }
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
    height: '50%',
    width: '100%',
    backgroundColor: '#BFC2C6',
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
  typing: {
    fontSize: 14,
    alignSelf: 'flex-start',
    fontWeight: "bold",
    color: "white",
    marginLeft: "3%",
    marginBottom: "5%"
  },
  footer: {
    display: "flex",
    width: '99%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#373a3f',
    borderRadius: 50,
    left: '0.3%',
    bottom: '1%',
  },
  emoji_add: {
    color: '#CCCCC9',
    fontWeight: 'bold',
    fontSize: 32,
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
  popUp: {
    display: 'flex',
    position: 'absolute',
  },
  popUp1: {
    display: 'flex',
    position: 'absolute',
    left: "64%",
    width: "30%",
    top: 23
  },
  options: {
    display: 'flex',
    position: 'absolute',

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
  },
  msg_right_reaction: {
    marginTop: "-2%",
    fontSize: 15,
    backgroundColor: "#999A9B",
    height: 30,
    width: 30,
    borderRadius: 15,
    alignSelf: 'flex-end',
    padding: '1.5%',
    marginRight: '3%'
  },
  msg_left_reaction: {
    marginTop: "-2%",
    fontSize: 15,
    backgroundColor: "#999A9B",
    height: 30,
    width: 30,
    borderRadius: 15,
    padding: '1.5%',
    marginLeft: '3%'
  },
  popUp: { position: 'absolute', alignSelf: 'center' },
});

const mapStateToProps = state => (
  {
    user: state.user.userDetails,
    client: state.user.client,
    socket: state.socket,
  }
);

export default connect(mapStateToProps, null)(ChatRoom);
