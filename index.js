/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

const NotificationHandler = async (message) => {
  console.warn('RNFirebaseBackgroundMessage1: ', message);
  return Promise.resolve();
};

AppRegistry.registerHeadlessTask(
  'ReactNativeFirebaseMessagingHeadlessTask',
  () => NotificationHandler,
);
AppRegistry.registerComponent(appName, () => App);
