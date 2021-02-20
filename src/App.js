import React from 'react';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import Toast from 'react-native-toast-message';

import {store} from './store';
import Routes from './navigation/Routes';

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Routes />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </PaperProvider>
    </Provider>
  );
}
