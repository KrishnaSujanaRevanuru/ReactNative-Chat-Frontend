import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import PushNotification from "react-native-push-notification";
import { connect } from 'react-redux';
import { createClient } from '../../actions/actions';
import { Dimensions } from 'react-native';
import Iconpin from 'react-native-vector-icons/Octicons';
import Options from '../headerOptions/options'
import { pin_conversation } from '../../actions/actions';
import OptionPop from './optionsPop';
import { logOut } from '../../actions/actions';
import { NavigationActions } from 'react-navigation';
import Loader from '../Loader/loader';
import CrossIcon from 'react-native-vector-icons/Entypo'
import Icon from 'react-native-vector-icons/MaterialIcons';

const { screenHeight, screenWidth } = Dimensions.get('window');


const styles = StyleSheet.create({
  dark: {
    backgroundColor: '#202124',
    height: '100%',
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
  headerSearch: {
    display: 'flex',
    flexDirection: 'row',
    top: '22%',

  },
  headerInput: {
    color: 'white',
    fontSize: 17,
    padding: 0.5,
    fontWeight: 'bold',
    marginLeft: 10,
    width: '80%',
    height: 50,
  },
  headerSearchIcon: {
    textAlign: 'right',
    alignSelf: 'center',
    fontSize: 20,
    right: 40,
    position: 'absolute'
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
  scrollViewContainer: {
    height: screenHeight,
    width: screenWidth,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  body: {
    display: "flex",
    width: screenWidth,
    height: 70,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: "row",
    backgroundColor: "#383a3f",
    borderRadius: 35,
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  bodyProfile: {
    width: 50,
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    paddingLeft: 10,
    borderRadius: 25
  },
  bodyTextClient: {
    color: "white",
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 8
  },
  bodyTextMessage: {
    color: "white",
    fontSize: 16,
    marginLeft: 20
  },
  notFound: {
    color: 'white',
    fontSize: 15,
    top: '10%',
    alignSelf: 'center',
  },
  timeContainer: {
    right: 60,
    position: 'absolute'
  },
  time: {
    color: '#e2e2e3',
  },
  NoConversation: {
    color: 'white',
    alignSelf: 'center',
    paddingTop: 300
  },
  bottomContact: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#A4C3DF',
    top: '91%',
    paddingTop: 15,
    bottom: 0,
    right: 0,
    position: 'absolute',
    marginHorizontal: 10,
    marginVertical: -5
  },
  BottomProfile: {
    right: 0,
    position: 'absolute'
  },
  archive: {
    top: 10,
    right: 10,
    position: 'absolute'
  },
  archiveicon: {
    height: 50,
    width: 50
  },
  archiveContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  archiveBottomIcon: {
    width: 30,
    height: 30,
    marginTop: 10
  },
  textArchive: {
    color: 'white',
    fontSize: 16,
    top: "0.6%",
    marginLeft: 10,
    marginTop: 10
  },
  bodyText: {
    color: '#e2e2e3',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 10
  },
  pinIcon: {
    position: 'absolute',
    alignSelf: 'center',
    top: 30,
    right: 20,

  },
  popUp: {
    position: 'absolute',
    alignSelf: 'center',
    right: 40,
  },
  popUp1: {
    position: 'absolute',
    alignSelf: 'center',
    right: 20,
  },
  messageOptions: {
    fontSize: 22,
    color: 'white',
    right: 20,
    position: 'absolute'
  },
});

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: null,
      isEmpty: false,
      isSearch: false,
      searchValue: '',
      searchData: [],
      chooseOption: false,
      headerOptions: true,
      pin: false,
      showloader: false
    };
  }
  socket = null;
  componentDidMount() {
    this.setState({ showloader: true })
    this.getConversations();
    this.focusListener = this.props.navigation.addListener("focus", () => this.getConversations());
    this.socket = io('https://ptchatindia.herokuapp.com/', {
      transports: ['websocket'],
    });
    this.socket.emit("notifications", { username: this.props.user.username });
    this.socket.on("notification", this.onNotification);
  }

  onNotification = (data) => {
    PushNotification.localNotification({
      channelId: "test-channel",
      title: data.username + "  send a message",
      message: "Message:" + data.message,
      color: "blue", // (optional) default: none
    })
  }

  getConversations = () => {
    axios
      .request({
        method: "POST",
        url: `https://ptchatindia.herokuapp.com/conversations`,
        headers: {
          authorization: this.props.user.token,
        },
        data: {
          username: this.props.user.username,
          is_archive: 0
        },
      })
      .then(res => {
        if (res.status === 200) {
          if (res.data.data && res.data.data.length) {
            let details = [], usernames = [];
            res.data.data.map(user => {
              if (user.username !== this.props.user.username) {
                Object.assign(user, { popUp: false })
                let found = 0;
                let pin_data = this.props.pin_data;
                if (pin_data.length === 0) details.push(user);
                else {
                  for (let i = 0; i < pin_data.length; i++) {
                    if (user.id === pin_data[i].id)
                      found = 1
                  }
                  if (found === 0) {
                    details.push(user);
                    found = 0
                  }
                  else {
                    found = 0
                    details.unshift(user);
                  }

                }
              }
            });
            this.setState({ Data: details, usernames: usernames, isEmpty: false, showloader: false });
          }
          else {
            this.setState({ isEmpty: true, showloader: false });
          }
        }
      })
  };

  onArcheive = (id) => {
    axios
      .request({
        method: "POST",
        url: 'https://ptchatindia.herokuapp.com/archive',
        headers: {
          authorization: this.props.user.token
        },
        data: {
          username: this.props.user.username,
          roomIds: [id]
        }
      }).then((res) => {
        this.setState({}, () => this.getConversations());
      }).catch((error) => console.log(error))
  }

  ToArchivedMsgs = () => {
    this.props.navigation.navigate('archive');
  }
  onContactClick = () => {
    this.props.navigation.navigate('contacts');
  }
  getTimeByTimestamp = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let ampm = date.getHours() >= 12 ? 'pm' : 'am';
    let hours = date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
    return hours + ":" + date.getMinutes() + ampm;
  }

  getDurationByTimestamp = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let days = (new Date() - new Date(date.getFullYear(), date.getMonth(), date.getDate())) / (1000 * 60 * 60 * 24);
    days = Math.floor(days);
    let weeks = Math.floor(days / 7);
    let months = Math.floor(days / 30);
    let years = Math.floor(days / 365);
    if (days === 0) return 'Today';
    else if (days === 1) return 'Yesterday';
    else if (days < 8) return (days + ' days' + ' ago');
    else if (weeks === 1) return (weeks + ' week' + ' ago');
    else if (weeks < 6) return (weeks + ' weeks' + ' ago');
    else if (months === 1) return (months + ' month' + ' ago');
    else if (months < 13) return (months + ' months' + ' ago');
    else if (years === 1) return (years + ' year' + ' ago')
    else return (years + ' years' + ' ago');
  }
  searchConversations = (data) => {
    let searchData = [];
    let conversationData = this.state.Data;
    if (conversationData && data.length > 0) {
      searchData = conversationData.filter((result) => {
        return result.client.username.toLowerCase().includes(data.toLowerCase())
      })
    }
    this.setState({ searchData: searchData });
  }

  searchVisible = () => {
    this.setState({
      searchValue: '',
      searchData: [],
      isSearch: this.state.isSearch ? false : true,
    });
  }

  onConversationClick = (user) => {
    this.props.createClient(user);
    this.props.navigation.navigate('chatRoom');
  }
  selectOptions = () => {
    if (this.state.headerOptions === true) {
      this.setState({ headerOptions: false, });
    }
    else if (this.state.headerOptions === false) {
      this.setState({ headerOptions: true, });
    }
  }
  messagePopUp = (user) => {
    let data = this.state.Data
    for (let i = 0; i < data.length; i++) {
      if (data[i].id !== user.id)
        data[i].popUp = false
      else data[i].popUp = data[i].popUp ? false : true;
    }
    this.setState({ Data: data });

  }
  showProfile = () => {
    this.setState({ viewOptions: false })
    this.props.navigation.navigate('profile');
  }
  logout = () => {
    this.props.logOut()
    this.props.navigation.navigate('authenticateApp');
  }
  pinContact = (obj) => {
    let pin_data = this.props.pin_data;
    let contacts = this.state.Data
    if (pin_data.length < 3) {
      pin_data.push(obj)
      let temp = [], index = 0;
      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].id === obj.id)
          temp = contacts.splice(i, 1);
      }
      contacts.unshift(temp[0])
      this.props.pin_conversation(pin_data);
      this.setState({ Data: contacts, chooseOption: true, });
    }
    else {
      this.setState({ Data: contacts, chooseOption: true, pin: true });
    }
  }
  unPinContact = (obj) => {
    let pin_data = this.props.pin_data;
    let contacts = this.state.Data;
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].id === obj.id)
        contacts.splice(i, 1);
    }
    for (let i = 0; i < pin_data.length; i++) {
      if (pin_data[i].id === obj.id)
        pin_data.splice(i, 1);
    }
    contacts.push(obj);
    this.props.pin_conversation(pin_data);
    this.setState({ Data: contacts, chooseOption: true });
  }
  isPin = (obj) => {
    let pin_data = this.props.pin_data;
    let found = -1
    for (let i = 0; i < pin_data.length; i++) {
      if (pin_data[i].id === obj.id)
        found = 1;
    }
    if (found === -1) return false;
    else return true;
  }
  setPopUpCallBack = () => {
    let data = this.state.Data
    for (let i = 0; i < data.length; i++) {
      data[i].popUp = false;
    }
    this.setState({ Data: data });
  }

  render() {
    return (
      <View style={styles.dark}>
        {this.state.showloader ? <Loader /> :
          <>
            <View >
              {!this.state.isSearch ?
                <View style={styles.header}>
                  <Image style={styles.headerProfile} source={{ uri: this.props.user.profile, }} />
                  <Text style={styles.headerText}>Conversations</Text>
                  <Text style={styles.headerSearchIcon} onPress={this.searchVisible}><Icon size={28} color="white" name="search" /></Text>
                  <Text style={styles.headerMenu} >&#8942;</Text>
                </View>
                : <View style={styles.header}>
                  <Text onPress={this.searchVisible}> <Icon size={22} color="white" name="arrow-back-ios" /></Text>
                  <TextInput
                    autoFocus
                    placeholder="Search Here..."
                    placeholderTextColor='white'
                    style={styles.headerInput}
                    value={this.state.searchValue}
                    onChangeText={data => { this.setState({ searchValue: data }); this.searchConversations(data); }}
                  />
                  {this.state.searchValue.length !== 0 && <Text onPress={() => { this.setState({ searchValue: '' }) }}> <CrossIcon size={25} color="white" name="cross" /></Text>}
                </View>

              }
            </View>
            {this.state.isEmpty && <Text style={styles.NoConversation}>No Conversations Found</Text>}
            <ScrollView style={styles.scrollViewContainer}>
              {this.state.searchValue.length === 0 ?
                <View>
                  {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
                    return (
                      <View key={index}>
                        {user.client && user.latest &&
                          <View>
                            <View >
                              <TouchableOpacity style={styles.body} onPress={() => { this.onConversationClick(user.client) }}>
                                <Image style={styles.bodyProfile} source={{ uri: user.client.profile, }} />
                                <View>
                                  <Text style={styles.bodyTextClient}>{user.client.username}</Text>
                                  <Text style={styles.bodyTextMessage}>{user.latest.message}</Text>
                                </View>
                                <View style={styles.timeContainer}>
                                  {this.getDurationByTimestamp(user.latest.timestamp) === 'Today' && <Text style={styles.time}>{this.getTimeByTimestamp(user.latest.timestamp)}</Text>}
                                  {this.getDurationByTimestamp(user.latest.timestamp) !== 'Today' && <Text style={styles.time}>{this.getDurationByTimestamp(user.latest.timestamp)}</Text>}
                                </View>
                              </TouchableOpacity>
                              <Text style={styles.messageOptions} onPress={() => this.messagePopUp(user)}>&#8942; </Text>
                              <Text style={styles.pinIcon}>{this.isPin(user) ? <Text><Iconpin size={22} color="white" name="pin" /></Text> : null}</Text>
                              <View style={styles.popUp}>{user.popUp ? <OptionPop archive={this.onArcheive} pinCallBack={this.pinContact} callBack={this.setPopUpCallBack} unPinCallBack={this.unPinContact} obj={user} /> : null}</View>
                            </View>
                          </View>
                        }
                      </View>
                    );
                  })}
                  {this.state.pin ? <View>
                    <Text style={{ color: "white" }}>we can't pin more than 3 conversations</Text>
                    <Text style={{ color: "white" }} onPress={() => { this.setState({ pin: false }) }}>X</Text>
                  </View> : null}
                </View>
                : null}
              {this.state.searchData.length !== 0 ?
                this.state.searchData.map((user, index) => {
                  return (
                    <View key={index}>
                      {user.client && user.latest &&
                        <View>
                          <View >
                            <TouchableOpacity style={styles.body} onPress={() => { this.onConversationClick(user.client) }}>
                              <Image style={styles.bodyProfile} source={{ uri: user.client.profile, }} />
                              <View>
                                <Text style={styles.bodyTextClient}>{user.client.username}</Text>
                                <Text style={styles.bodyTextMessage}>{user.latest.message}</Text>
                              </View>
                              <View style={styles.timeContainer}>
                                {this.getDurationByTimestamp(user.latest.timestamp) === 'Today' && <Text style={styles.time}>{this.getTimeByTimestamp(user.latest.timestamp)}</Text>}
                                {this.getDurationByTimestamp(user.latest.timestamp) !== 'Today' && <Text style={styles.time}>{this.getDurationByTimestamp(user.latest.timestamp)}</Text>}
                              </View>
                            </TouchableOpacity>
                            <Text style={styles.messageOptions} onPress={() => this.messagePopUp(user)}>&#8942; </Text>
                            <Text style={styles.pinIcon}>{this.isPin(user) ? <Text><Iconpin size={22} color="white" name="pin" /></Text> : null}</Text>
                            <View style={styles.popUp}>{user.popUp ? <OptionPop archive={this.onArcheive} pinCallBack={this.pinContact} callBack={this.setPopUpCallBack} unPinCallBack={this.unPinContact} obj={user} /> : null}</View>
                          </View>
                        </View>
                      }
                    </View>
                  )
                }) :
                (this.state.searchData.length === 0 && this.state.searchValue.length !== 0) ?
                  <Text style={styles.notFound}>Not Found</Text> : null}
            </ScrollView>
            <TouchableOpacity style={styles.bottomContact} onPress={() => { this.onContactClick() }}>
              <Text style={styles.BottomProfile}><Icon size={50} color="black" name="add-circle" /></Text>
            </TouchableOpacity>
          </>
        }
      </View>
    );
  }
}


const mapStateToProps = (state) => (
  {
    user: state.user.userDetails,
    client: state.user.client,
    pin_data: state.user.pin_data
  }
);


const mapDispatchToProps = (dispatch) => ({
  createClient: (data) => dispatch(createClient(data)),
  pin_conversation: (data) => dispatch(pin_conversation(data)),
  logOut: () => dispatch(logOut()),

});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);