import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import axios from 'axios';
import ForwardIcon from '../../../assests/forward.png';

const styles = StyleSheet.create({
  dark: {
    backgroundColor: '#202124',
    height: '100%',
  },
  header: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#383a3f',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    marginLeft: 15,
  },
  bodyContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  bodyHeader: {
    color: 'white',
    fontSize: 12,
    marginLeft: 15,
  },
  bodyHeaderContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#383a3f',
    paddingHorizontal: 10,
    borderRadius: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  bodyProfile: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingLeft: 10,
    borderRadius: 20,
    marginLeft: '5%',
  },
  bodyText: {
    color: 'white',
    fontSize: 18,
    marginLeft: '10%',
  },
  forwardButton: {
    top: '90%',
    right: 10,
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  back_arrow: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    height: 30,
    width: 30,
    marginBottom: 27,
  },
  forwardIcon: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

class ForwardMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecentChatSelected: null,
      recentChatData: null,
      isContactSelected: null,
      contactData: null,
    };
  }
  componentDidMount() {
    this.socket = io('https://ptchatindia.herokuapp.com/', {
      transports: ['websocket'],
    });
    this.getConversations();
    this.getContacts();
  }

  async getConversations() {
    await axios
      .request({
        method: 'POST',
        url: `https://ptchatindia.herokuapp.com/conversations`,
        headers: {
          authorization: this.props.user.token,
        },
        data: {
          username: this.props.user.username,
          is_archive: 0,
        },
      })
      .then(async res => {
        if (res.status === 200) {
          try {
            if (res.data.data && res.data.data.length) {
              let details = [],
                select = [],
                usernames = [];
              res.data.data.map(user => {
                if (user.username !== this.props.user.username) {
                  Object.assign(user, {popUp: false});
                  details.push(user);
                  select.push(false);
                }
              });
              this.setState({
                recentChatData: details,
                usernames: usernames,
                isRecentChatSelected: select,
              });
            } else {
              this.setState({isEmpty: true});
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
  }

  async getContacts() {
    await axios
      .request({
        method: 'POST',
        url: `https://ptchatindia.herokuapp.com/contacts`,
        headers: {
          authorization: this.props.user.token,
        },
      })
      .then(async res => {
        if (res.status === 200) {
          try {
            let index = null,
              select = [],
              userDetails = [],
              details = [];
            this.state.recentChatData.map(user => {
              details.push(user.client.username);
            });
            res.data.map((user, index) => {
              if (user.username === this.props.user.username) {
                details.push(user.username);
                this.setState({user: user});
                index = index;
              } else {
                if (!details.includes(user.username)) {
                  userDetails.push(user);
                  select.push(false);
                }
              }
            });
            this.setState({
              contactData: userDetails,
              isContactSelected: select,
            });
          } catch (error) {
            console.log(error);
          }
        }
      });
  }

  socket = null;
  recentChatForwardMessageToClient = (user, index) => {
    this.socket.emit('chat', {
      username: this.props.user.username,
      client2: this.state.recentChatData[index].client.username,
      message: user.message,
    });
  };
  contactForwardMessageToClient = (user, index) => {
    this.socket.emit('joinRoom', {
      username: this.props.user.username,
      client2: this.state.contactData[index].username,
    });
    this.socket.emit('chat', {
      username: this.props.user.username,
      client2: this.state.contactData[index].username,
      message: user.message,
    });
    this.props.navigation.navigate('chatScreen');
  };

  recentChatCheckUser = index => {
    let selectUser = this.state.isRecentChatSelected;
    selectUser[index] = !selectUser[index];
    this.setState({isRecentChatSelected: selectUser});
  };

  contactCheckUser = index => {
    let selectUser = this.state.isContactSelected;
    selectUser[index] = !selectUser[index];
    this.setState({isContactSelected: selectUser});
  };
  forwardMessages = () => {
    for (
      let index = 0;
      index < this.state.isRecentChatSelected.length;
      index++
    ) {
      if (this.state.isRecentChatSelected[index] === true) {
        this.recentChatForwardMessageToClient(
          this.props.route.params.message,
          index,
        );
      }
    }
    for (let index = 0; index < this.state.isContactSelected.length; index++) {
      if (this.state.isContactSelected[index] === true) {
        this.contactForwardMessageToClient(
          this.props.route.params.message,
          index,
        );
      }
    }
    this.props.navigation.navigate('chatRoom');
  };

  render() {
    return (
      <View style={styles.dark}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <Text style={styles.back_arrow}>&#8592;</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Forward To...</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyHeader}>Recent Chats</Text>
          <ScrollView style={styles.scrollViewContainer}>
            {this.state.recentChatData &&
              !!this.state.recentChatData.length &&
              this.state.recentChatData.map((user, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.bodyHeaderContainer} onPress={()=>{this.recentChatCheckUser(index);}} >
                    <CheckBox
                      value={this.state.isRecentChatSelected[index]}
                      style={styles.isRecentChatSelected}
                      onValueChange={() => {
                        this.recentChatCheckUser(index);
                      }}
                    />
                    <Image
                      style={styles.bodyProfile}
                      source={{uri: user.client.profile}}
                    />
                    <Text style={styles.bodyText}>{user.client.username}</Text>
                  </TouchableOpacity>
                );
              })}
            <Text style={styles.bodyHeader}>Select Contacts</Text>
            {this.state.contactData &&
              !!this.state.contactData.length &&
              this.state.contactData.map((user, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.bodyHeaderContainer} onPress={()=>{this.contactCheckUser(index);}}>
                    <CheckBox
                      value={this.state.isContactSelected[index]}
                      onValueChange={() => {
                        this.contactCheckUser(index);
                      }}
                    />
                    <Image
                      style={styles.bodyProfile}
                      source={{uri: user.profile}}
                    />
                    <Text style={styles.bodyText}>{user.username}</Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.forwardMessages();
          }}
          style={styles.forwardButton}>
          <Image style={styles.forwardIcon} source={ForwardIcon} />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.userDetails,
  client: state.user.client,
  socket: state.socket,
});
export default connect(mapStateToProps, null)(ForwardMessage);
