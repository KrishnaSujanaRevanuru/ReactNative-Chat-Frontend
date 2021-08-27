import React, { Component } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native';
import Registration from './RegisterUser/RegisterUser';
import Login from './login/login';
import ChatScreen from './chatScreen/chatScreen';
import Contacts from './chatScreen/contacts';
import ChatRoom from './chatRoom/chatRoom';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
export default class Routing extends Component {
  render() {
    return (
      <NavigationContainer >
        <Stack.Navigator initialRouteName="login" >
          <Stack.Screen name="registration" component={Registration}
            options={{
              headerTitle: () => (
                <Text style={styles.headerText}>Registration</Text>
              ),
              headerStyle: {
                backgroundColor: '#202124'
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold'
              },
            }} />
          <Stack.Screen name="login" component={Login}
            options={{
              headerTitle: () => (
                <Text style={styles.headerText}>Login</Text>
              ),
              headerStyle: {
                backgroundColor: '#202124'
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold'
              },
            }} />
          <Stack.Screen name="chatscreen" component={ChatScreen}
            options={{
              headerTitle: () => (
                <Text style={styles.headerText}>Conversations</Text>
              ),
              headerRight: () => (
                <Image
                  style={styles.headerMenu}
                  source={{ uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBhUIBwgVFhUVFxcYFhYYFRUWDxcQIBIdFhYRFR8YHCggGBoxJxUVLTEiJykrOi4uGh8/RDMsNygtMC8BCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAwQBAgYFB//EAC8QAQACAQIFAwMCBgMAAAAAAAABAgMEEQUGEiFBEzFRMmFxofAUIoGRseEjQsH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1tO3aAZmYhrOSI94bRGzINa5K29pbKPEaWw451OD3r3mPE18z+U2i1NdTii9ZBYAAAAAAAAAAAAAAAAAAAAAAAARXtEZ4rP8AT8/vdKpcSrkjH6mL3r3j43BdFXQa/Drce+O3ePqrP1RP78rQNb9PRPX7bd/w5fknU2zaGOqWOc+YaabBPC9BfqzZI2nb2x0n3tMx7W+IWeUtDOl0cRaAdEAAAAAAAAAAAAAAAAAAAAAAAAjv/NPTNe3z/wCJGJjcHO8W4F69/W095rbxaszW0fiY7vF1PCePZo9K/Fc3T8RaYnb4mY7u738RDW28d+iAcjwPlPHpL+pkjefmfd12HHXFTprDFM1Jnp9p+EoAAAAAAAAAAAAAAAAAAAAAAAADW8+I8tkOTJFNREW89v6gliNo2hkAUuJ4JthnNh+qsbxt5jzWThmsrq8EXrK1lyUxYpyZJ2iImZnxtEbzLleRst8mhjqB1oAAAAAAAAAAAAAAAAAAAAAAACnxLFbJh3xz3jvH5XGJjeNpB5eg43gzW9DV2imSO209q2+9Zn/D0smXHix+plyRER3mZmIrt87y8rivBMGur/NVzV+RdPOXqjH/AIBtzTzNXicTwjgluqLdsmSPo6fNKT538z+49/lnQfwekiJhFwnlzT6LvFXv0rFI2gGwAAAAAAAAAAAAAAAAAAAAAAAANbTtAMzMQjyzS1enJTePvHb9UkRsyCPHeLe0pFDiFbabH/E4PH1R8x5n8rGk1FdRi66yCcAAAAAAAAAAAAAAAAAAAAAAABFa0Rnis/f+6VS4nF60jLi969/9AuivotZh1uLrw2+0x/2ifiVgGt4rak1v7THf428uZ5K1Vs+ijqlnnPmDHoNNPDtJffPkjaIie9KT2nJb4+33ScoaKdLo4iYB0YAAAAAAAAAAAAAAAAAAAAAAADW9YvXaWwDmuK8DyTl9fRZbUt81mYn9Hi6vBzPl/wCG3Fb9P2itbf3rXf8AV37WcdZ8A4rgfKkYcvr6iZtae8zMzNpn5mZ93Z4MVcNOmsN4iI9mQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/9k=' }}
                  resizeMode='contain'
                />
              ),
              headerStyle: {
                backgroundColor: '#202124'
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold'
              },
            }} />
          <Stack.Screen name="contacts" component={Contacts}
            options={{
              headerTitle: () => (
                <Text style={styles.headerText}>Contacts</Text>
              ),
              headerRight: () => (
                <Image
                  style={styles.headerMenu}
                  source={{ uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBhUIBwgVFhUVFxcYFhYYFRUWDxcQIBIdFhYRFR8YHCggGBoxJxUVLTEiJykrOi4uGh8/RDMsNygtMC8BCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAwQBAgYFB//EAC8QAQACAQIFAwMCBgMAAAAAAAABAgMEEQUGEiFBEzFRMmFxofAUIoGRseEjQsH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1tO3aAZmYhrOSI94bRGzINa5K29pbKPEaWw451OD3r3mPE18z+U2i1NdTii9ZBYAAAAAAAAAAAAAAAAAAAAAAAARXtEZ4rP8AT8/vdKpcSrkjH6mL3r3j43BdFXQa/Drce+O3ePqrP1RP78rQNb9PRPX7bd/w5fknU2zaGOqWOc+YaabBPC9BfqzZI2nb2x0n3tMx7W+IWeUtDOl0cRaAdEAAAAAAAAAAAAAAAAAAAAAAAAjv/NPTNe3z/wCJGJjcHO8W4F69/W095rbxaszW0fiY7vF1PCePZo9K/Fc3T8RaYnb4mY7u738RDW28d+iAcjwPlPHpL+pkjefmfd12HHXFTprDFM1Jnp9p+EoAAAAAAAAAAAAAAAAAAAAAAAADW8+I8tkOTJFNREW89v6gliNo2hkAUuJ4JthnNh+qsbxt5jzWThmsrq8EXrK1lyUxYpyZJ2iImZnxtEbzLleRst8mhjqB1oAAAAAAAAAAAAAAAAAAAAAAACnxLFbJh3xz3jvH5XGJjeNpB5eg43gzW9DV2imSO209q2+9Zn/D0smXHix+plyRER3mZmIrt87y8rivBMGur/NVzV+RdPOXqjH/AIBtzTzNXicTwjgluqLdsmSPo6fNKT538z+49/lnQfwekiJhFwnlzT6LvFXv0rFI2gGwAAAAAAAAAAAAAAAAAAAAAAAANbTtAMzMQjyzS1enJTePvHb9UkRsyCPHeLe0pFDiFbabH/E4PH1R8x5n8rGk1FdRi66yCcAAAAAAAAAAAAAAAAAAAAAAABFa0Rnis/f+6VS4nF60jLi969/9AuivotZh1uLrw2+0x/2ifiVgGt4rak1v7THf428uZ5K1Vs+ijqlnnPmDHoNNPDtJffPkjaIie9KT2nJb4+33ScoaKdLo4iYB0YAAAAAAAAAAAAAAAAAAAAAAADW9YvXaWwDmuK8DyTl9fRZbUt81mYn9Hi6vBzPl/wCG3Fb9P2itbf3rXf8AV37WcdZ8A4rgfKkYcvr6iZtae8zMzNpn5mZ93Z4MVcNOmsN4iI9mQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/9k=' }}
                  resizeMode='contain'
                />
              ),
              headerStyle: {
                backgroundColor: '#202124'
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold'
              },
            }} />
          <Stack.Screen name="chatroom" component={ChatRoom}
            options={{
              headerTitle: () => (
                <Text style={styles.headerText}>Chatroom</Text>
              ),
              headerRight: () => (
                <Image
                  style={styles.headerMenu}
                  source={{ uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBhUIBwgVFhUVFxcYFhYYFRUWDxcQIBIdFhYRFR8YHCggGBoxJxUVLTEiJykrOi4uGh8/RDMsNygtMC8BCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAwQBAgYFB//EAC8QAQACAQIFAwMCBgMAAAAAAAABAgMEEQUGEiFBEzFRMmFxofAUIoGRseEjQsH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1tO3aAZmYhrOSI94bRGzINa5K29pbKPEaWw451OD3r3mPE18z+U2i1NdTii9ZBYAAAAAAAAAAAAAAAAAAAAAAAARXtEZ4rP8AT8/vdKpcSrkjH6mL3r3j43BdFXQa/Drce+O3ePqrP1RP78rQNb9PRPX7bd/w5fknU2zaGOqWOc+YaabBPC9BfqzZI2nb2x0n3tMx7W+IWeUtDOl0cRaAdEAAAAAAAAAAAAAAAAAAAAAAAAjv/NPTNe3z/wCJGJjcHO8W4F69/W095rbxaszW0fiY7vF1PCePZo9K/Fc3T8RaYnb4mY7u738RDW28d+iAcjwPlPHpL+pkjefmfd12HHXFTprDFM1Jnp9p+EoAAAAAAAAAAAAAAAAAAAAAAAADW8+I8tkOTJFNREW89v6gliNo2hkAUuJ4JthnNh+qsbxt5jzWThmsrq8EXrK1lyUxYpyZJ2iImZnxtEbzLleRst8mhjqB1oAAAAAAAAAAAAAAAAAAAAAAACnxLFbJh3xz3jvH5XGJjeNpB5eg43gzW9DV2imSO209q2+9Zn/D0smXHix+plyRER3mZmIrt87y8rivBMGur/NVzV+RdPOXqjH/AIBtzTzNXicTwjgluqLdsmSPo6fNKT538z+49/lnQfwekiJhFwnlzT6LvFXv0rFI2gGwAAAAAAAAAAAAAAAAAAAAAAAANbTtAMzMQjyzS1enJTePvHb9UkRsyCPHeLe0pFDiFbabH/E4PH1R8x5n8rGk1FdRi66yCcAAAAAAAAAAAAAAAAAAAAAAABFa0Rnis/f+6VS4nF60jLi969/9AuivotZh1uLrw2+0x/2ifiVgGt4rak1v7THf428uZ5K1Vs+ijqlnnPmDHoNNPDtJffPkjaIie9KT2nJb4+33ScoaKdLo4iYB0YAAAAAAAAAAAAAAAAAAAAAAADW9YvXaWwDmuK8DyTl9fRZbUt81mYn9Hi6vBzPl/wCG3Fb9P2itbf3rXf8AV37WcdZ8A4rgfKkYcvr6iZtae8zMzNpn5mZ93Z4MVcNOmsN4iI9mQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/9k=' }}
                  resizeMode='contain'
                />
              ),
              headerStyle: {
                backgroundColor: '#202124'
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold'
              },
            }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
const styles = StyleSheet.create({
  headerMenu: {
    width: 50,
    height: 50,
    borderRadius: 200 / 2,
    right: 0,
    position: 'absolute'
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  }
})