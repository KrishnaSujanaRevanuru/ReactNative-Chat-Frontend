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
import readIcon from '../../../assests/seenTick.png';
import SendButton from '../../../assests/send.png';
import deliveredIcon from '../../../assests/deliveredTick.png';
import { Dimensions } from 'react-native';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import { Directions } from 'react-native-gesture-handler';
import { starMsgs } from '../../actions/actions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RFIcon from 'react-native-vector-icons/Entypo';
import Back from 'react-native-vector-icons/MaterialIcons';
import CheckBox from 'react-native-round-checkbox';
import Icons from 'react-native-vector-icons/MaterialIcons';
import OptionsPop from '../chatScreen/optionsPop';

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
      replyMessageIndex: -1,
      select: false,
      isStar: true,
      showOptions: false
    };
  }
  selectedMsgs = [];
  count = 0;
  firstMessage = ''
  firstMessageSender = ''
  replyMessage = ''
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
    if (data && this.props.user && data.username !== this.props.user.username) {
      this.socket.emit("read_status", {
        username: this.props.user.username,
        client2: this.props.client.username,
        messageIds: [data.id],
      });
      data.readStatus = 1;
    }
    let messages = this.state.messages;
    Object.assign(data, { messagePopUp: false, isSelect: false });
    messages.push(data);
    this.previousDate = null;
    this.setState({ messages: messages });
  };

  onMessages = (data) => {
    if (this.state.messages && data && this.state.messages.length < data.messages.length) {
      let msgIds = data.messages.filter((msg) => {
        if (msg.readStatus === 0 && this.props.user.username !== msg.username) {
          return msg.id;
        }
      });
      if (msgIds && msgIds.length) {
        this.socket.emit("read_status", {
          username: this.props.user.username,
          client2: this.props.client.username,
          messageIds: msgIds,
        });
      }
    }
    this.setState({ messages: data.messages }
      , () => {
        this.socket.on("message", this.onMessage);
        this.socket.on("typing-start", this.onTyping);
        this.socket.on("typing-end", this.onTyping);
      }
    );
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

  send = (replyMessageIndex) => {
    Keyboard.dismiss();
    this.setState({showEmoji: false })
    if (replyMessageIndex === -1) {
      if (this.state.chatMessage) {
        this.socket.emit('chat', {
          username: this.props.user.username,
          client2: this.props.client.username,
          message: this.state.chatMessage,
        });
        this.setState({ chatMessage: "" });
      }
    }
    else {
      if (this.state.chatMessage) {
        this.socket.emit("reply", {
          username: this.props.user.username,
          client: this.props.client.username,
          messageId: this.state.messages[this.state.replyMessageIndex].id,
          message: this.state.chatMessage
        });
        this.setState({ chatMessage: "" });
      }
    }
    this.replyMessage = false
    this.setState({ replyMessageIndex: -1, replyMessage: false });
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

  handleReaction = (obj) => {
    this.count++;
    if(this.count===2){
    if (this.state.showEmoji === false) {
      this.setState({ reactionData: obj, showEmoji: true, tempReaction: true });
    }
    else if (this.state.showEmoji === true) {
      this.setState({ showEmoji: false })
    }
  }
  setTimeout(()=>{this.count=0},400);
  }
  removeReaction = (obj) => {
    this.socket.emit("reaction", { username: this.props.user.username, client: this.props.client.username, messageId: obj.id })
  }
  userReaction = (reaction, obj) => {
    this.socket.emit("reaction", { username: this.props.user.username, client: this.props.client.username, messageId: obj.id, reaction: reaction })
    this.setState({ reactionData: {}, showEmoji: false, tempReaction: false });
  }

  cancelReply = () => {
    this.replyMessage = false
    this.setState({ replyMessageIndex: -1 });
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
      case 'reply':
        for (let i = 0; i < messages.length; i++) {
          if (messages[i].id === this.selectedMsgs[0].id) {
            this.firstMessage = this.selectedMsgs[0].message;
            this.firstMessageSender = this.selectedMsgs[0].username;
            this.replyMessage = true;
            this.setState({ replyMessageIndex: i });
          }
        } break;
      case 'star':
        temp = [...starMsgsArray, ...this.selectedMsgs];
        this.props.starMsgs(temp); break;
      case 'unstar':
        temp = starMsgsArray.filter(x => !this.selectedMsgs.filter(y => y.id === x.id).length);
        this.props.starMsgs(temp); break;
      case "delete":
        temp = starMsgsArray.filter(x => !this.selectedMsgs.filter(y => y.id === x.id).length);
        this.props.starMsgs(temp);
        for (let i = 0; i < this.selectedMsgs.length; i++) {
          this.socket.emit('delete', { username: this.props.user.username, client: this.props.client.username, messageId: this.selectedMsgs[i].id })
        } break;
      case "forward":
        this.props.navigation.navigate('forward', { message: this.selectedMsgs });
        break;
      default: break;
    }
    this.selectedMsgs = [];
    messages = messages.map((obj) => ({ ...obj, isSelect: false, }));
    this.setState({ select: false, messages: messages, isStar: true });
  }

  onChange(messageObj, index) {
    let { messages, isStar, select } = this.state;
    let starMsgsArray = this.props.starMsgsArray;
    messages[index].isSelect = messages[index].isSelect ? false : true;
    if (messages[index].isSelect) this.selectedMsgs.push(messageObj);
    else {
      for (let i = 0; i < this.selectedMsgs.length; i++)
        if (this.selectedMsgs[i].id === messageObj.id) this.selectedMsgs.splice(i, 1);
    }
    for (let i = 0; i < starMsgsArray.length; i++) {
      if (messageObj.id === starMsgsArray[i].id) isStar = false;
    }
    this.setState({ messages: messages, isStar: isStar, select: !this.selectedMsgs.length ? false : true });
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
    const { messages, select, isStar } = this.state;
    return (
      <View style={styles.chat_room}>
        {!select ?
          <View style={styles.header}>
        <Text onPress={() => { this.props.navigation.goBack() }}> <Icons size={22} color="white" name="arrow-back-ios" /></Text>
            <Image style={styles.headerProfile} source={{ uri: this.props.user.profile }} />
            <Text style={styles.headerText}>{this.props.client.username}</Text>
          <Text style={styles.headerMenu} onPress={() => { this.showPopUp() }}>&#8942;</Text>
          </View>
          :
          <View style={styles.selectHeader}>
            <TouchableOpacity onPress={() => this.onSelect()}><Text style={styles.selecToBack}><Back size={30} color="white" name="arrow-back-ios" /></Text></TouchableOpacity>
            {this.selectedMsgs.length <= 1 && <TouchableOpacity onPress={() => this.onSelect("reply")}><Text style={styles.selectOptions}><RFIcon size={30} color="white" name="reply" /></Text></TouchableOpacity>}
            {isStar ? <TouchableOpacity onPress={() => this.onSelect("star")}><Text style={styles.selectOptions}><Icon size={30} color="white" name="star" /></Text></TouchableOpacity>
              : <TouchableOpacity onPress={() => this.onSelect("unstar")}><Text style={styles.selectOptions}><Icon size={30} color="white" name="star-off" /></Text></TouchableOpacity>}
            <TouchableOpacity onPress={() => this.onSelect("delete")}><Text style={styles.selectOptions}><Icon size={30} color="white" name="delete" /></Text></TouchableOpacity>
            {this.selectedMsgs.length <= 5 && <TouchableOpacity onPress={() => this.onSelect("forward")}><Text style={styles.selectOptions}><RFIcon size={30} color="white" name="forward" /></Text></TouchableOpacity>}
          </View>}
        <View style={styles.popUp1}>{this.state.showOptions && <OptionsPop navcomponent="chatRoom" pinCallBack={this.pinContact} showProfile={this.showProfile} callBack={this.setPopUpCallBack} unPinCallBack={this.unPinContact} obj={this.props.client}/>}</View>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {messages && !!messages.length && messages.map((message, index) => {
            return (
              <View style={styles.message_field} key={index}>
                {this.getDateByTimestamp(message.timestamp)}
                {message.username === this.props.user.username ? (
                  <>
                    {message.is_delete !== 1 &&
                      <TouchableOpacity
                        onLongPress={() => { this.setState({ select: true }), this.onChange(message, index) }} onPress={() => { select ? this.onChange(message, index) :'' }}    >
                        <View style={{ position: 'absolute', marginTop: '10%' }}>
                          {select && <CheckBox
                            size={18}
                            borderColor={'white'}
                            backgroundColor={'#06C0F9'}
                            iconCOlor={'white'} checked={message.isSelect}
                            onValueChange={() => this.onChange(message, index)}
                          />}
                        </View>
                        <View style={styles.msg_right}>
                          {message.hasOwnProperty('replyId') ?
                            <View>
                              {messages.map((replyMessage, index) => {
                                return (
                                  <View key={index}>
                                    {message.replyId === replyMessage.id ?
                                      <View>
                                        <View style={styles.right_replyMessage_view}>
                                          <Text style={styles.right_username}>{replyMessage.username}</Text>
                                          <Text style={styles.message}>{replyMessage.message.trim()}</Text>
                                        </View>
                                        <View style={styles.replyMessage_left_right}>
                                          <Text style={styles.right_message}>{message.message.trim()}</Text>
                                        </View>
                                        <View>
                                          <Text style={styles.msg_time_right}>
                                            {this.isStar(message) ? ' ⭐ ' : ' '}
                                            {this.getTimeByTimestamp(message.timestamp)}
                                            {message.readStatus ? <Image source={readIcon} /> : <Image source={deliveredIcon} />}
                                          </Text>
                                        </View>
                                      </View> : null}
                                  </View>
                                )
                              })}
                            </View> : <View><View style={styles.replyMessage_left_right}>

                              <Text style={styles.right_message}>{message.message.trim()}</Text>
                              </View><View>
                              <Text style={styles.msg_time_right}>
                                {this.isStar(message) ? ' ⭐ ' : ' '}
                                {this.getTimeByTimestamp(message.timestamp)}
                                {message.readStatus ? <Image source={readIcon} /> : <Image source={deliveredIcon} />}
                              </Text>
                            </View></View>}
                        </View>
                          {message && message.reaction && <TouchableOpacity  style={styles.msg_right_reaction}><Text style={{ marginLeft: "3%" }}>{message.reaction}</Text></TouchableOpacity>}
                      </TouchableOpacity>
                    }
                  </>
                ) : (
                  <>
                    {message.is_delete !== 1 &&
                      <TouchableOpacity onLongPress={() => { this.setState({ select: true }), this.onChange(message, index) }} onPress={() => { select ? this.onChange(message, index) : this.handleReaction(message) }}>
                        <View style={styles.msg_left}>
                            {message.hasOwnProperty('replyId') ?
                              <View>
                                {messages.map((replyMessage, index) => {
                                  console.log("messages", messages);
                                  return (
                                    <View key={index}>
                                      {message.replyId === replyMessage.id ?
                                        <View>
                                          <View style={styles.left_replyMessage_view}>
                                            <Text style={styles.left_username}>{replyMessage.username}</Text>
                                            <Text style={styles.left_message}>{replyMessage.message.trim()}</Text>
                                          </View>
                                          <View style={styles.replyMessage_left_right}>
                                            <Text style={styles.left_message}>{message.message.trim()}</Text>
                                          </View>
                                          <View>
                                            <Text style={styles.msg_time_left}>
                                              {this.isStar(message) ? ' ⭐ ' : ' '}
                                              {this.getTimeByTimestamp(message.timestamp)}
                                            </Text>
                                          </View>
                                        </View> : null}
                                    </View>
                                  )
                                })}
                              </View> : <View><View style={styles.replyMessage_left_right}>
                                <Text style={styles.left_message}>{message.message.trim()}</Text>
                                </View><View>
                            <Text style={styles.msg_time_left}>
                              {this.isStar(message) ? ' ⭐ ' : ' '}
                              {this.getTimeByTimestamp(message.timestamp)}
                            </Text>
                            </View></View>}
                        </View>
                        <View style={{ position: 'absolute', marginTop: '9%', alignSelf: 'flex-end' }}>
                          {select && <CheckBox
                            size={18}
                            borderColor={'white'}
                            backgroundColor={'#06C0F9'}
                            iconCOlor={'white'} checked={message.isSelect}
                            onValueChange={() => this.onChange(message, index)}
                          />}
                        </View>
                        {message && message.reaction && <TouchableOpacity onPress={() => { this.removeReaction(message) }} ><Text style={styles.msg_left_reaction}>{message.reaction}</Text></TouchableOpacity>}
                      </TouchableOpacity>}
                  </>)}
              </View>
            );
          })}
          <View>
            {this.state.isOponentTyping && <Text style={styles.typing}>{this.props.client.username}  typing...</Text>}
          </View>
        </ScrollView>
        {this.replyMessage ?
          <View style={styles.firstMessage_view}>
            <View style={styles.firstMessage}>
              <ScrollView style={styles.scroll_view}>
                <Text style={styles.message_color}>{this.firstMessage}</Text>
              </ScrollView>
            </View>
            <View style={styles.cross_mark}><Text style={styles.message_color} onPress={() => { this.cancelReply() }}>X</Text></View>
          </View> : null}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => { this.onShowEmoji() }}>
        <Text style={styles.emoji_add}><Icons size={28} color="#D8D4D4" name="emoji-emotions" /></Text>
          </TouchableOpacity>
          <TextInput
            style={styles.message_input}
            placeholder="Type a Message"
            placeholderTextColor="white"
            multiline={true}
            value={this.state.chatMessage}
            onChangeText={(msg) => { this.handleText(msg) }}
            onFocus={() => { this.setState({ showEmoji: false }) }}
            // onSubmitEditing={() => this.send(this.state.replyMessageIndex)}
          />
          <TouchableOpacity onPress={() => this.send(this.state.replyMessageIndex)} style={styles.send_btn}>
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
    right: 15,
    top: 23,
    position: 'absolute',
},
  selectHeader: {
    display: "flex",
    width: screenWidth,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: "row",
    backgroundColor: "#373a3f",
    paddingHorizontal: 10,
    paddingVertical: 28
  },
  selecToBack: {
    marginRight: '2%',
  },
  checkBox_left: {
    marginLeft: '1%',
  },
  checkBox_right: {
    marginRight: '1%',
  },
  selectOptions: {
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
    maxWidth:'80%',
    color: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: '#437f60',
    padding: '2%',
    marginTop: '5%',
    marginBottom: '1%',
    marginRight: '2%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 0,
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
    marginTop: 5,
    marginBottom: '3%',
    justifyContent: 'flex-start',
  },
  msg_time_right: {
    color: 'white',
    alignSelf: 'flex-end',
    fontSize: 12
  },
  msg_time_left: {
    color: 'white',
    paddingTop:15,
    alignSelf: 'flex-end',
    fontSize: 12
  },
  emojiContainer: {
    height: '45%',
    width: '100%',
    backgroundColor: '#BFC2C6',
  },
  msg_left: {
    maxWidth:'80%',
    color: '#ffffff',
    alignSelf: 'flex-start',
    backgroundColor: '#1a1a1a',
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
    marginLeft: '2%',
    marginTop: 8,
    justifyContent: 'flex-end',
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
  firstMessage_view: {
    backgroundColor: '#1a1a1a',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 4,
    marginLeft: 20,
    borderRadius: 20,
    marginRight: 20,
    width: screenWidth,
  },
  firstMessage: {
    marginLeft: 10,
    width: '85%',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
  },
  scroll_view:{
    height:30
  },
  cross_mark: {
    width: '15%',
    left: '15%',
  },
  message_color: {
    color: 'white',
  },
  right_username: {
    color: '#ff99ff',
    fontWeight: "bold",
    paddingLeft: 7,
  },
  left_username: {
    color: '#184e34',
    fontWeight: "bold",
    paddingLeft: 7,
  },
  right_replyMessage_view: {
    backgroundColor: '#184e34',
    color: '#ffffff',
    borderRadius: 7,
    borderLeftWidth: 3,
    borderLeftColor: '#ff99ff',
    paddingRight: 10,

  },
  left_replyMessage_view: {
    backgroundColor: '#202124',
    color: '#ffffff',
    borderRadius: 7,
    borderLeftWidth: 3,
    borderLeftColor: '#184e34',
    paddingBottom: 2,
  },
  left_message: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    // width: screenWidth,
    justifyContent: 'flex-end',
  },
  right_message: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    // width: screenWidth,
    justifyContent: 'flex-start',
  },
  replyMessage_left_right: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth:'100%',
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
  }
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