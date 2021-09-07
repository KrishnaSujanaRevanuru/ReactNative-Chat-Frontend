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
import { starMsgs } from '../../actions/actions';
import CheckBox from 'react-native-check-box';
import MessagePop from './messagePop';
import SendButton from '../../../assests/send.png';
import { Dimensions } from 'react-native';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CrossIcon from 'react-native-vector-icons/Foundation';
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
      isSelect: false,
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
    Object.assign(data, { messagePopUp: false, isStar: false });
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

  setMsgPopToFalse = (msgObj, type) => {
    let messages = this.state.messages;
    for (let i = 0; i < messages.length; i++) messages[i].messagePopUp = false;
    switch (type) {
      case "delete":
        this.setState({ messages: messages }, () => {
          this.socket.emit('delete', { username: this.props.user.username, client: this.props.client.username, messageId: msgObj.id })
          this.socket.once('messages', this.onMessages);
        })
        break;
      case "star": this.setState({ messages: messages }); break;
      default: break;
    }
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

  isStar = (messageObj) => {
    let starMsgs = this.props.starMsgsArray;
    let found = -1;
    if (starMsgs.length === 0) return false;
    else {
      for (let i = 0; i < starMsgs.length; i++) {
        if (starMsgs[i].id === messageObj.id) found = i;
      }
      if (found >= 0) return true;
      else return false;
    }
  }
  onSelect = (type) => {
    let starMsgsArray = this.props.starMsgsArray;
    let messages = this.state.messages;
    let temp = [];
    switch (type) {
      case 'select': this.setState({ isSelect: true }); break;
      case 'star':
        temp = [...starMsgsArray, ...this.selectedMsgs];
        this.props.starMsgs(temp);
        this.selectedMsgs = [];
        messages = messages.map((obj) => ({ ...obj, isStar: false, }));
        this.setState({ isSelect: false, messages: messages }); break;
      case 'unstar':
        temp = starMsgsArray.filter(x => !this.selectedMsgs.filter(y => y.id === x.id).length);
        this.props.starMsgs(temp);
        this.selectedMsgs = [];
        messages = messages.map((obj) => ({ ...obj, isStar: false, }));
        this.setState({ isSelect: false, messages: messages }); break;
      case 'cancel': this.selectedMsgs = [];
        messages = messages.map((obj) => ({ ...obj, isStar: false, }));
        this.setState({ isSelect: false, messages: messages }); break;
      default: break;
    }
  }
  selectedMsgs = [];
  count = 0;
  onchange(messageObj, index) {
    let messages = this.state.messages;
    this.selectedMsgs.push(messageObj);
    messages[index].isStar = messages[index].isStar ? false : true;
    this.setState({ messages: messages });
  }

  render() {
    const { messages, isSelect } = this.state;
    return (
      <View style={styles.chat_room}>
        <View style={styles.header}>
          <Text style={styles.back_arrow} onPress={() => { this.props.navigation.goBack() }}>&#8592;</Text>
          <Image style={styles.headerProfile} source={{ uri: this.props.user.profile }} />
          <Text style={styles.headerText}>{this.props.client.username}</Text>
          {isSelect ?
            <View style={styles.selectMenu}>
              <TouchableOpacity onPress={() => this.onSelect("star")}><Text style={styles.selectOptions}><Icon size={25} color="gold" name="star" /></Text></TouchableOpacity>
              <TouchableOpacity onPress={() => this.onSelect("unstar")}><Text style={styles.selectOptions}><Icon size={25} color="gold" name="star-off" /></Text></TouchableOpacity>
              <TouchableOpacity onPress={() => this.onSelect("cancel")}><Text style={styles.selectOptions}><CrossIcon size={25} color="red" name="x" /></Text></TouchableOpacity>
            </View> :
            <TouchableOpacity style={styles.select} onPress={() => this.onSelect("select")}>
              <Text style={styles.selectText}>{isSelect ? 'Star' : 'Select'}</Text>
            </TouchableOpacity>}
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
                      <View>
                        <View style={styles.msg_right}>
                          {isSelect && <CheckBox isChecked={message.isStar} onClick={() => this.onchange(message, index)} style={styles.checkBox_right} />}
                          <Text style={styles.message}>{message.message}{this.isStar(message) ? ' ⭐' : ' ✩'}</Text>
                          <Text style={styles.messageOptions} onPress={() => this.messagePopUp(message)} >&#8942;</Text>
                          {message && message.reaction && <TouchableOpacity onPress={() => { this.removeReaction(message) }} style={styles.msg_right_reaction}><Text style={{ marginLeft: "3%" }}>{message.reaction}</Text></TouchableOpacity>}
                        </View>
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
                          <Text style={styles.message} onLongPress={() => { this.handleReaction(message) }}  >{message.message}{this.isStar(message) ? ' ⭐' : ' ✩'}</Text>
                          <Text style={styles.messageOptions} onPress={() => this.messagePopUp(message)} >&#8942;</Text>
                          {isSelect && <CheckBox isChecked={message.isStar} onClick={() => this.onchange(message, index)} style={styles.checkBox_left} />}
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
            <Text style={styles.emoji_add}>&#9787;</Text>
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
  select: {
    position: 'absolute',
    right: 40,
    top: 40,
  },
  selectText: {
    fontSize: 16,
    color: 'white',
  },
  checkBox_left: {
    marginLeft: '1%',
  },
  checkBox_right: {
    marginRight: '1%',
  },
  selectMenu:{
     display: 'flex',
      flexDirection: 'row' ,
      position: 'absolute',
      right: 40,
      top: 35
  },
  selectOptions:{
    paddingRight: 10,
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
    // position: 'absolute'
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
    color: 'gray',
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
  back_arrow: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    height: 30,
    width: 30,
    marginBottom: 27
  },
  popUp: { position: 'absolute', alignSelf: 'center' },
});

const mapStateToProps = state => (
  {
    user: state.user.userDetails,
    client: state.user.client,
    socket: state.socket,
    starMsgsArray: state.user.starMsgs,
  }
);

const mapDispatchToProps = (dispatch) => ({
  starMsgs: (data) => dispatch(starMsgs(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);
