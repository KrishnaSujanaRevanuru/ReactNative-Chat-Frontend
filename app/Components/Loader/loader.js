import React, { Component } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';

export default class Loader extends Component {
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color='#8F09E3' />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#202124'
    }
});
