import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { starMsgs } from '../../actions/actions';

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

    setStarMsgs = (type) => {
        let messageObj = this.props.messageDetails;
        let starMsgsArray = this.props.starMsgsArray;
        let found = -1;
        switch (type) {
            case 'star':
                found = -1;
                if (starMsgsArray.length === 0) starMsgsArray.push(messageObj);
                else {
                    for (let i = 0; i < starMsgsArray.length; i++) {
                        if (starMsgsArray[i].id === messageObj.id)
                            found = i;
                    }
                    if (found === -1) starMsgsArray.push(messageObj);
                }
                break;
            case 'unStar':
                found = -1;
                for (let i = 0; i < starMsgsArray.length; i++) {
                    if (starMsgsArray[i].id === messageObj.id)
                        found = i;
                }
                starMsgsArray.splice(found, 1);
                break;
        }
        this.props.starMsgs(starMsgsArray);
        this.props.callBack(this.props.messageDetails,"star");
    }

    isStar = () => {
        let messageObj = this.props.messageDetails;
        let starMsgsArray = this.props.starMsgsArray;
        let found = -1;
        if (starMsgsArray.length === 0) return false;
        else {
            for (let i = 0; i < starMsgsArray.length; i++) {
                if (starMsgsArray[i].id === messageObj.id) found = i;
            }
            if (found >= 0) return true;
            else return false;
        }
    }

    deleteMessage = () => {
        this.props.callBack(this.props.messageDetails,"delete");
    }
    replyMessage=()=>{
        this.props.callBack(this.props.messageDetails,"reply");
    }

    forward(){
        console.log(this.props.messageDetails);
        this.props.callBack(this.props.messageDetails,"forward");
    }

    render() {
        const optionPosition = this.props.optionsCategorey;
        return (
            <View>
                {optionPosition === 'mssgPopup' ?
                    < View style={styles.rightOptions} >
                        <TouchableOpacity onPress={() => { this.replyMessage() }}><Text style={styles.optionsMsgText}>Reply</Text></TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.forward()}}><Text style={styles.optionsMsgText}>Forward Message</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.deleteMessage() }}><Text style={styles.optionsMsgText}>Delete Message</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setStarMsgs(this.isStar() ? "unStar" : "star")}><Text style={styles.optionsMsgText}>{this.isStar() ? 'Unstar Message' : 'Star Message'}</Text></TouchableOpacity>
                    </View > : null}
            </View>
        );
    }
}

const mapStateToProps = state => (
    {
        user: state.user.userDetails,
        client: state.user.client,
        starMsgsArray : state.user.starMsgs,
        socket: state.socket,
    }
);

const mapDispatchToProps = (dispatch) => ({
    starMsgs: (data) => dispatch(starMsgs(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MessagePop)