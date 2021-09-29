import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import { createClient } from '../../actions/actions';
import { Dimensions } from 'react-native';
import Options from '../headerOptions/options';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { logOut } from '../../actions/actions';
import Loader from '../Loader/loader';
import CrossIcon from 'react-native-vector-icons/Entypo'

const { screenHeight, screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
    dark: {
        backgroundColor: '#202124',
        height: '100%',
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
    headerSearch: {
        display: 'flex',
        flexDirection: 'row',
        top: '22%',
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
        textAlign: 'right',
        alignSelf: 'center',
        fontSize: 20,
        right: 20,
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
    popUp1: {
        position: 'absolute',
        alignSelf: 'center',
        left: "70%",
    },
    body: {
        display: "flex",
        width: screenWidth,
        height: 70,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: "row",
        backgroundColor: "#383a3f",
        borderRadius: 35,
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    bodyProfile: {
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
        paddingLeft: 10,
        borderRadius: 25
    },
    bodyTextClient: {
        color: "white",
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 8
    },
    bodyTextMessage: {
        color: "white",
        fontSize: 16,
        marginLeft: 20
    },
    notFound: {
        color: 'white',
        fontSize: 15,
        top: '10%',
        alignSelf: 'center',
    },
    timeContainer: {
        right: 70,
        position: 'absolute'
    },
    time: {
        color: '#e2e2e3',
    },
    NoConversation: {
        color: 'white',
        alignSelf: 'center',
        paddingTop: 300
    },
    archive: {
        top: 10,
        right: 10,
        position: 'absolute'
    },
    archiveicon: {
        height: 50,
        width: 50
    },
    archiveContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    archiveBottomIcon: {
        width: 30,
        height: 30
    },
    textArchive: {
        color: 'white',
        fontSize: 16,
        top: "0.6%",
        marginLeft: 10
    }
});

class Archive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: null,
            isEmpty: false,
            isSearch: false,
            searchValue: '',
            searchData: [],
            chooseOption: true,
            headerOptions: true,
            showloader: false
        };
    }
    componentDidMount() {
        this.setState({ showloader: true })
        this.getConversations();
        this.props.navigation.addListener("focus", () => this.getConversations());
        this.props.navigation.addListener("blur",()=>{
            this.setState({ isSearch: false,
                searchValue: '',
                searchData:[],
        });
        })
    }

    getConversations = () => {
        axios
            .request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/conversations`,
                headers: {
                    authorization: this.props.user.token,
                },
                data: {
                    username: this.props.user.username,
                    is_archive: 1
                },
            })
            .then(res => {
                if (res.status === 200) {
                    if (res.data.data && res.data.data.length) {
                        let details = [], usernames = [];
                        res.data.data.map(user => {
                            if (user.username !== this.props.user.username) {
                                details.push(user);
                            }
                        });
                        this.setState({ Data: details, usernames: usernames, isEmpty: false, showloader: false });
                    }
                    else {
                        this.setState({ isEmpty: true, showloader: false,Data:null });
                    }
                }
            })
    };
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
    onArcheive = (id) => {
        axios
            .request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/remove_archive`,
                headers: {
                    authorization: this.props.user.token
                },
                data: {
                    username: this.props.user.username,
                    roomIds: [id]
                }
            }).then((res) => {
                this.setState({}, () => this.getConversations());
            }).catch((error) => console.log(error))
    }

    ToArchivedMsgs = () => {
        this.props.navigation.navigate('archive');
    }
    getTimeByTimestamp = (timestamp) => {
        let date = new Date(timestamp * 1000);
        let ampm = date.getHours() >= 12 ? 'pm' : 'am';
        let hours = date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
        return hours + ":" + date.getMinutes() + ampm;
    }
    getDurationByTimestamp = (timestamp) => {
        let date = new Date(timestamp * 1000);
        let days = (new Date() - new Date(date.getFullYear(), date.getMonth(), date.getDate())) / (1000 * 60 * 60 * 24);
        days = Math.floor(days);
        let weeks = Math.floor(days / 7);
        let months = Math.floor(days / 30);
        let years = Math.floor(days / 365);
        if (days === 0) return 'Today';
        else if (days === 1) return 'Yesterday';
        else if (days < 8) return (days + ' days' + ' ago');
        else if (weeks === 1) return (weeks + ' week' + ' ago');
        else if (weeks < 6) return (weeks + ' weeks' + ' ago');
        else if (months === 1) return (months + ' month' + ' ago');
        else if (months < 13) return (months + ' months' + ' ago');
        else if (years === 1) return (years + ' year' + ' ago')
        else return (years + ' years' + ' ago');
    }
    searchConversations = (data) => {
        let searchData = [];
        let conversationData = this.state.Data;
        if (data.length > 0) {
            searchData = conversationData && conversationData.filter((result) => {
                return result.client.username.toLowerCase().includes(data.toLowerCase())
            })
        }
        this.setState({ searchData: searchData });
    }
    searchVisible = () => {
        this.setState({
            searchValue: '',
            searchData: [],
            isSearch: this.state.isSearch ? false : true,
        });
    }
    onConversationClick = (user) => {
        this.props.createClient(user);
        this.props.navigation.navigate('chatRoom');
    }
    render() {
        return (
            <>
                {this.state.showloader ? <Loader /> :
                    <View style={styles.dark}>
                        {!this.state.isSearch ?
                            <View style={styles.header}>
                                <Image style={styles.headerProfile} source={{ uri: this.props.user.profile, }} />
                                <Text style={styles.headerText}>Archive</Text>
                                <Text style={styles.headerSearchIcon} onPress={this.searchVisible}><Icon size={28} color="white" name="search" /></Text>
                            </View>
                            : <View style={styles.header}>
                                <Text onPress={this.searchVisible}> <Icon size={22} color="white" name="arrow-back-ios" /></Text>
                                <TextInput
                                    autoFocus
                                    placeholder="Search Here..."
                                    placeholderTextColor='white'
                                    style={styles.headerInput}
                                    value={this.state.searchValue}
                                    onChangeText={data => { this.setState({ searchValue: data }); this.searchConversations(data); }}
                                />
                                {this.state.searchValue.length !== 0 && <Text onPress={() => { this.setState({ searchValue: '' }) }}> <CrossIcon size={25} color="white" name="cross" /></Text>}
                            </View>

                        }
                        {this.state.isEmpty && <Text style={styles.NoConversation}>No Conversations Found</Text>}
                        <ScrollView style={styles.scrollViewContainer}>
                            {this.state.searchValue.length === 0 ?
                                <View>
                                    {this.state.Data && !!this.state.Data.length && this.state.Data.map((user, index) => {
                                        return (
                                            <View key={index}>
                                                {user.client && user.latest &&
                                                    <TouchableOpacity style={styles.body} onPress={() => { this.onConversationClick(user.client) }}>
                                                        <Image style={styles.bodyProfile} source={{ uri: user.client.profile, }} />
                                                        <View>
                                                            <Text style={styles.bodyTextClient}>{user.client.username}</Text>
                                                            <Text style={styles.bodyTextMessage}>{user.latest.message}</Text>
                                                        </View>
                                                        <View style={styles.timeContainer}>
                                                            {this.getDurationByTimestamp(user.latest.timestamp) === 'Today' && <Text style={styles.time}>{this.getTimeByTimestamp(user.latest.timestamp)}</Text>}
                                                            {this.getDurationByTimestamp(user.latest.timestamp) !== 'Today' && <Text style={styles.time}>{this.getDurationByTimestamp(user.latest.timestamp)}</Text>}
                                                        </View>
                                                        {/* <TouchableOpacity style={styles.archive} onPress={() => { this.onUnArcheive(user.id) }}>
                                                    <Image style={styles.archiveicon} source={ArchiveIcon} /> */}
                                                        <TouchableOpacity style={styles.archive} onPress={() => { this.onArcheive(user.id) }}>
                                                            <Text><Icon size={40} name="unarchive" /></Text>
                                                        </TouchableOpacity>
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                        );
                                    })}
                                </View>
                                : null}
                            {this.state.searchData && this.state.searchData.length !== 0 ?
                                this.state.searchData.map((user, index) => {
                                    return (
                                        <View key={index}>
                                            {user.client && user.latest &&
                                                <TouchableOpacity style={styles.body} onPress={() => { this.onConversationClick(user.client) }}>
                                                    <Image style={styles.bodyProfile} source={{ uri: user.client.profile, }} />
                                                    <View>
                                                        <Text style={styles.bodyTextClient}>{user.client.username}</Text>
                                                        <Text style={styles.bodyTextMessage}>{user.latest.message}</Text>
                                                    </View>
                                                    <View style={styles.timeContainer}>
                                                        {this.getDurationByTimestamp(user.latest.timestamp) === 'Today' && <Text style={styles.time}>{this.getTimeByTimestamp(user.latest.timestamp)}</Text>}
                                                        {this.getDurationByTimestamp(user.latest.timestamp) !== 'Today' && <Text style={styles.time}>{this.getDurationByTimestamp(user.latest.timestamp)}</Text>}
                                                    </View>
                                                    <TouchableOpacity style={styles.archive} onPress={() => { this.onArcheive(user.id) }}>
                                                        <Text><Icon size={40} name="unarchive" /></Text>
                                                    </TouchableOpacity>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    )
                                }) :
                                (this.state.searchData && this.state.searchData.length === 0 && this.state.searchValue.length !== 0) ?
                                    <Text style={styles.notFound}>Not Found</Text> : null}
                        </ScrollView>
                    </View>
                }
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Archive);
