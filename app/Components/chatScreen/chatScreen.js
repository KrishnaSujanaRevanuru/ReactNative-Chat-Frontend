import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Pressable,TouchableOpacity } from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import ContactIcon from '../../../assests/chatting.png';
import MenuButton from '../../../assests/horizontalDots.png';

const styles = StyleSheet.create({
  dark: {
    backgroundColor: '#202124',
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#202124',
    paddingTop: 10
  },
  headerProfile: {
    width: 60,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 60 / 2,
    alignSelf: 'center',
  },
  headerTitle: {
    width: 260,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  headerText: {
    color: '#e2e2e3',
  },
  headerMenu: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#e2e2e3',
    alignSelf: 'center',
    borderRadius: 20,
    padding: 10
  },
  menu: {
    width: 20,
    height: 20,
  },
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#383a3f',
    borderRadius: 50,
    marginBottom: 20,
    paddingLeft: 5,
    marginTop: 10
  },
  containerBody: {
    padding: 10,
  },
  bodyProfile: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: 10
  },
  bodyTitle: {
    width: 150,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  bodyText: {
    color: '#e2e2e3',
    display:'flex',
    justifyContent:'center',
    alignSelf:'flex-start',
    marginTop:10
  },
  NoConversation: {
    color: 'white',
    alignSelf: 'center',
    paddingTop: 300
  },
  timeBody:{
    width:150,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  time:{
    color: '#e2e2e3',
  },
  bottomContact: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    backgroundColor: 'white',
    top: 580,
    paddingTop: 15,
    position: 'absolute',
    alignSelf: 'flex-end',

  },
  BottomProfile: {
    width: 50,
    height: 50,
    left: 10,
    alignItems: 'center',
  }
});

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: null,
      isEmpty: false,
    };
  }
  componentDidMount() {
    this.getContacts();
  }
  getContacts = () => {
    axios
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
      .then(res => {
        if (res.status === 200) {
          if (res.data.data && res.data.data.length) {
            let details = [];
            res.data.data.map(user => {
              if (user.username !== this.props.user.username) {
                details.push(user);
              }
            });
            this.setState({ Data: details });
          }
          else {
            this.setState({ isEmpty: true });
          }
        }
      });
  };
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
  render() {
    return (
      <View style={styles.dark}>
        <View style={styles.header}>
          <View>
            <Image
              style={styles.headerProfile}
              source={{ uri: this.props.user.profile, }} />
          </View>
          <View style={styles.headerTitle}>
            <Text style={styles.headerText}>Conversations</Text>
          </View>
          <View style={styles.headerMenu}>
          <Image style={styles.menu} source={MenuButton} />
          </View>
        </View>
        <View>
          {this.state.isEmpty && <Text style={styles.NoConversation}>No Conversations Found</Text>}
          {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
            return (
              <TouchableOpacity key={index} style={styles.body}>
                  <View style={styles.containerBody}>
                    <Image
                      style={styles.bodyProfile}
                      source={{
                        uri: user.client.profile,
                      }}
                    />
                  </View>
                  <View style={styles.bodyTitle}>
                    <Text style={styles.bodyText}>{user.client.username}</Text>
                    <Text style={styles.bodyText}>{user.latest.message}</Text>
                  </View>
                  <View style={styles.timeBody}>
                    <Text style={styles.time}>{this.getTimeByTimestamp(user.latest.timestamp)}{' ' + this.getDurationByTimestamp(user.latest.timestamp)}</Text>
                  </View>
                </TouchableOpacity>
            );
          })}
        </View>
        <Pressable style={styles.bottomContact} onPress={() => { this.onContactClick() }}>
            <Image
              style={styles.BottomProfile}
              source={ContactIcon} />
        </Pressable>
      </View>
    );
  }
}


const mapStateToProps = (state) => (
  console.log("state home page from redux in mapstatetoprops", state),
  {
    user: state.user.userDetails,
    client: state.user.client
  }
);


const mapDispatchToProps = (dispatch) => ({
  createClient: (data) => dispatch(createClient(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);