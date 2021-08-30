import React, {Component} from 'react';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native';
import MenuButton from '../../../assests/horizontalDots.png';
import MessagePop from './messagePop';
import EmojiAdd from '../../../assests/emoji-add-icon.png'

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: '',
      message: '',
      messages: [],
      isOponentTyping: false,
      showEmoji:false
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
      this.setState({isOponentTyping: data.typing});
    }
  };

  onMessage = data => {
    let messages = this.state.messages;
    Object.assign(data, {messagePopUp: false});
    messages.push(data);
    this.previousDate = null;
    this.setState({messages: messages});
  };

  onMessages = data => {
    this.setState({messages: data.messages});
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
      this.setState({chatMessage: ""});
    }
  };

    onShowEmoji = () => {
        this.setState({ showEmoji: !this.state.showEmoji });
    }

    addEmoji = (emoji) => {
        this.setState({ message: this.state.message + emoji })
    }

    handleText = (msg) => {
        this.setState({ message: msg,chatMessage:msg })
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

  messagePopUp = index => {
    let messages = this.state.messages;
    messages[index].messagePopUp = messages[index].messagePopUp ? false : true;
    this.setState({messages: messages});
  };

  render() {
    const {messages} = this.state;
    return (
      <View style={styles.chat_room}>
        <View style={styles.header}>
          <View>
            <Image
              style={styles.headerProfile}
              source={{uri: this.props.user.profile}}
            />
          </View>
          <View style={styles.headerTitle}>
            <Text style={styles.headerText}>{this.props.client.username}</Text>
          </View>
          <View style={styles.headerMenu}>
            <Image style={styles.menu} source={MenuButton} />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.msg_container}>
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
          {messages &&
            !!messages.length &&
            messages.map((message, index) => {
              return (
                <View style={styles.message_field} key={index}>
                  {this.getDateByTimestamp(message.timestamp)}
                  {message.username === this.props.user.username ? (
                    <View>
                      <View style={styles.msg_field_container}>

                        <View>
                        <Text style={styles.msg_right} onPress={() => this.messagePopUp(index)} >{message.message}</Text>
                            {/* <Text onPress={() => this.messagePopUp(index)} >:</Text> */}
                          </View>
                        <Text style={styles.msg_time_right}>
                          {this.getTimeByTimestamp(message.timestamp)}
                        </Text>
                        <View>{message.messagePopUp ? <MessagePop /> : null}</View>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.msg_left}>{message.message}</Text>
                      <Text style={styles.msg_time_left}>
                        {this.getTimeByTimestamp(message.timestamp)}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
        </ScrollView>
        <View style={styles.footer}>
          <View >
          <TouchableOpacity style={styles.emojiview} onPress={() => { this.onShowEmoji() }}>
                        <Image style={styles.emojiadd} source={EmojiAdd} />
            </TouchableOpacity>
          </View>
          <View style={styles.message_input}>
            <TextInput
              style={styles.input}
              placeholder="Type a Message"
              placeholderTextColor="white"
              value={this.state.chatMessage}
              value={this.state.message}
              onChangeText={(msg) => { this.handleText(msg) }}
              
            />
          </View>
          <View style={styles.submit_button}>
            <Pressable onPress={() => this.send()}>
              <Text style={styles.text}>Send</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chat_room: {
    height: '100%',
    width: '100%',
    flex: 1,
    backgroundColor: '#202124',
  },
  header: {
    height: '10%',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#202124',
    paddingTop: 10,
  },
  headerProfile: {
    marginLeft: '5%',
    width: 50,
    height: '90%',
    borderRadius: 30,
    alignSelf: 'center',
  },
  headerTitle: {
    width: 260,
    height: '90%',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  headerText: {
    color: 'white',
  },
  headerMenu: {
    width: 40,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  menu: {
    width: 20,
    height: 20,
    backgroundColor: '#383a3f',
    borderRadius: 20,
    left: '10%',
  },
  msg_container: {
    flex: 1,
    width: '90%',
    height: '100%',
    backgroundColor: '#383a3f',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginLeft: '5%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  msg_field_container:{
    // width: '10%',
    // backgroundColor: 'white',
    // height: '20%',
  },
  chatroom_date: {
    alignSelf: 'center',
    color: 'white',
    padding: '2%',
    marginBottom: '5%',
  },
  emojiview: {
    top: '9%',
    left: '5%'
},
emojiadd: {
    height: 30,
    width: 30
},
  msg_right: {
    color: 'white',
    fontSize: 16,
    alignSelf: 'flex-end',
    backgroundColor: '#8a8787',
    fontWeight: 'bold',
    padding: '2%',
    marginTop: '5%',
    marginBottom: '1%',
    marginRight: '2%',
    borderRadius: 6,
  },

  msg_time_right: {
    color: 'white',
    alignSelf: 'flex-end',
    marginRight: '3%',
    // backgroundColor: "#8a8787",
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
    fontSize: 16,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    backgroundColor: '#8a8787',
    padding: '2%',
    marginTop: '5%',
    marginBottom: '1%',
    marginLeft: '3%',
    borderRadius: 6,
  },

  footer: {
    width: '90%',
    height: '20%',
    bottom: 10,
    top: 0.8,
    flexDirection: 'row',
    backgroundColor: '#373a3f',
    marginLeft: '5%',
    marginBottom: '5%',
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
    left: 4,
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
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'white',
    marginTop: 30,
  },

  submit_button: {
    height: '50%',
    width: '18%',
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
  },
  options: {
    color: 'white',
    fontSize: 16,
  },
});

const mapStateToProps = state => (
  {
    user: state.user.userDetails,
    client: state.user.client,
    socket: state.socket,
  }
);

export default connect(mapStateToProps, null)(ChatRoom);
