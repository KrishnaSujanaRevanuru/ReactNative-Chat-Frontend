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

        backgroundColor: "#50535a",
        width: "40%",
        height: 60,
        left: "50%",
        top: "5%",
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
        marginTop: 15,
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
    headerMenuText: {
        width: "50%",
        height: 90,
        display: 'flex',
        marginLeft: "33%",
        marginTop: "13%",
        color: "white"
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
class ClientProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerOptions: true,
            viewProfileImage: false,
            viewprofilestatus: false,
            viewOptions: false,
            clientProfile: {},
        };
    }
    componentDidMount=()=>{
        this.getClientData();
    }
    getClientData=()=>{ 
        let {user,contacts}=this.props;
        let obj={}
        for(let i=0;i<contacts.length; i++){
            if(user.username === contacts[i].username)
            obj=contacts[i];
        }
        this.setState({clientProfile:obj});
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
                    <Text style={styles.back_arrow} onPress={() => { this.props.navigation.goBack() }}> <Icon size={22} color="white" name="arrow-back-ios" /></Text>
                    <Text style={styles.headerText}>PROFILE</Text>
                </View>
                <View >
                    {this.state.headerOptions ? null : <View style={styles.headerMenu}><Text style={styles.headerMenuText} onPress={() => { this.props.navigation.navigate('authenticateApp'); }}>LOG_OUT</Text></View>}
                </View>
                {this.state.viewProfileImage ?
                    <TouchableOpacity onPress={() => { this.viewProfile() }}>
                        <Image
                            style={{ width: "100%", height: "100%" }}
                            source={{ uri: this.state.clientProfile.profile, }} /></TouchableOpacity>
                    :
                    <View style={{ position: "absolute", marginTop: "40%", flex: 1 }}>
                        <View style={styles.image} >
                            <TouchableOpacity onPress={() => { this.viewProfile() }}>
                                <Image
                                    style={styles.userprofileimage}
                                    source={{ uri: this.state.clientProfile.profile, }} /></TouchableOpacity>

                        </View>
                        <View >
                            <Text style={styles.userprofiledetails}>NAME:-  {this.state.clientProfile.username}</Text>
                            <Text style={styles.userprofiledetails}>EMAIL:-  {this.state.clientProfile.email}</Text>
                            <Text style={styles.userprofiledetails}>MOBILE:- (+91) {this.state.clientProfile.mobile}</Text>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => (
    {
        user: state.user.client,
        contacts:state.user.contacts
    }
);

export default connect(mapStateToProps, null)(ClientProfile);
