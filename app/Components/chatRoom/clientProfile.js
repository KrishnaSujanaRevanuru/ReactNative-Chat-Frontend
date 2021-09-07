import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  details: {
    backgroundColor: "#50535a",
    width: "80%",
    height: "60%",
    marginLeft: "10%",
    borderRadius: 20

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
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 60 / 2,
    alignSelf: 'center',
    backgroundColor: "white"
  },
  headerMenu: {

    backgroundColor: "#50535a",
    width: "40%",
    height: 60,
    left: "50%",
    top: "5%",
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
    color: "white",
    marginTop: 20,
    height: 50
  },
  userprofileimage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 150,
    marginLeft: "22%",
    borderRadius: 150 / 2,
  },
  dark: {
    backgroundColor: '#202124',
    height: 800,
  },
  userprofiledetails: {
    color: 'white',
    marginLeft: 100,
    fontSize: 17,
    flex: 0.5,
    top: 10

  },
  headerMenuText: {
    width: "50%",
    height: 90,
    display: 'flex',
    marginLeft: "33%",
    marginTop: "13%",
    color: "white"
  },
  image: {
    height: "100%",
    marginLeft: "20%",
    flex: 0.5
  },
  back_arrow: {
    padding: 1,
    marginLeft: 1,
    top: 15
  }

})
class ClientProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerOptions: true,
      viewProfileImage: false,
      viewprofilestatus: false,
      viewOptions: false
    };
  }

  selectOptions = () => {
    if (this.state.viewOptions === false) {
      console.log('select options');
      this.setState({ headerOptions: false, viewOptions: true });
    }
    else if (this.state.viewOptions === true) {
      this.optionCount = 0
      this.setState({ headerOptions: true, viewOptions: false });
    }
  }
  showProfile = () => {
    this.props.navigation.navigate('profile');
  }
  viewProfile = () => {
    if (this.state.viewprofilestatus === false) {
      console.log('viewProfile');
      this.setState({ viewProfileImage: true, viewprofilestatus: true });
    }
    else if (this.state.viewprofilestatus === true) {
      this.setState({ viewProfileImage: false, viewprofilestatus: false });
    }
  }
  render() {
    return (
      <View style={styles.dark} >
        <View style={styles.header}>
          <View>
            <Text style={styles.back_arrow} onPress={() => { this.props.navigation.goBack() }}> <Icon size={22} color="white" name="arrow-back" /></Text>
          </View>
          <View style={styles.headerTitle}>
            <Text style={styles.headerText}>PROFILE</Text>
          </View>
        </View>
        <View >
          {this.state.headerOptions ? null : <View style={styles.headerMenu}><Text style={styles.headerMenuText} onPress={() => { this.props.navigation.navigate('authenticateApp'); }}>LOG_OUT</Text></View>}
        </View>
        {this.state.viewProfileImage ?
          // <View style={styles.details}> 
          <TouchableOpacity onPress={() => { this.viewProfile() }}>
            <Image
              style={{ width: "100%", height: "100%" }}
              source={{ uri: this.props.user.profile, }} /></TouchableOpacity>
          // </View>
          :
          <View style={{ position: "absolute", marginTop: "40%", flex: 1 }}>
            <View style={styles.image} >
              <TouchableOpacity onPress={() => { this.viewProfile() }}>
                <Image
                  style={styles.userprofileimage}
                  source={{ uri: this.props.user.profile, }} /></TouchableOpacity>

            </View>
            <View >
              <Text style={styles.userprofiledetails}>NAME:-  {this.props.user.username}</Text>
              <Text style={styles.userprofiledetails}>EMAIL:-  {this.props.user.email}</Text>
              <Text style={styles.userprofiledetails}>MOBILE:- (+91) {this.props.user.mobile}</Text>
            </View>
          </View>
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => (
  {
    user: state.user.client,
  }
);

export default connect(mapStateToProps, null)(ClientProfile);
