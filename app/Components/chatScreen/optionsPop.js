import React, { Component } from 'react';
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
    let obj = this.props.obj;
    let pin_data = this.props.pin_data;
    let found = -1
    for (let i = 0; i < pin_data.length; i++) {
      if (pin_data[i].id === obj.id)
        found = i;
    }
    if (found === -1) return false;
    else return true;
  }
  setPin = (type) => {
    let obj = this.props.obj;
    switch (type) {
      case "pin": this.props.pinCallBack(obj);
        this.props.callBack();
        break;
      case "unpin":
        this.props.unPinCallBack(obj)
        this.props.callBack();
        break;
      default: break;
    }
  }

  render() {
    let obj = this.props.obj
    if (this.props.navcomponent === "chatRoom") {
      return (
        <View style={styles.rightOptions}>
          <Text style={styles.optionsMsgText} onPress={() => { this.setBack() }} >Profile</Text>
          <Text style={styles.optionsMsgText}>Pin Contact</Text>

        </View>
      )

    }
    else {
      return (
        <View style={styles.rightOptionsMenu}>
          <Text onPress={() => { this.props.archive(obj.id) }} style={styles.optionsMsgTextMenu} >Archive</Text>
          <Text style={styles.optionsMsgTextMenu} onPress={() => { this.setPin(this.isPin() ? "unpin" : "pin") }} >{this.isPin() ? "Unpin" : "Pin"}</Text>
        </View>
      )
    }
  }

}
const mapStateToProps = (state) => (
  {
    pin_data: state.user.pin_data
  }
);




export default connect(mapStateToProps, null)(OptionPop);
