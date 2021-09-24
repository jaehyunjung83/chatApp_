
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {store} from './store';
import Routes from './navigation/Routes';
import messaging from '@react-native-firebase/messaging';

export default function App() {
  // useEffect(()=>{
  //   messaging().getToken().then(token=>{
  //     console.log(`%c 이 기기 token은 ${token}`, 'color: aqua; backgroundColor: black')})
  // },[])

  return (
    <Provider store={store}>
      <PaperProvider>
        <Routes />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </PaperProvider>
    </Provider>
  );
}
