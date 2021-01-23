import React, {Component} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Provider} from 'react-redux';
import Login from './components/Login';
import {store} from './store';
import './confiq/firebase';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <SafeAreaView>
          <Login />
        </SafeAreaView>
      </Provider>
    );
  }
}
