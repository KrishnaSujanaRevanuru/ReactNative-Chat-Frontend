import React, { Component } from 'react';
import { View, Text, StyleSheet, Image,TextInput,ScrollView, TouchableOpacity } from 'react-native';
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
      },
      goBack_icon:{
        marginTop:17,
        width: 20,
        height:20,
        marginLeft:8,
    },
    notFound:{
    color:'white',
    alignSelf:'center',
    top:'10%',
    }
})

class Contacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: null,
            user: null,
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
    goToChatscreen=()=>{
        this.props.navigation.navigate('chatscreen');
    }
    render() {
        return (
            
            <View style={styles.dark}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.goToChatscreen}>
                        <Image style={styles.goBack_icon} source={{uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEUAAAD////m5ub29vYjIyOgoKD39/fz8/Ojo6MlJSUfHx+dnZ0bGxspKSkgICB8fHzc3NwXFxe7u7tjY2Nvb29VVVWWlpbCwsI5OTm0tLQPDw+Kiopqamrs7OxMTExBQUGrq6vR0dGGhoZaLh+lAAACWklEQVR4nO3c7VLqMBSF4W5EzwFFQD2i4vf9X+QBZ2SkNvlj0uWsvM8V7DW7TZq0TdcBAAAAAAAAAAAAAAAAAAAAAAAAAACgnLvr5c0/dREVLSfx4X6mrqSOh1UcLNXF1LA4iS/O1eWUd3kUMOJGXVBp017AOFNXVNjFn+jbqmsqat7v4M5KXVRJ0+8d3FFXVdD8bChgzNV1FTMb7GDEVF1YKf1pwu4qnaUCuow03+bBA5PZYpEMaDLjpzsYj+raipgNTxN7t+raikhfoiZLi0wHPQK23MFTdW1FZDroETAzTXgETD6quQS8TKwmbAJO3QeZ4RW9UcDEit4noH8H3UdR+w4ObPx++quurYjMPOgR0L6DmUHGI6B9B9fuHZynO+ix6bROB4zVpJrN9mKkgJl7sLZxboFcB6ubjJHwSRhwlIgbacCI+9oBn8UBI14qJ7xSB6zeRO1duPdUOaE6X1R/Ya6OFyT8Mf/7UD+WXlVOqJ8PnysnlD/TbGoH7Drlg3f9u3BPurYYI6B0ffg6SkDZGv9tux4pYAP7NA3stTWwX7qLSBcN2L97aqKL9u+AG3iP30YX3b+naaKL9t+1NfBtYgOfQDfwCW0DX+o38LcFXfSQ+j3WKGLmMdxleyqzXnQ5NSL974zJP6S5fVST/4AzKw2Xf7kzw426sHJSk4bPqRGpVb/NqRFdA2ebDK/6fUaaDwPz4ru6psIW/S6eqCsqrr/qv1YXVN7xetHlyfvI1zP33G7CT4dzExfqSupxP/sSAAAAAAAAAAAAAAAAAAAAAAAAAADgt/oPPIkcVNWYeXgAAAAASUVORK5CYII='}} />
                    </TouchableOpacity>
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
                <ScrollView>
                {this.state.user && this.state.user.length && <Text style={styles.NoContacts}>No Conversations Found</Text>}
                { this.searchValue.length===0 ?
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
                {this.searchValue.length!==0 ?
                <View>
                { this.filter.length!==0 ? 
                <View>{this.filter.map((user, index) => {
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
                                })}</View> :
                                <Text style={styles.notFound}>Not Found</Text>}
                </View> : null }
                </ScrollView>
            </View>
            
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