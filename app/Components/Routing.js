/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React, { Component } from 'react'
import Registration from './RegisterUser/RegisterUser';
import Login from './login/login';
import ChatScreen from './chatScreen/chatScreen';
import Contacts from './chatScreen/contacts';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
export default class Routing extends Component {
  render() {
    return (
      <NavigationContainer >
        <Stack.Navigator initialRouteName="login" >
          <Stack.Screen name="registration" component={Registration} options={{ header: () => null }} />
          <Stack.Screen name="login" component={Login} options={{ header: () => null }} />
          <Stack.Screen name="chatscreen" component={ChatScreen} options={{ header: () => null }} />
          <Stack.Screen name="contacts" component={Contacts} options={{ header: () => null }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}





