import {AppRegistry, Platform, Alert} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';



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

messaging().onMessage(async (remoteMessage) => {
  Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
});

messaging().onNotificationOpenedApp((remoteMessage) => {
  console.log(
    'Notification caused app to open from background state:',
    remoteMessage,
  );
  //navigation.navigate(remoteMessage.data.nav);
});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});
// messaging()
//   .getInitialNotification()
//   .then((res) => console.log('res', res));

const registerForRemoteMessages = () => {
  messaging()
    .registerDeviceForRemoteMessages()
    .then(() => {
      console.log('Registered');
      requestUserPermission();
    })
    .catch((e) => console.log(e));
};

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
};

if (Platform.OS === 'ios') {
  registerForRemoteMessages();
}

const NotificationHandler = async (message) => {
  console.warn('RNFirebaseBackgroundMessage1: ', message);
  return Promise.resolve();
};

AppRegistry.registerHeadlessTask(
  'ReactNativeFirebaseMessagingHeadlessTask',
  () => NotificationHandler,
);

// // Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    //notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  // permissions: {
  //   alert: true,
  //   badge: true,
  //   sound: true,
  // },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  senderID: '978617145962',
  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

export {firebaseConfig, firebase, firestore, auth, messaging};
