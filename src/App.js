import React, {Component} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {store} from './store';
import './confiq/firebase';
import Routes from './navigation/Routes';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PaperProvider>
          <Routes />
        </PaperProvider>
      </Provider>
    );
  }
}
