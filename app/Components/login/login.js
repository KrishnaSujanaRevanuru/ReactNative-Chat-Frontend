import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { userLogin } from '../../actions/actions';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView
} from 'react-native';

const styles = StyleSheet.create({
  dark: {
    backgroundColor: '#202124',
    height: "100%",
  },
  heading: {
    color: 'white',
    fontSize: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30
  },
  text: {
    color: '#cac3c3',
    paddingLeft: 30
  },
  container: {
    display: "flex",
    alignSelf: 'center',
    justifyContent: "center",
    backgroundColor: "#383a3f",
    fontFamily: 'sans-serif',
    height: 300,
    color: 'white',
    padding: 60,
    borderRadius: 30,
    marginTop: 100,
    height: 350
  },
  input: {
    alignSelf: 'center',
    borderWidth: 2,
    backgroundColor: 'white',
    padding: 0,
    width: 150
  },
  field: {
    margin: 20,
    justifyContent: 'space-between'
  },
  button: {
    alignSelf: "center"
  },
  error: {
    color: 'red'
  },
  registertext: {
    paddingLeft: 70,
    paddingTop: 10,
    color: 'white'
  }
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValidUserName: false,
      isValidPassword: false,
      userDetails: {},
      validationCheck: false,
      username: "",
      password: "",
      failedLogin: false,
      isLoading: false
    };
  }
  validationForm = (val, check) => {
    if (check === 'user') {
      if (!val) {
        this.state.isValidUserName = true;
      } else {
        this.state.userDetails.name = val;
        this.state.isValidUserName = false;
      }
    }
    if (check === 'password') {
      if (!val) {
        this.state.isValidPassword = true;
      } else {
        this.state.userDetails.password = val;
        this.state.isValidPassword = false;
      }
    }
    this.state.validationCheck = true;
    this.setState({});
  };
  onRegisterClick = () => {
    this.props.navigation.navigate('registration');
  }
  LoginForm = () => {
    if (this.state.validationCheck) {
      console.log(this.state.userDetails);
      console.log("logged in");
      axios
        .post("https://ptchatindia.herokuapp.com/login", {
          username: this.state.userDetails.name,
          password: this.state.userDetails.password,
        })
        .then((res) => {
          console.log(res.data);
          if (res.status === 200) {
            this.props.userLogin(res.data.data);
            this.props.navigation.navigate('chatscreen');
          } else {
            this.setState({ failedLogin: !this.failedLogin });
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ failedLogin: !this.failedLogin });
        });
    }
    else {
      this.setState({ isValidUserName: true, isValidPassword: true });
    }
  };
  render() {
    return (
      <ScrollView style={styles.dark}>
        <View style={styles.container}>
          <View>
            <Text style={styles.heading}>Login Form</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.text}>User Name</Text>
            <TextInput style={styles.input}
              placeholder="Enter Username"
              onChangeText={text =>
                this.validationForm(text, 'user')
              }
            />
            {this.state.isValidUserName ? (
              <Text style={styles.error}>Please Enter valid User Name</Text>
            ) : null}
          </View>
          <View style={styles.field}>
            <Text style={styles.text}>Password</Text>
            <TextInput style={styles.input}
              placeholder="Enter Password"
              secureTextEntry={true}
              onChangeText={text =>
                this.validationForm(text, 'password')
              }
            />
            {this.state.isValidPassword ? (
              <Text style={styles.error}>Please Enter valid password</Text>
            ) : null}
          </View>
          <Text style={styles.button}>
            <Button
              title="Login"
              onPress={() => {
                this.LoginForm();
              }}
            />
          </Text>
          <Text style={styles.registertext} onPress={() => { this.onRegisterClick() }}>Register</Text>
        </View>
      </ScrollView>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  userLogin: (username) => dispatch(userLogin(username)),
});

export default connect(null, mapDispatchToProps)(Login);