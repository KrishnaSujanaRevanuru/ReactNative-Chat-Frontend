import React, { Component } from 'react'
import Registration from './RegisterUser/RegisterUser';
import Login from './login/login';
import ChatScreen from './chatScreen/chatScreen';
import Contacts from './chatScreen/contacts';
import ChatRoom from './chatRoom/chatRoom';
import { createAppContainer,createSwitchNavigator } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const TabNavigator = createBottomTabNavigator();

class Tab extends Component {

  render() {
    return (
      <NavigationContainer>
      <TabNavigator.Navigator>
        <TabNavigator.Screen name="chatScreen" component={ChatScreen} options={{ header: () => null }} />
        <TabNavigator.Screen name="contacts" component={Contacts} options={{ header: () => null }} />
        <TabNavigator.Screen name="chatRoom" component={ChatRoom} options={{ header: () => null }} />
      </TabNavigator.Navigator>
     </NavigationContainer>
    );
  }
}

const authenticateApp = createStackNavigator({
  login:Login,
  registration:Registration,
  
},
{ 
  initialRouteName: 'login', 
  headerMode: 'none' 
}

);

const SwitchNavigator = createAppContainer(createSwitchNavigator({
  authenticateApp: authenticateApp,
  appScreen:Tab,

},
{
  initialRouteName: 'authenticateApp',
}
))

class SwitchNavigation extends Component {
render() {
  return (
    <SwitchNavigator/>
  );
}
}

export default SwitchNavigation;

