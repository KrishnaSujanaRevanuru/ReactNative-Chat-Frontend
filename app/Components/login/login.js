import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import { userLogin } from '../../actions/actions';
import PushNotification from "react-native-push-notification";
import Loader from '../Loader/loader';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginError: "",
      username: "",
      password: "",
      showLoading: false
    }
  }
  password = ''
  error = { username: '', password: '' }

  componentDidMount = () => {
    this.createChannels();
  }

  createChannels = () => {
    PushNotification.createChannel({
      channelId: "test-channel",
      channelName: "Test Channel"
    })
  }

  Validate = (Field, Value) => {
    if (Field === "Username") {
      this.setState({ username: Value })
      if (Value.length < 4) {
        this.error.username = true;
      }
      else {
        this.error.username = false;
      }
    }
    if (Field === "Password") {
      this.setState({ password: Value })
      if (!Value.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')) {
        this.error.password = true;
      }
      else {
        this.password = Value;
        this.error.password = false;
      }
    }
    this.setState({ loginError: "" });
  }

  onRegisterClick = () => {
    this.setState({ loginError: '' })
    this.props.navigation.navigate('registration');
  }

  Login = () => {
    this.setState({ showLoading: true })
    if (this.state.username === "" || this.state.password === "") {
      this.setState({ loginError: "some fields are empty", showLoading: false })
    }
    else if (this.error.username !== false || this.error.password !== false) {
      this.setState({ loginError: "enter valid details", showLoading: false })
    }
    else {
      axios.post("https://ptchatindia.herokuapp.com/login", {
        username: this.state.username,
        password: this.state.password
      })
        .then(res => {
          if (res.status === 200) {
            this.props.userLogin(res.data.data)
            this.props.navigation.navigate('appScreen');
            this.setState({ showLoading: false })
          }
        }).catch(error => {
          if (error.response.status === 400) {
            console.log(error.response.status)
            this.setState({ loginError: "Please enter valid credentials", showLoading: false });
          }
        }
        );
    }
  };

  render() {
    const InputData = [
      { Field: "Username", type: "default", placeholder: "Enter Username", usernameError: "enter valid username" },
      { Field: "Password", type: "default", placeholder: "Enter password", passwordError: "enter strong password" },
    ]
    return (
      <ScrollView contentContainerStyle={styles.bg_color}>
        {this.state.L ? <Loader /> :
          <View style={styles.container}>
            <Text style={styles.mainError}>{this.state.loginError}</Text>
            <Text style={styles.heading}>Login</Text>
            <View style={styles.sub_container}>
              {InputData.map((input, index) =>
              (
                <View style={styles.padding1} key={index}>
                  <Text style={styles.text}>{input.Field}</Text>
                  <TextInput keyboardType={input.type} placeholder={input.placeholder} style={styles.input} secureTextEntry={(input.Field === 'Password') ? true : false} onChangeText={(value) => { this.Validate(input.Field, value) }}></TextInput>
                  {this.error.username ? <Text style={styles.error}>{input.usernameError}</Text> : null}
                  {this.error.password ? <Text style={styles.error}>{input.passwordError}</Text> : null}
                </View>
              )
              )}
              <View style={styles.loginButton}><Button title="Login" color='purple' onPress={() => this.Login()} /></View>
              <Text style={styles.RegisterText} onPress={() => { this.onRegisterClick() }}>Register</Text>
            </View>
          </View>
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  bg_color: {
    backgroundColor: '#202124',
    paddingVertical: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  container: {
    display: "flex",
    alignSelf: 'center',
    justifyContent: "center",
    backgroundColor: "#383a3f",
    fontFamily: 'sans-serif',
    color: 'white',
    width: '80%',
    borderRadius: 30,
    paddingTop: 15,
    paddingBottom: 25,
  },
  mainError: {
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  heading: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 10,
  },
  sub_container: {
    width: '70%',
    paddingVertical: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  padding1: {
    paddingBottom: 15,
  },
  text: {
    color: '#cac3c3',
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 5,
    paddingHorizontal: 2,
    paddingVertical: 0,
  },
  error: {
    color: 'red',
    position: 'absolute',
    marginTop: '23%',
    fontWeight: 'bold',
  },
  field: {
    margin: 20,
    justifyContent: 'space-between'
  },
  loginButton: {
    marginTop: 20
  },
  RegisterText: {
    marginTop: 10,
    color: 'white',
    alignSelf: 'center',
  },
});


const mapDispatchToProps = (dispatch) => ({
  userLogin: (username) => dispatch(userLogin(username)),
});

export default connect(null, mapDispatchToProps)(Login);
