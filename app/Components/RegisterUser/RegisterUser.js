import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button,  ScrollView} from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import { submitRegister } from '../../actions/actions';
class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: "", email: "", number: "", password: "", confirm_password: "" }
    }
    error = {}
    password = ''
    Validate = (type, Value) => {
        if (type === "text") {
            this.setState({ username: Value })
            if (Value.length < 4) {
                this.error.username = true;
            }
            else {
                this.error.username = false
            }
        }
        if (type === "email-address") {
            this.setState({ email: Value })
            if (!Value.match('^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]')) {
                this.error.email = true
            }
            else {
                this.error.email = false
            }
        }
        if (type === "numeric") {
            this.setState({ number: Value })
            if (Value.length !== 10) {
                this.error.number = true
            }
            else {
                this.error.number = false
            }
        }
        if (type === "password") {
            this.setState({ password: Value })
            if (!Value.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')) {
                this.error.password = true
            }
            else {
                this.password = Value;
                this.error.password = false
            }
        }
        if (type === "password") {
            this.setState({ confirm_password: Value })
            if (this.password !== Value) {
                this.error.confirm_password = true
            }
            else {
                this.error.confirm_password = false
                this.confirm_password = Value;
            }
        }
        this.setState({});
    }
    Data = {}
    Submit = () => {
        if (this.state.username === "" || this.state.email === "" || this.state.number === "" || this.state.password === "", this.state.confirm_password === "") {
            alert("not submitted");
        }
        else {
            console.log("submitted");
            let details = {
                username: this.state.username,
                email: this.state.email,
                mobile: this.state.number,
                password: this.state.password
            };
            axios.post("https://ptchatindia.herokuapp.com/register", details)
                .then(res => {
                    console.log(res.status)
                    if (res.status === 200) {
                        this.props.submitRegister(res.data.data)
                        this.props.navigation.navigate('chatscreen');
                    }
                }).catch(error => console.log(error));
        }
    }
    render() {
        const InputData = [
            { Field: "Username", type: "default", placeholder: "Enter Username", error: ["enter valid username", "", "", "", ""] },
            { Field: "Email", type: "email-address", placeholder: "Enter Email", error: ["", "enter valid email", "", "", ""] },
            { Field: "Number", type: "numeric", placeholder: "Enter number", error: ["", "", "enter valid password", "", ""] },
            { Field: "Password", type: "password", placeholder: "Enter password", error: ["", "", "", "enter strong password", ""] },
            { Field: "Confirm Password", type: "password", placeholder: "Re-enter password", error: ["", "", "", "", "password and confirm password should match"] }
        ]
        const { photo } = this.state;
        return (
            <ScrollView style={styles.bg_color}>
                <View style={styles.container}>
                    <TouchableOpacity>
                        <View>
                            <Text style={styles.heading}>REGISTER</Text>
                            {InputData.map((input, index) =>
                                <View style={styles.padding1} key={index}>
                                    <Text style={styles.text}>{input.Field}</Text>
                                    <TextInput keyboardType={input.type} placeholder={input.placeholder} style={styles.input} maxLength={input.Field === 'Number' ? 10 : null} secureTextEntry={input.type === 'password' ? true : false} onChangeText={(value) => { this.Validate(input.type, value) }}></TextInput>
                                    {this.error.username ? <Text style={styles.error}>{input.error[0]}</Text> : null}
                                    {this.error.email ? <Text style={styles.error}>{input.error[1]}</Text> : null}
                                    {this.error.number ? <Text style={styles.error}>{input.error[2]}</Text> : null}
                                    {this.error.password ? <Text style={styles.error}>{input.error[3]}</Text> : null}
                                    {this.error.confirm_password ? <Text style={styles.error}>{input.error[4]}</Text> : null}
                                </View>
                            )}
                            <Button title="SUBMIT" color='purple' style={styles.button} onPress={() => this.Submit()} />
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
        height: 500
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
    }
});
const mapStateToProps = (state) => (console.log("console in msp", state), {
    details: state,
});

const mapDispatchToProps = (dispatch) => ({
    submitRegister: (details) => dispatch(submitRegister(details)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Registration);