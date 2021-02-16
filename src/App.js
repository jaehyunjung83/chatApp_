import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {store} from './store';
import './config/firebase';
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
