import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,TextInput } from 'react-native';
import axios from "axios";
import { connect } from "react-redux";
import { createClient } from '../../actions/actions';
import { Dimensions } from 'react-native';
import Options from '../headerOptions/options';
import{logOut} from '../../actions/actions'
const { screenHeight, screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
    dark: {
        backgroundColor: '#202124',
        height: "100%",
    },
    header: {
        display: "flex",
        width: screenWidth,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: "row",
        backgroundColor: "#373a3f",
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    headerProfile: {
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 25
    },
    headerText: {
        color: "white",
        fontSize: 22,
        marginLeft: 15
    },
    headerInput: {
        backgroundColor: "#8a8787",
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
        width: 120,
        height: 30,
        textAlign:'center',
        paddingTop:3,
        paddingBottom:2,
        borderRadius: 30,
        right:70,
        position:'absolute',
      },
    headerSearchIcon: {
        alignSelf: 'center',
        right: 40,
        position: 'absolute'
      },
    headerMenu: {
        textAlign: 'right',
        color: 'white',
        alignSelf: 'center',
        fontSize: 24,
        right: 10,
        position: 'absolute'
    },
    scrollViewContainer: {
        height: screenHeight,
        width: screenWidth,
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    body: {
        display: "flex",
        width: screenWidth,
        height: 60,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: "row",
        backgroundColor: "#383a3f",
        borderRadius: 15,
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    bodyProfile: {
        width: 40,
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        paddingLeft: 10,
        borderRadius: 20
    },
    popUp1: {
        position: 'absolute',
        alignSelf: 'center',
        left: "70%",

    },
    bodyText: {
        color: "white",
        fontSize: 18,
        marginLeft: 20
    },
    NoContacts: {
        color: 'white',
        alignSelf:'center'
    }
})

class Contacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: null,
            user: null,
            chooseOption: true,
            headerOptions: true,
            
        };
    }
    componentDidMount() {
        this.getContacts();
        this.props.navigation.addListener("focus", () => this.getContacts());
    }
    getContacts = () => {
        axios
            .request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/contacts`,
                headers: {
                    authorization: this.props.user.token,
                },
            })
            .then((res) => {
                let index = null,
                    details = [];
                res.data.map((user, index) => {
                    if (user.username === this.props.user.username) {
                        this.setState({ user: user });
                        index = index;
                    } else {
                        details.push(user);
                    }
                });
                this.setState({ Data: details });
            });
    };

    onContactClick = (user) => {
        this.props.createClient(user);
        this.props.navigation.navigate('chatRoom');
    }
    filter=[]
    searchValue=''
    search=(contact)=>{
        this.filter=[]
        this.searchValue=contact
        for(let i=0;i<this.state.Data.length;i++){
            if(this.state.Data[i].username.toLowerCase().includes(contact.toLowerCase()) || this.state.Data[i].mobile.includes(contact)){
                this.filter.push({username:this.state.Data[i].username,profile:this.state.Data[i].profile,mobile:this.state.Data[i].mobile,email:this.state.Data[i].email});
            }
        }
    this.setState({});
    }
    selectOptions = () => {
        if (this.state.headerOptions === true) {
          this.setState({ headerOptions: false,});
        }
        else if (this.state.headerOptions=== false) {
          this.setState({ headerOptions: true,});
        }
      }
    showProfile = () => {
        this.setState({ viewOptions: false })
        this.props.navigation.navigate('profile');
    }
    logout = () => {
        this.props.logOut()
        this.props.navigation.navigate('login');
    }
    


    render() {
        return (
            <View style={styles.dark}>
                <View style={styles.header}>
                    <Image style={styles.headerProfile} source={{ uri: this.props.user.profile }} />
                    <Text style={styles.headerText}>Contacts</Text>
                    <TextInput
                        placeholder="Search contact..."
                        placeholderTextColor='white'
                        style={styles.headerInput}
                        onChangeText={(contact)=>{this.search(contact)}}
                    />
                    <Text style={styles.headerSearchIcon} onPress={this.searchVisible}>🔍</Text>
                    <Text style={styles.headerMenu} onPress={() => { this.selectOptions() }}>&#8942;</Text>
                    {this.state.headerOptions ? null : <Text style={styles.popUp1} ><Options showProfile={this.showProfile} logout={this.logout} /></Text>}
                </View>
                {this.state.user && this.state.user.length && <Text style={styles.NoContacts}>No Conversations Found</Text>}
                <ScrollView style={styles.scrollViewContainer}>
                    {this.searchValue.length===0 ?
                    <View>
                    {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
                        return (
                            <TouchableOpacity key={index} style={styles.body} onPress={() => { this.onContactClick(user) }}>
                                <Image style={styles.bodyProfile} source={{ uri: user.profile }} />
                                <Text style={styles.bodyText}>{user.username}</Text>
                            </TouchableOpacity>
                        );
                    })}</View> : null}
                    {this.searchValue.length!==0 ?
                    <View>
                        {this.filter.length!==0 ? 
                            <View>{this.filter.map((user, index) => {
                                    return (
                                        <TouchableOpacity key={index} style={styles.body} onPress={() => { this.onContactClick(user) }}>
                                            <Image style={styles.bodyProfile} source={{ uri: user.profile }} />
                                            <Text style={styles.bodyText}>{user.username}</Text>
                                        </TouchableOpacity>
                                    );
                                })}</View> 
                        : <Text style={styles.NoContacts}>Not Found</Text>}</View> 
                    : null }
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => (
    {
        user: state.user.userDetails,
        client: state.user.client
    }
);
const mapDispatchToProps = (dispatch) => ({
    createClient: (data) => dispatch(createClient(data)),
    logOut:()=> dispatch(logOut()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Contacts);