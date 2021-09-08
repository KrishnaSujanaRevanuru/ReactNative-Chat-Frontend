import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    rightOptions: {
        backgroundColor: "#8a8787",
        alignItems: 'center',
        borderRadius: 15
    },
    optionsMsgText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2,
        marginBottom: 2
    }
})

class MessagePop extends Component {
    constructor(props) {
        super(props);
    }

    deleteMessage = () => {
        this.props.callBack(this.props.messageDetails,"delete");
    }
    replyMessage=()=>{
        this.props.callBack(this.props.messageDetails,"reply");
    }
    render() {
        const optionPosition = this.props.optionsCategorey;
        return (
            <View>
                {optionPosition === 'mssgPopup' ?
                    < View style={styles.rightOptions} >
                        <TouchableOpacity onPress={() => { this.replyMessage() }}><Text style={styles.optionsMsgText}>Reply</Text></TouchableOpacity>
                        <TouchableOpacity><Text style={styles.optionsMsgText}>Forward Message</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.deleteMessage() }}><Text style={styles.optionsMsgText}>Delete Message</Text></TouchableOpacity>
                        <TouchableOpacity><Text style={styles.optionsMsgText}>Star Message</Text></TouchableOpacity>
                    </View > : null}
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

export default connect(mapStateToProps, null)(MessagePop)