import React, { Component } from 'react';
import { Text, View,StyleSheet } from 'react-native';

const styles=StyleSheet.create({
    options:{
        backgroundColor:"white"
    }
})

class MessagePop extends Component {
    render() {
        return (
            <View style={styles.options}>
                <Text>reply message</Text>
                <Text>forward message</Text>
                <Text>delete message</Text>
                <Text>archive message</Text>
            </View>
        );
    }
}

export default MessagePop;