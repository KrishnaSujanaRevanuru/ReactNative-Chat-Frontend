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
import readIcon from '../../../assests/seenTick.png';
import SendButton from '../../../assests/send.png';
import deliveredIcon from '../../../assests/deliveredTick.png';
import { Dimensions } from 'react-native';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import { Directions } from 'react-native-gesture-handler';

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
      replyMessageIndex:-1,
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
      data.readStatus=1;
    }
    let messages = this.state.messages;
    Object.assign(data, { messagePopUp: false });
    messages.push(data);
    this.previousDate = null;
    this.setState({ messages: messages });
  };

  onMessages = (data) => {
    if(this.state.messages && data && this.state.messages.length < data.messages.length){
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
    this.setState({messages: data.messages}
      ,()=>{
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
    if(replyMessageIndex===-1){
      if (this.state.chatMessage) {
        this.socket.emit('chat', {
        username: this.props.user.username,
        client2: this.props.client.username,
        message: this.state.chatMessage,
        });
        this.setState({chatMessage: ""});
      }
    }
    else{
     if (this.state.chatMessage) {
        this.socket.emit("reply", {
        username: this.props.user.username,
        client: this.props.client.username,
        messageId: this.state.messages[this.state.replyMessageIndex].id,
        message: this.state.chatMessage
        });
        this.setState({chatMessage: ""});
      }
    }
    this.replyMessage=false
    this.setState({replyMessageIndex:-1,replyMessage:false});
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
  firstMessage=''
  firstMessageSender=''
  replyMessage=''
  setMsgPopToFalse = (msgObj,type) => {
    let messages = this.state.messages;
    for (let i = 0; i < messages.length; i++) messages[i].messagePopUp = false;
    switch(type){
      case 'delete':
        this.setState({ messages: messages }, () => {
          this.socket.emit('delete', { username: this.props.user.username, client: this.props.client.username, messageId: msgObj.id })
          this.socket.once('messages', this.onMessages);
        })
        break;
      case 'reply':
        for(let i=0;i<messages.length;i++){
          if(messages[i].id===msgObj.id){
            this.firstMessage=msgObj.message,
            this.firstMessageSender=msgObj.username
            this.replyMessage=true
            this.setState({replyMessageIndex:i});
          }
        }
        break;
      case "forward": this.forwardMessages(msgObj); break;
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
  forwardMessages = (msgObj) => {
    this.props.navigation.navigate('forward',{message:msgObj});
  }

  cancelReply=()=>{
    this.replyMessage=false
    this.setState({replyMessageIndex:-1});
  }
  render() {
    const { messages } = this.state;
    return (
      <View style={styles.chat_room}>
        <View style={styles.header}>
          <Text style={styles.back_arrow} onPress={()=>{this.props.navigation.goBack()}}>&#8592;</Text>
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
                      <View>
                        <View style={styles.msg_right}>
                        {message.hasOwnProperty('replyId') ? 
                            <View>
                            {messages.map((replyMessage,index)=>{
                              return(
                                <View key={index}>
                                  {message.replyId===replyMessage.id ? 
                                  <View>
                                    <View style={styles.right_replyMessage_view}>
                                      <Text style={styles.right_username}>{replyMessage.username}</Text>
                                      <Text style={styles.message}>{replyMessage.message}</Text>
                                    </View>
                                    <View style={styles.replyMessage_left_right}>
                                      <Text style={styles.right_message}>{message.message}</Text>
                                      <Text style={styles.msg_time_right}>
                                        {this.getTimeByTimestamp(message.timestamp)}
                                        {message.readStatus ? <Image source={readIcon} /> : <Image source={deliveredIcon} />}
                                      </Text>
                                    </View>
                                  </View>:null}
                                </View>
                              )
                            })}
                           </View> : <View style={styles.replyMessage_left_right}>
                             <Text style={styles.right_message}>{message.message}</Text>
                             <Text style={styles.msg_time_right}>
                              {this.getTimeByTimestamp(message.timestamp)}
                              {message.readStatus ? <Image source={readIcon} /> : <Image source={deliveredIcon} />}
                              </Text>
                             </View> }
                             <Text style={styles.messageOptions} onPress={() => this.messagePopUp(message)} >&#8942;</Text>
                          {message && message.reaction && <TouchableOpacity onPress={() => { this.removeReaction(message) }} style={styles.msg_right_reaction}><Text style={{ marginLeft: "3%" }}>{message.reaction}</Text></TouchableOpacity>}
                        </View>
                    <View style={styles.popUp}>{message.messagePopUp ? <MessagePop messageDetails={message} optionsCategorey={"mssgPopup"} callBack={this.setMsgPopToFalse} /> : null}</View>
                      </View>
                    }
                  </>
                ) : (
                  <>
                    {message.is_delete !== 1 &&
                  <View style={styles.msg_field_container}>
                    <View style={styles.msg_left}>
                      <Text style={styles.message} onLongPress={() => { this.handleReaction(message) }}>
                        {message.hasOwnProperty('replyId') ? 
                            <View>
                            {messages.map((replyMessage,index)=>{
                              console.log("messages",messages);
                              return(
                                <View key={index}>
                                  {message.replyId===replyMessage.id ? 
                                  <View>
                                    <View style={styles.left_replyMessage_view}>
                                      <Text style={styles.left_username}>{replyMessage.username}</Text>
                                      <Text style={styles.left_message}>{replyMessage.message}</Text>
                                    </View>
                                    <View style={styles.replyMessage_left_right}>
                                      <Text style={styles.left_message}>{message.message}</Text>
                                      <Text style={styles.msg_time_left}>
                                        {this.getTimeByTimestamp(message.timestamp)}
                                        {message.readStatus ? <Image source={readIcon} /> : <Image source={deliveredIcon} />}
                                      </Text>
                                      <Text style={styles.messageOptions} onPress={() => this.messagePopUp(message)} >&#8942;</Text>
                                    </View>
                                  </View>:null}
                                </View>
                              )
                            })}
                           </View> : <View style={styles.replyMessage_left_right}>
                                      <Text style={styles.left_message}>{message.message}</Text>
                                    </View> }
                        <Text style={styles.msg_time_left}>
                          {this.getTimeByTimestamp(message.timestamp)}
                        </Text>
                        <Text style={styles.messageOptions} onPress={() => this.messagePopUp(message)} >&#8942;</Text>
                      </Text>
                    </View>
                    {message && message.reaction && <TouchableOpacity onPress={() => { this.removeReaction(message) }} ><Text style={styles.msg_left_reaction}>{message.reaction}</Text></TouchableOpacity>}
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
        {this.replyMessage ? 
        <View style={styles.firstMessage_view}>
          <View style={styles.firstMessage}>
            <Text style={styles.message_color}>{this.firstMessage}</Text>
          </View>
          <View style={styles.cross_mark}><Text style={styles.message_color} onPress={()=>{this.cancelReply()}}>X</Text></View>
        </View> : null}
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
    marginLeft:5,
    marginTop:5,
    marginBottom:'3%',
    justifyContent:'flex-start',
  },
  msg_time_right: {
    color: 'white',
    alignSelf: 'flex-end',
    marginLeft:'3%',
    marginTop: '2%',
    fontSize:12
  },
  msg_time_left: {
    color: 'white',
    alignSelf: 'flex-start',
    marginLeft: '3%',
    marginTop: '2%',
    fontSize:10
  },
  emojiContainer: {
    height: '50%',
    width: '100%',
    backgroundColor: '#BFC2C6',
  },
  msg_left: {
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
    fontSize:32,
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
    marginTop:8,
    justifyContent:'flex-end',
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
  back_arrow:{
    color: 'white',
    fontWeight: 'bold',
    fontSize:30,
    height: 30,
    width: 30,
    marginBottom:27
  },
  popUp:{position:'absolute',alignSelf:'center'},
  firstMessage_view:{
    backgroundColor:'#1a1a1a',
    display:'flex',
    flexDirection:'row',
    marginBottom:4,
    marginLeft:20,
    borderRadius:20,
    marginRight:20,
    width:screenWidth,
  },
  firstMessage:{
    marginLeft:10,
    width:'85%',
    justifyContent:'flex-start',
    paddingTop:10,
    paddingBottom:10,
  },
  cross_mark:{
    width:'15%',
    left:'15%',
  },
  message_color:{
    color:'white',
  },
  right_username:{
    color:'#ff99ff',
    fontWeight: "bold",
    paddingLeft:7,
  },
  left_username:{
    color:'#184e34',
    fontWeight: "bold",
    paddingLeft:7,
  },
  right_replyMessage_view:{
    backgroundColor:'#184e34',
    color:'#ffffff',
    borderRadius:7,
    borderLeftWidth:3,
    borderLeftColor:'#ff99ff',
    paddingRight:10,
    
  },
  left_replyMessage_view:{
    backgroundColor:'#202124',
    color:'#ffffff',
    borderRadius:7,
    borderLeftWidth:3,
    borderLeftColor:'#184e34',
    paddingBottom:2,
  },
  left_message:{
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft:5,
    marginRight:5,
    marginTop:5,
    width:screenWidth,
    justifyContent:'flex-end',
  },
  right_message:{
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft:5,
    marginRight:5,
    marginTop:5,
    width:screenWidth,
    justifyContent:'flex-start',
  },
  replyMessage_left_right:{
    display:'flex',
    flexDirection:'row'
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