import { useEffect } from 'react';
import { AppRegistry, Platform, Alert } from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';
import { useNavigation } from '@react-navigation/native';

const firebaseConfig = {
  apiKey: 'AIzaSyDIWbrZqWmrl-_zCIIZU5esohyQN2zEVl8',
  authDomain: 'djsl-9198c.firebaseapp.com',
  databaseURL: 'https://djsl-9198c.firebaseio.com',
  projectId: 'djsl-9198c',
  storageBucket: 'djsl-9198c.appspot.com',
  messagingSenderId: '157599575981',
  appId: '1:157599575981:web:547fba27ce658e96e9bb24',
  measurementId: 'G-J44RR4X2BQ',
};
// Initialize Firebase
//firebase.initializeApp(firebaseConfig);
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}
requestUserPermission();

// PushNotification.createChannel(
//   {
//     channelId: 'channel-id', // (required)
//     channelName: 'My channel', // (required)
//     channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
//     playSound: true, // (optional) default: true
//     soundName: 'iphonemessage1.mp3', // (optional) See `soundName` parameter of `localNotification` function
//     importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
//     vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
//     vibration: 300,
//     color: 'yellow',
//   },
//   (created) =>
//     PushNotification.getChannels(function (channel_ids) {
//       console.log('firebase.js : ', channel_ids); // ['channel_id_1']
//       console.log(`firebase.js : createChannel returned '${created}'`); // (optional) callback returns whether the channel was created, false means it already existed.
//     }),
// );



export {
  firebaseConfig,
  firebase,
  firestore,
  auth,
  messaging,
};
