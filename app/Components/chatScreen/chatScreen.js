import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import { createClient } from '../../actions/actions';
import ContactIcon from '../../../assests/chatting.png';
import MenuButton from '../../../assests/horizontalDots.png';

const styles = StyleSheet.create({
  dark: {
    backgroundColor: '#202124',
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexDirection: 'row',
    backgroundColor: '#202124',
    paddingTop: 10
  },
  headerProfile: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 60 / 2,
    alignSelf: 'center',
  },
  headerTitle: {
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  headerInput: {
    backgroundColor: "#383a3f",
    color: 'white',
    width: 130,
    height: 32,
    padding: 10,
    fontSize: 13,
    fontWeight: 'bold',
    borderRadius: 15,
  },
  notFound: {
     color: 'white',
     fontSize: 15,
     top: '10%',
     alignSelf: 'center',
  },
  headerSearch: {
    display: 'flex',
    flexDirection: 'row',
    top: '22%',
  },
  headerSearchIcon: {
    fontSize: 18,
    top: '5%',
    right: '15%'
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    left: '10%',
    top: '8%',
  },
  headerMenu: {
    width: 40,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    top: '22%',
    justifyContent: 'center',
    alignSelf: 'center',
    right:'5%'
  },
  menu: {
    width: 20,
    height: 20,
    backgroundColor:'#383a3f',
    borderRadius:20,
    left:'10%'
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
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
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
    color: '#e2e2e3',
    display:'flex',
    justifyContent:'center',
    alignSelf:'flex-start',
    marginTop:10
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
    top: '90%',
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
      isSearch: false,
      searchValue: '',
      searchData: [],
      usernames: [],
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
            let details = [], usernames = [];
            res.data.data.map(user => {
              if (user.username !== this.props.user.username) {
                details.push(user);
                usernames.push(user.client);
              }
            });
            this.setState({ Data: details, usernames: usernames });
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
  searchConversations = (data) => {
    let searchData = [];
    let usernames = this.state.usernames;
    if (data.length > 0) {
      searchData = usernames.filter((result) => {
        return result.username.toLowerCase().includes(data.toLowerCase())
      })
    }
    this.setState({ searchData: searchData });
  }

  searchVisible = () => {
    this.setState({
      searchValue: '',
      searchData: [] ,
      isSearch: this.state.isSearch ? false : true,
    });
  }

  onConversationClick = (user) => {
    this.props.createClient(user);
    this.props.navigation.navigate('chatRoom');
}

  render() {
    return (
      <View style={styles.dark}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Image
              style={styles.headerProfile}
              source={{ uri: this.props.user.profile, }} />
            <Text style={styles.headerText}>Conversations</Text>
          </View>
          <View style={styles.headerSearch}>
            {this.state.isSearch &&
              <TextInput placeholder="Search Here..." placeholderTextColor='white' style={styles.headerInput} value={this.state.searchValue}
               onChangeText={data => { this.setState({ searchValue: data }); this.searchConversations(data); }} />}
          </View>
          <View style={styles.headerMenu}>
            <Text style={styles.headerSearchIcon} onPress={this.searchVisible}>🔍</Text>
            <Image style={styles.menu} source={MenuButton} />
          </View>
        </View>
        <ScrollView>
          {this.state.isEmpty && <Text style={styles.NoConversation}>No Conversations Found</Text>}
          {this.state.searchValue.length === 0 ?
            this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
              return (
                <View key={index} style={styles.body}>
                  <TouchableOpacity onPress={()=>{this.onConversationClick(user)}}>
                  <View style={styles.containerBody} >
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
                </View>
              );
            }) : null}
          {this.state.searchData.length !== 0 ?
            this.state.searchData.map((user, index) => {
              return (
                <View key={index} style={styles.body}>
                  <View style={styles.containerBody}>
                    <Image
                      style={styles.bodyProfile}
                      source={{
                        uri: user.profile,
                      }}
                    />
                  </View>
                  <View style={styles.bodyTitle}>
                    <Text style={styles.bodyText}>{user.username}</Text>
                  </View>
                </View>
              )
            }) : (this.state.searchData.length === 0 && this.state.searchValue.length !== 0) ?
              <Text style={styles.notFound}>Not Found</Text> : null}
        </ScrollView>
        <TouchableOpacity style={styles.bottomContact} onPress={() => { this.onContactClick() }}>
          <Image
            style={styles.BottomProfile}
            source={ContactIcon} />
        </TouchableOpacity>
      </View>
    );
  }
}


const mapStateToProps = (state) => (
  {
    user: state.user.userDetails,
    client: state.user.client
  }
);


const mapDispatchToProps = (dispatch) => ({
  createClient: (data) => dispatch(createClient(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);