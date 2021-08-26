import React, { Component } from 'react';
import { View, Text, StyleSheet, Image,TextInput,ScrollView } from 'react-native';
import axios from "axios";
import { connect } from "react-redux";

const styles = StyleSheet.create({
    dark: {
        backgroundColor: '#202124',
        height:'100%'
    },
    header: {
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: "#202124"
    },
    headerProfile: {
        width: 40,
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 60 / 2

    },
    headerSingleProfile: {
        width: 40,
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        paddingLeft: 10,
        borderRadius: 40 / 2
    },
    headerTitle: {
        width: 110,
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignSelf: "flex-start",
        marginLeft: 20
    },
    headerText: {
        color: "white",
    },
    body: {
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: "#383a3f",
        borderRadius: 15,
        marginTop: 10
    },
    headerMenu: {
        width: 40,
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
       paddingBottom:15,
       paddingLeft:10,
    },
    bodyProfile: {
        width: 40,
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center"
    },
    bodyTitle: {
        width: 300,
        height: 60,
        display: "flex",
        alignSelf: "flex-start",
        marginLeft: 20,
        paddingTop: 18
    },
    bodyText: {
        color: "white",
    },
    profile_container: {
        paddingLeft: 10,
        paddingTop: 8
    },
    NoContacts: {
        color: 'white',
        alignSelf: 'center',
        paddingTop: 300
    },
    search_input:{
        marginTop:17,
        backgroundColor: "#383a3f",
        paddingTop:2,
        paddingBottom:3,
        borderRadius:20,
        paddingLeft:10,
        height:20,
        width:150,
        color:'white',
    },
    search_icon:{
          marginTop:17,
          width: 20,
          height:20,
          marginLeft:8,
      }
})

class Contacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: null,
            user: null,
            filter:false,
            start:true,
        };
    }
    componentDidMount() {
        this.getContacts();
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
                console.log("response", res);
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
    filter=[]
    search=(contact)=>{
    this.filter=[]
    for(let i=0;i<this.state.Data.length;i++){
      if(this.state.Data[i].username.toLowerCase().includes(contact.toLowerCase()) || this.state.Data[i].mobile.includes(contact)){
        this.filter.push({username:this.state.Data[i].username,profile:this.state.Data[i].profile,mobile:this.state.Data[i].mobile,email:this.state.Data[i].email});
        }
    }
    this.setState({filter:true,start:false});
    }
    render() {
        return (
            <ScrollView>
            <View style={styles.dark}>
                <View style={styles.header}>
                    <View style={styles.profile_container}>
                        <Image style={styles.headerProfile} source={{ uri: this.props.user.profile }} />
                    </View>
                    <View style={styles.headerTitle}>
                        <Text style={styles.headerText}>Contacts</Text>
                    </View>
                    <View>
                    <TextInput style={styles.search_input} placeholder="search contact" onChangeText={(contact)=>{this.search(contact)}}></TextInput>
                    </View>
                    <View>
                    <Image style={styles.search_icon} source={{uri:'https://img.icons8.com/material-rounded/50/ffffff/search.png'}}/>
                    </View>

                    <View style={styles.headerMenu}>
                        <Image source={{}} />
                        <Text style={{ color: "white" }}>...</Text>
                    </View>
                </View>
                {this.state.user && this.state.user.length && <Text style={styles.NoContacts}>No Conversations Found</Text>}
                { this.state.start ?
                <View>
                {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
                    return (
                        <View key={index}>
                            <View style={styles.body}>
                                <View style={styles.profile_container}>
                                    <Image style={styles.headerSingleProfile} source={{ uri: user.profile }} />
                                </View>
                                <View style={styles.bodyTitle}>
                                    <Text style={styles.bodyText}>{user.username}</Text>
                                </View>
                            </View>
                        </View>
                    );
                })}</View> : null }
                {this.state.filter ?
                <View>
                {this.filter.map((user, index) => {
                                    return (
                                        <View key={index}>
                                            <View style={styles.body}>
                                                <View style={styles.profile_container}>
                                                    <Image style={styles.headerSingleProfile} source={{ uri: user.profile }} />
                                                </View>
                                                <View style={styles.bodyTitle}>
                                                    <Text style={styles.bodyText}>{user.username}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                </View> : null }
            </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => (
    console.log("state home page from redux in mapstatetoprops", state),
    {
        user: state.user.userDetails,
        client: state.user.client
    }
);
const mapDispatchToProps = (dispatch) => ({
    createClient: (data) => dispatch(createClient(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(Contacts);