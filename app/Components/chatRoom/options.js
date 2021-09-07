import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    rightOptions: {
        backgroundColor: "#8a8787",
        borderRadius: 10,
        width: "100%",
        alignSelf: 'center',
    },
    optionsMsgText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 6,
        marginBottom: 2
    }
})
class Options extends Component {
    constructor() {
        super();
        this.state = {
            showprofile: false
        }
    }
    setBack = () => {
        this.props.callBack();
        this.props.showProfile()
    }
    render() {
        return (
            <View style={styles.rightOptions}>
                <Text style={styles.optionsMsgText} onPress={() => { this.setBack() }} >Profile</Text>
                <Text style={styles.optionsMsgText}>AddTOArchive</Text>
            </View>
        )
    }
}
export default Options;

