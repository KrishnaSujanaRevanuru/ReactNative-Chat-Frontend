import React, { Component } from 'react';
import { pin_conversation } from '../../actions/actions';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, } from 'react-native';
const styles = StyleSheet.create({
  rightOptionsMenu: {
    backgroundColor: "#8a8787",
    alignItems: 'center',
    borderRadius: 10,
    width: 70,
    marginTop: 10,
    height: 60,
    left: 1
  },
  optionsMsgTextMenu: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 2
  },
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
class OptionPop extends Component {
  setBack = () => {
    this.props.callBack();
    this.props.showProfile()
  }
  isPin = () => {
    let { obj, pin_data } = this.props;
    let found = -1
    for (let i = 0; i < pin_data.length; i++) {
      if (pin_data[i] === obj)
        found = i;
    }
    if (found === -1) return false;
    else return true;
  }
  setPin = (type) => {
    let { obj, pin_data } = this.props;
    switch (type) {
      case "pin":
        if (pin_data.length < 3)
          pin_data.push(obj)
        break;
      case "unpin":
        for (let i = 0; i < pin_data.length; i++) {
            if(pin_data[i] === obj)
              pin_data.splice(i,1);
        }
        break;
      default: break;
    }
    this.props.pin_conversation(pin_data);
    this.props.callBack();
  }

  render() {
    return (
      <View style={styles.rightOptions}>
        <Text style={styles.optionsMsgText} onPress={() => { this.setBack() }} >Profile</Text>
        <Text style={styles.optionsMsgText} onPress={() => { this.setPin(this.isPin() ? "unpin" : "pin") }}  >{this.isPin() ? "Unpin" : "Pin"}</Text>
      </View>
    )
  }

}
const mapStateToProps = (state) => (
  {
    pin_data: state.user.pin_data
  }
);

const mapDispatchToProps = (dispatch) => ({
  pin_conversation: (data) => dispatch(pin_conversation(data)),
});


export default connect(mapStateToProps, mapDispatchToProps)(OptionPop);
