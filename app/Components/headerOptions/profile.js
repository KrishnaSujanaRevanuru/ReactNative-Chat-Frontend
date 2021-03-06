import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
    details: {
        backgroundColor: "#50535a",
        width: "80%",
        height: "60%",
        marginLeft: "10%",
        borderRadius: 20
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#202124',
        paddingTop: 10
      },
      headerProfile: {
        width: 40,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        borderRadius: 60 / 2,
        alignSelf: 'center',
        backgroundColor: "white"
      },
      headerMenu: {
       color:'white',
       position: 'absolute',
       right: 0,
       fontSize:20,
       marginTop: "6.3%",
       marginRight: "2%",
      },
    
      headerTitle: {
        width: 260,
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        marginLeft: 20,
      },
      headerText: {
        color: "white",
        top: '5%',
        fontSize: 18,
        height: 50
      },
      userprofileimage: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 150,
        marginLeft: "22%",
        borderRadius: 150 / 2,
      },
      dark: {
        backgroundColor: '#202124',
        height: 800,
      },
      userprofiledetails: {
        color: 'white',
        marginLeft: 100,
        fontSize: 17,
        flex: 0.5,
        top: 10
    
      },
     
      image: {
        height: "100%",
        marginLeft: "20%",
        flex: 0.5
      },
      back_arrow: {
        padding: 1,
        marginLeft: '2%',
        top: '4%',
      }

})
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerOptions: true,
            viewProfileImage: false,
            viewprofilestatus: false,
            viewOptions: false
        };
    }
    componentDidMount() {
        this.props.navigation.addListener("blur",()=>this.setState({
            headerOptions: true,
            viewProfileImage: false,
            viewprofilestatus: false,
            viewOptions: false
        }) );
    }
    selectOptions = () => {
        if (this.state.viewOptions === false) {
            this.setState({ headerOptions: false, viewOptions: true });
        }
        else if (this.state.viewOptions === true) {
            this.optionCount = 0
            this.setState({ headerOptions: true, viewOptions: false });
        }
    }
    showProfile = () => {
        this.props.navigation.navigate('profile');
    }
    logout = () => {
        this.props.navigation.navigate('login');
    }
    viewProfile = () => {
        if (this.state.viewprofilestatus === false) {
            this.setState({ viewProfileImage: true, viewprofilestatus: true });
        }
        else if (this.state.viewprofilestatus === true) {
            this.setState({ viewProfileImage: false, viewprofilestatus: false });
        }
    }
    render() {
        return (
            <View style={styles.dark} >
                <View style={styles.header}>
                    <Text style={styles.back_arrow} onPress={() => { this.props.navigation.goBack() }} > <Icon size={29} color="white" name="arrow-back-ios" /></Text>
                    <Text style={styles.headerText}>PROFILE</Text>
                    <Text onPress={() => { this.selectOptions() }} style={styles.headerMenu}>&#8942;</Text>
                </View>
                {this.state.headerOptions ? null : <View style={styles.rightOptions}><Text onPress={() => { this.props.navigation.navigate('authenticateApp'); }}>LOG_OUT</Text></View>}
                {this.state.viewProfileImage ?
                    <TouchableOpacity onPress={() => { this.viewProfile() }}>
                        <Image
                            style={{ width: "100%", height: "100%" }}
                            source={{ uri: this.props.user.profile, }} />
                    </TouchableOpacity>
                    :
                    <View style={{ position: "absolute", marginTop: "40%", flex: 1 }}>
                        <View style={styles.image} >
                            <TouchableOpacity onPress={() => { this.viewProfile() }}>
                                <Image
                                    style={styles.userprofileimage}
                                    source={{ uri: this.props.user.profile }} /></TouchableOpacity>
                        </View>
                        <View >
                            <Text style={styles.userprofiledetails}>NAME:-  {this.props.user.username}</Text>
                            <Text style={styles.userprofiledetails}>EMAIL:-  {this.props.user.email}</Text>
                            <Text style={styles.userprofiledetails}>MOBILE:- (+91) {this.props.user.mobile}</Text>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => (
    {
        user: state.user.userDetails,
    }
);

export default connect(mapStateToProps, null)(Profile);