/**
 * @format
 */
import {useEffect} from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { getToken } from './src/utils';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';

getToken();


  

AppRegistry.registerComponent(appName, () => App);
