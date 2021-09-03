import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    rightOptions: {
        backgroundColor: "#8a8787",
        width: '40%',
        height: '67%',
        alignSelf: 'flex-end',
        borderRadius: 15
    },
    leftOptions: {
        backgroundColor: "#8a8787",
        width: '40%',
        height: '67%',
        alignSelf: 'flex-start',
        borderRadius: 15
    },
    optionsMsgText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        marginLeft: 15
    }
})

class MessagePop extends Component {
    constructor(props) {
        super(props);
    }

    deleteMessage = () => {
        this.props.callBack(this.props.messageDetails);
    }
    render() {
        const optionPosition = this.props.optionsCategorey;
        return (
            <View>
                {optionPosition === 'right message' ?
                    < View style={styles.rightOptions} >
                        <TouchableOpacity><Text style={styles.optionsMsgText}>Reply</Text></TouchableOpacity>
                        <TouchableOpacity><Text style={styles.optionsMsgText}>Forward Message</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.deleteMessage() }}><Text style={styles.optionsMsgText}>Delete Message</Text></TouchableOpacity>
                        <TouchableOpacity><Text style={styles.optionsMsgText}>Star Message</Text></TouchableOpacity>
                    </View > :
                    optionPosition === 'left message' ?
                        < View style={styles.leftOptions} >
                            <TouchableOpacity><Text style={styles.optionsMsgText}>Reply</Text></TouchableOpacity>
                            <TouchableOpacity><Text style={styles.optionsMsgText}>Forward Message</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.deleteMessage() }}><Text style={styles.optionsMsgText}>Delete Message</Text></TouchableOpacity>
                            <TouchableOpacity><Text style={styles.optionsMsgText}>Star Message</Text></TouchableOpacity>
                        </View > : null
                }
            </View>
        );
    }
}

const mapStateToProps = state => (
    {
        user: state.user.userDetails,
        client: state.user.client,
        socket: state.socket,
    }
);

export default connect(mapStateToProps, null)(MessagePop);