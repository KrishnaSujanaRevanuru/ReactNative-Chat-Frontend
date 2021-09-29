import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Image, Keyboard } from 'react-native';
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

  setDetails = (Field, Value) => {
    switch (Field) {
      case 'Username':
        this.setState({ username: Value, loginError: '' })
        break;
      case 'Password':
        this.setState({ password: Value, loginError: '' })
        break;
      default:
        break;
    }
  }

  Validate = (Field) => {
    const { username, password } = this.state;
    switch (Field) {
      case 'Username':
        if (username.length < 4) {
          this.error.username = true;
        }
        else {
          this.error.username = false;
        }
        break;
      case 'Password':
        if (!password.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')) {
          this.error.password = true;
        }
        else {
          this.error.password = false;
        }
        break;
      default:
        break;
    }
    this.setState({ loginError: "" });
  }

  onRegisterClick = () => {
    this.setState({ loginError: '', username: '', password: '', })
    this.error.username = ''
    this.error.password = ''
    this.props.navigation.navigate('registration');
  }

  Login = () => {
    if (this.error.username === false && this.error.password === false) {
      axios.post("https://ptchatindia.herokuapp.com/login", {
        username: this.state.username,
        password: this.state.password
      })
        .then(res => {
          if (res.status === 200) {
            this.setState({ showLoading: true })
            this.props.userLogin(res.data.data)
            this.props.navigation.navigate('appScreen');
            this.setState({ showLoading: false })
          }
        }).catch(error => {
          if (error.response.status === 400) {
            console.log(error.response.status)
            this.setState({ loginError: "Oops! We could not find matching credentials" });
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
        {this.state.showLoading ? <Loader /> :
          <View style={styles.container}>
            <Text style={styles.heading}>Login</Text>
            <View style={styles.sub_container}>
              {InputData.map((input, index) =>
              (
                <View style={styles.padding1} key={index}>
                  <Text style={styles.text}>{input.Field}</Text>
                  <TextInput keyboardType={input.type}
                    placeholder={input.placeholder}
                    style={styles.input}
                    secureTextEntry={(input.Field === 'Password') ? true : false}
                    onChangeText={(value) => { this.setDetails(input.Field, value) }}
                    onBlur={() => { this.Validate(input.Field) }}
                  >
                  </TextInput>
                  {this.error.username ? <Text style={styles.error}>{input.usernameError}</Text> : null}
                  {this.error.password ? <Text style={styles.error}>{input.passwordError}</Text> : null}
                </View>
              )
              )}
              <View style={styles.loginButton}><Button title="Login" color='purple' onPress={() => {Keyboard.dismiss() ;this.Login()}} /></View>
              <Text style={styles.mainError}>{this.state.loginError}</Text>
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
    fontSize: 16,
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
    marginTop: 10
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