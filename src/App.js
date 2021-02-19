import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import Toast from 'react-native-toast-message';

import {store} from './store';
import {messaging} from './config/firebase';
import Routes from './navigation/Routes';

export default function App() {
  useEffect(() => {
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };
  return (
    <Provider store={store}>
      <PaperProvider>
        <Routes />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </PaperProvider>
    </Provider>
  );
}
