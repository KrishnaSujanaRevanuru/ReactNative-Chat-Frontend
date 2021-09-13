import React, { Component } from 'react'
import Registration from './RegisterUser/RegisterUser';
import Login from './login/login';
import ChatScreen from './chatScreen/chatScreen';
import Contacts from './chatScreen/contacts';
import ChatRoom from './chatRoom/chatRoom';
import ForwardMessage from './chatRoom/forwardMessage';
import Archive from './Archive/Archive';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import Profile from '../Components/headerOptions/profile';

const TabNavigator = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();
class Tab extends Component {

  render() {
    return (
        <TabNavigator.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === 'chatScreen') iconName = 'home';
              else if (route.name === 'contacts') iconName = 'contacts';
              else if (route.name === 'archive') iconName = 'archive';
              else if (route.name === 'profile') iconName = 'person';
              return <Materialicons name={iconName} size={size} color={color} />;
            },
            tabBarShowLabel: false,
            tabBarStyle: { backgroundColor: "#5E6F74" },
            tabBarActiveTintColor: '#EFF7F4',
            tabBarInactiveTintColor: '#9C9E9D',
            backBehavior: "chatScreen",
          })
          }
        >
          <TabNavigator.Screen name="chatScreen" component={ChatScreen} options={{ header: () => null }} />
          <TabNavigator.Screen name="contacts" component={Contacts} options={{ header: () => null }} />
          <TabNavigator.Screen name="archive" component={Archive} options={{ header: () => null }} />
          <TabNavigator.Screen name="profile" component={Profile} options={{ header: () => null }} />
        </TabNavigator.Navigator>
    );
  }
}

class appScreen extends Component {
  render() {
    return (
      <NavigationContainer>
        <StackNav.Navigator initialRouteName='chatScreen'>
          <StackNav.Screen name="chatScreen" component={Tab} options={{ header: () => null }} />
          <StackNav.Screen name="chatRoom" component={ChatRoom} options={{ header: () => null }} />
          <StackNav.Screen name="forward" component={ForwardMessage} options={{ header: () => null }} />
        </StackNav.Navigator>
      </NavigationContainer>
    )
  }
}

const authenticateApp = createStackNavigator({
  login: Login,
  registration: Registration,
},
  {
    initialRouteName: 'login',
    headerMode: 'none'
  }
);

const SwitchNavigator = createAppContainer(createSwitchNavigator({
  authenticateApp: authenticateApp,
  appScreen: appScreen,

},
  {
    initialRouteName: 'authenticateApp',
  }
))

class SwitchNavigation extends Component {
  render() {
    return (
      <SwitchNavigator />
    );
  }
}

export default SwitchNavigation;