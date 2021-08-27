import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView,TouchableOpacity} from 'react-native';
import axios from "axios";
import { connect } from "react-redux";
import { createClient } from '../../actions/actions';

const styles = StyleSheet.create({
    dark: {
        backgroundColor: '#202124',
        height: "100%",
    },
    header: {
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: "#202124"
    },
    headerProfile: {
        width: 40,
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 60 / 2

    },
    headerSingleProfile: {
        width: 40,
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        paddingLeft: 10,
        borderRadius: 40 / 2
    },
    headerTitle: {
        width: 300,
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignSelf: "flex-start",
        marginLeft: 20
    },
    headerText: {
        color: "white",
    },
    body: {
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: "#383a3f",
        borderRadius: 15,
        marginTop: 10
    },
    headerMenu: {
        width: 40,
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
    },
    bodyProfile: {
        width: 40,
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center"
    },
    bodyTitle: {
        width: 300,
        height: 60,
        display: "flex",
        alignSelf: "flex-start",
        marginLeft: 20,
        paddingTop: 18
    },
    bodyText: {
        color: "white",
    },
    profile_container: {
        paddingLeft: 10,
        paddingTop: 8
    },
    NoContacts: {
        color: 'white',
        alignSelf: 'center',
        paddingTop: 300
    }
})

class Contacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: null,
            user: null
        };
    }
    componentDidMount() {
        this.getContacts();
    }
    getContacts = () => {
        axios
            .request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/contacts`,
                headers: {
                    authorization: this.props.user.token,
                },
            })
            .then((res) => {
                console.log("response", res);
                let index = null,
                    details = [];
                res.data.map((user, index) => {
                    if (user.username === this.props.user.username) {
                        this.setState({ user: user });
                        index = index;
                    } else {
                        details.push(user);
                    }
                });
                this.setState({ Data: details });
            });
    };

    onContactClick = (user) => {
        this.props.createClient(user);
        this.props.navigation.navigate('chatRoom', {
            client2: user
        })
    }
    render() {
        return (
            <View style={styles.dark}>
                <View style={styles.header}>
                    <View style={styles.profile_container}>
                        <Image style={styles.headerProfile} source={{ uri: this.props.user.profile }} />
                    </View>
                    <View style={styles.headerTitle}>
                        <Text style={styles.headerText}>Contacts</Text>
                    </View>
                    <View style={styles.headerMenu}>
                        <Image source={{}} />
                        <Text style={{ color: "white" }}>...</Text>
                    </View>
                </View>
                <ScrollView style={{ height: 100 }}>
                    {this.state.user && this.state.user.length && <Text style={styles.NoContacts}>No Conversations Found</Text>}
                    {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
                        return (
                            <View key={index}>
                                <View style={styles.body}>
                                    <TouchableOpacity style={styles.bottomContact} onPress={() => { this.onContactClick(user) }}>
                                        <View style={styles.profile_container}>
                                            <Image style={styles.headerSingleProfile} source={{ uri: user.profile }} />
                                        </View>
                                        <View style={styles.bodyTitle}>
                                            <Text style={styles.bodyText}>{user.username}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
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
export default connect(mapStateToProps, mapDispatchToProps)(Contacts);