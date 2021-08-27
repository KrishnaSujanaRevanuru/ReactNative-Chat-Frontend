import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import ContactIcon from '../../../assests/chatting.png'
import { createClient } from '../../actions/actions'
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
    color: 'white',
  },
  headerMenu: {
    width: 40,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
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
    width: 300,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  bodyText: {
    color: 'white',
  },
  NoConversation: {
    color: 'white',
    alignSelf: 'center',
    paddingTop: 300
  },
  bottomContact: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    backgroundColor: 'white',
    top: 680,
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

  open = (user) => {
    this.props.createClient(user);
    console.log(user);
    this.props.navigation.navigate('chatroom');
  }

  onContactClick = () => {
    this.props.navigation.navigate('contacts');
  }
  render() {
    return (
      <View style={styles.dark}>
        <View>
          {this.state.isEmpty && <Text style={styles.NoConversation}>No Conversations Found</Text>}
          {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
            return (
              <TouchableOpacity key={index} style={styles.body} onPress={() => { this.open(user.client) }}>
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