import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import axios from "axios";
import { connect } from "react-redux";
import { createClient } from '../../actions/actions';
import { Dimensions } from 'react-native';

const { screenHeight, screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
    dark: {
        backgroundColor: '#202124',
        height: "100%",
    },
    header: {
        display: "flex",
        width: screenWidth,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: "row",
        backgroundColor: "#373a3f",
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    headerProfile: {
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 25
    },
    headerText: {
        color: "white",
        fontSize: 22,
        marginLeft: 15
    },
    headerMenu: {
        textAlign: 'right',
        color: 'white',
        alignSelf: 'center',
        fontSize: 24,
        right: 10,
        position: 'absolute'
    },
    scrollViewContainer: {
        height: screenHeight,
        width: screenWidth,
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    body: {
        display: "flex",
        width: screenWidth,
        height: 60,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: "row",
        backgroundColor: "#383a3f",
        borderRadius: 15,
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    bodyProfile: {
        width: 40,
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        paddingLeft: 10,
        borderRadius: 20
    },
    bodyText: {
        color: "white",
        fontSize: 18,
        marginLeft: 20
    },
    NoContacts: {
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center'
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
        this.focusListener = this.props.navigation.addListener("focus", () => this.getContacts());
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
        this.props.navigation.navigate('chatRoom');
    }

    render() {
        return (
            <View style={styles.dark}>
                <View style={styles.header}>
                    <Image style={styles.headerProfile} source={{ uri: this.props.user.profile }} />
                    <Text style={styles.headerText}>Contacts</Text>
                    <Text style={styles.headerMenu}>&#8942;</Text>
                </View>
                {this.state.user && this.state.user.length && <Text style={styles.NoContacts}>No Conversations Found</Text>}
                <ScrollView style={styles.scrollViewContainer}>
                    {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
                        return (
                            <TouchableOpacity key={index} style={styles.body} onPress={() => { this.onContactClick(user) }}>
                                <Image style={styles.bodyProfile} source={{ uri: user.profile }} />
                                <Text style={styles.bodyText}>{user.username}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
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
export default connect(mapStateToProps, mapDispatchToProps)(Contacts);