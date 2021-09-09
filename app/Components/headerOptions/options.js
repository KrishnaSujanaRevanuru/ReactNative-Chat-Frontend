import React, { Component } from 'react';
// import  Profile from'./profile';
// import ChatScreen from '../chatScreen/chatScreen'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const styles = StyleSheet.create({

    rightOptions: {
        backgroundColor: "#8a8787",
        alignItems: 'center',
        borderRadius: 10,
        width: 118,
        marginTop: 8,
        height: 70,
        left: 90,
    },
    optionsMsgText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 6,
        marginBottom: 2
    }

})
class Options extends Component {
    constructor() {
        super();
        this.state = {
            showprofile: false,
        }
    }
    showPofile = () => {
        this.setState({ showprofile: true });

    }
    render() {
        return (
            <View style={styles.rightOptions}>
                <Text onPress={() => { this.props.showProfile() }} style={styles.optionsMsgText}>Profile</Text>
                <Text style={styles.optionsMsgText} onPress={() => { this.props.logout() }}>Logout</Text>
            </View>
        )
    }
}
export default Options;