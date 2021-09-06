/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React, { Component } from 'react';
import Routing from './app/Components/Routing';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import getStore from './app/reducers/index'
import SplashScreen from 'react-native-splash-screen';

let { store, persistor } = getStore();
export default class App extends Component {

  componentDidMount() {
    setTimeout(() => SplashScreen.hide(), 500);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routing />
        </PersistGate>
      </Provider>
    )
  }
}





