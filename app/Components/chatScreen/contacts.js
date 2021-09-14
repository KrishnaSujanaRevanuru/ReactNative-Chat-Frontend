import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import axios from "axios";
import { connect } from "react-redux";
import { createClient } from '../../actions/actions';
import { Dimensions } from 'react-native';
import Options from '../headerOptions/options';
import { logOut } from '../../actions/actions';
import Loader from '../Loader/loader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CrossIcon from 'react-native-vector-icons/Entypo';
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
        color: 'white',
        fontSize: 17,
        padding: 0.5,
        fontWeight: 'bold',
        marginLeft: 10,
        width: '80%',
        height: 50,
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
        right: 15,
        top: 23,
        position: 'absolute',
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
        alignSelf: 'center'
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
            showloading: false,
            isSearch: false
        };
    }
    componentDidMount() {
        this.setState({ showloading: true })
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
                this.setState({ Data: details, showloading: false });
            });
    };

    onContactClick = (user) => {
        this.props.createClient(user);
        this.props.navigation.navigate('chatRoom');
    }
    filter = []
    searchValue = ''
    search = (contact) => {
        this.filter = []
        this.searchValue = contact
        for (let i = 0; i < this.state.Data.length; i++) {
            if (this.state.Data[i].username.toLowerCase().includes(contact.toLowerCase()) || this.state.Data[i].mobile.includes(contact)) {
                this.filter.push({ username: this.state.Data[i].username, profile: this.state.Data[i].profile, mobile: this.state.Data[i].mobile, email: this.state.Data[i].email });
            }
        }
        this.setState({});
    }
    selectOptions = () => {
        if (this.state.headerOptions === true) {
            this.setState({ headerOptions: false, });
        }
        else if (this.state.headerOptions === false) {
            this.setState({ headerOptions: true, });
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
    searchVisible = () => {
        this.searchValue = '';
        this.setState({
            searchValue: '',
            searchData: [],
            isSearch: this.state.isSearch ? false : true,
        });
    }
    render() {
        return (
            <View style={styles.dark}>
                {this.state.showloading ? <Loader /> :
                    <>
                        <View >
                            {!this.state.isSearch ?
                                <View style={styles.header}>
                                    <Image style={styles.headerProfile} source={{ uri: this.props.user.profile, }} />
                                    <Text style={styles.headerText}>Contacts</Text>
                                    <Text style={styles.headerSearchIcon} onPress={this.searchVisible}><Icon size={28} color="white" name="search" /></Text>
                                    <Text style={styles.headerMenu} >&#8942;</Text>
                                </View>
                                : <View style={styles.header}>
                                    <Text onPress={this.searchVisible}> <Icon size={22} color="white" name="arrow-back-ios" /></Text>
                                    <TextInput
                                        autoFocus
                                        placeholder="Search Here..."
                                        placeholderTextColor='white'
                                        style={styles.headerInput}
                                        value={this.state.searchValue}
                                        onChangeText={data => { this.setState({ searchValue: data }); this.search(data); }}
                                    />
                                    {this.state.searchValue.length !== 0 && <Text onPress={() => { this.searchValue = '', this.setState({ searchValue: '' }) }}> <CrossIcon size={25} color="white" name="cross" /></Text>}
                                </View>

                            }
                        </View>
                        {this.state.user && this.state.user.length && <Text style={styles.NoContacts}>No Conversations Found</Text>}
                        <ScrollView style={styles.scrollViewContainer}>
                            {this.searchValue.length === 0 ?
                                <View>
                                    {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
                                        return (
                                            <TouchableOpacity key={index} style={styles.body} onPress={() => { this.onContactClick(user) }}>
                                                <Image style={styles.bodyProfile} source={{ uri: user.profile }} />
                                                <Text style={styles.bodyText}>{user.username}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}</View> : null}
                            {this.searchValue.length !== 0 ?
                                <View>
                                    {this.filter.length !== 0 ?
                                        <View>{this.filter.map((user, index) => {
                                            return (
                                                <TouchableOpacity key={index} style={styles.body} onPress={() => { this.onContactClick(user) }}>
                                                    <Image style={styles.bodyProfile} source={{ uri: user.profile }} />
                                                    <Text style={styles.bodyText}>{user.username}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}</View>
                                        : <Text style={styles.NoContacts}>Not Found</Text>}</View>
                                : null}
                        </ScrollView>
                    </>
                }
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
    logOut: () => dispatch(logOut()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Contacts);