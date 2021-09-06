import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import { submitRegister } from '../../actions/actions';
import { launchImageLibrary } from 'react-native-image-picker';

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = { RegisterError: "", username: "", email: "", number: "", password: "", confirm_password: "", imageError: "", profilePic: null, picSelected: false }
    }
    error = {}
    password = ''
    Validate = (Field, Value) => {
        if (Field === "Username") {
            this.setState({ username: Value })
            if (Value.length < 4) {
                this.error.username = true;
            }
            else {
                this.error.username = false
            }
        }
        if (Field === "Email") {
            this.setState({ email: Value })
            if (!Value.match('^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]')) {
                this.error.email = true
            }
            else {
                this.error.email = false
            }
        }
        if (Field === "Number") {
            this.setState({ number: Value })
            if (Value.length !== 10) {
                this.error.number = true
            }
            else {
                this.error.number = false
            }
        }
        if (Field === "Password") {
            this.setState({ password: Value })
            if (!Value.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')) {
                this.error.password = true
            }
            else {
                this.password = Value;
                this.error.password = false
            }
        }
        if (Field === "Confirm Password") {
            this.setState({ confirm_password: Value })
            if (this.password !== Value) {
                this.error.confirm_password = true
            }
            else {
                this.error.confirm_password = false
                this.confirm_password = Value;
            }
        }
        this.setState({RegisterError:""});
    }
    Data = {}
    Submit = () => {
        if (this.state.username === "" || this.state.email === "" || this.state.number === "" || this.state.password === "", this.state.confirm_password === "") {
            alert("not submitted");
        }
        else {
            let userDetails = {
                username: this.state.username,
                email: this.state.email,
                mobile: this.state.number,
                password: this.state.password
            };
            axios.post("https://ptchatindia.herokuapp.com/register", userDetails)
                .then(res => {
                    if (res.status === 200) {
                        this.props.submitRegister(res.data.data)
                        this.props.navigation.navigate('appScreen');
                    }
                }).catch(error => {
                    if(error.response.status===400){
                    console.log(error.response.status)
                    this.setState({RegisterError:"user already exists"});
                    }
                }
            );
        }
    }

    onLoginClick = () => {
        this.props.navigation.navigate('login');
    }

    pickImage = () => {
        const Options = {
            maxWidth: 40,
            maxHeight: 40
        }
        launchImageLibrary(Options, (response) => {
            let errors = "";
            if (response.didCancel) {
                errors = "";
            }
            else if (response.assets && response.assets[0].uri.type !== "image/jpeg") {
                if (response.assets && response.assets[0].fileSize > 3072) {
                    errors = "selected image size more than 3MB";
                    this.setState({ imageError: errors });
                }
                else {
                    this.setState({ profilePic: response && response.assets[0].uri, imageError: "", picSelected: true });
                }
            }
            else {
                errors = "selected was not jpeg format";
                this.setState({ imageError: errors });
            }

        })
    }
    render() {
        const InputData = [
            { Field: "Username", type: "default", placeholder: "Enter Username", usernameError:"enter valid username"},
            { Field: "Email", type: "email-address", placeholder: "Enter Email", emailError:"enter valid email"},
            { Field: "Number", type: "numeric", placeholder: "Enter number", numberError:"enter valid password"},
            { Field: "Password", type: "default", placeholder: "Enter password", passwordError:"enter strong password"},
            { Field: "Confirm Password", type: "default", placeholder: "Re-enter password", cPasswordError:"check password and re-enter"}
        ]
        const { photo } = this.state;
        return (
            <ScrollView style={styles.bg_color}>
                <View style={styles.container}>
                    <TouchableOpacity>
                        <View>
                            <Text style={styles.mainError}>{this.state.RegisterError}</Text>
                            <Text style={styles.heading}>REGISTER</Text>
                            {InputData.map((input, index) =>
                                <View style={styles.padding1} key={index}>
                                    <Text style={styles.text}>{input.Field}</Text>
                                    <TextInput keyboardType={input.type} placeholder={input.placeholder} style={styles.input} maxLength={input.Field === 'Number' ? 10 : null} secureTextEntry={(input.Field === 'Password' || input.Field==='Confirm Password') ? true : false} onChangeText={(value) => { this.Validate(input.Field, value) }}></TextInput>
                                    {this.error.username ? <Text style={styles.error}>{input.usernameError}</Text> : null}
                                    {this.error.email ? <Text style={styles.error}>{input.emailError}</Text> : null}
                                    {this.error.number ? <Text style={styles.error}>{input.numberError}</Text> : null}
                                    {this.error.password ? <Text style={styles.error}>{input.passwordError}</Text> : null}
                                    {this.error.confirm_password ? <Text style={styles.error}>{input.cPasswordError}</Text> : null}
                                </View>
                            )}
                            <Text style={styles.profilePicText} onPress={this.pickImage}>
                                {this.state.picSelected ? <Image source={{ uri: this.state.profilePic && this.state.profilePic }} style={styles.profilePic} />
                                    : <Image source={{ uri: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg' }} style={styles.profilePic} />}
                            </Text>
                            <Text style={styles.image_warning} >{this.state.imageError && this.state.imageError}</Text>
                            <Button title="SUBMIT" color='purple' style={styles.button} onPress={() => this.Submit()} />
                            <Text style={styles.loginText} onPress={() => { this.onLoginClick() }}>Login</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    heading: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 10,

    },
    padding1: {
        paddingBottom: 15,
    },
    text: {
        color: '#cac3c3'
    },
    bg_color: {
        backgroundColor: '#202124',
        height: 780,
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
        marginTop: 120,
        height: 550
    },
    input: {
        alignSelf: 'center',
        borderWidth: 1,
        backgroundColor: 'white',
        padding: 0,
        width: 200,
        borderRadius: 5,

    },
    field: {
        margin: 20,
        justifyContent: 'space-between'
    },
    button: {
        borderRadius: 10,
    },
    error: {
        color: 'red'
    },
    profilePicText: {
        width: 80,
        height: 60,
    },
    profilePic: {
        height: 40,
        width: 40
    },
    image_warning: {
        color: "red"
    },
    loginText: {
        marginTop: 10,
        color: 'white',
        marginLeft: "40%"
    },
    mainError:{
        color:'red',
        textAlign:'center'
     }
});
const mapStateToProps = (state) => ({
    userDetails: state,
});

const mapDispatchToProps = (dispatch) => ({
    submitRegister: (userDetails) => dispatch(submitRegister(userDetails)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Registration);