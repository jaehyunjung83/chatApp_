import React, { useEffect, useState, useRef } from 'react';
import { AppRegistry, Platform, Alert, Vibration } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';

import { authUser } from '../actions/userActions';
import { AppStyles } from '../AppStyles';
import HomeScreen from '../screens/HomeScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import ChatingRoomScreen from '../screens/ChatingRoomScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import Loading from '../components/Loading';
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';
// import Sound from 'react-native-sound';
// import iphonemessage1 from '../../android/app/src/main/res/raw/iphonemessage1.mp3';

const ChatAppStack = createStackNavigator();
const Login = createStackNavigator();
const ModalStack = createStackNavigator();

const LoginStack = ({ navigation }) => {
  return (
    <Login.Navigator
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,
      }}
    >
      <Login.Screen name="SignIn" component={SignInScreen} headerMode="none" />
      <Login.Screen name="SignUp" component={SignUpScreen} headerMode="none" />
    </Login.Navigator>
  );
};

const ChatApp = ({ navigation, route }) => {
  // console.log(
  //   'dangerouslyGetState().routes',
  //   navigation.dangerouslyGetState().routes,
  // );
  const { rooms } = useSelector((state) => state.rooms);

  // app닫혀있을 떄
  // useEffect(() => {
  //   console.log('route', route);
  //   messaging().onNotificationOpenedApp((remoteMessage) => {
  //     console.log('app닫혀있을 때 function noti:', remoteMessage);
  //     (route) =>
  //     navigation.navigate(remoteMessage.data.type, {
  //       room: {
  //         _id: remoteMessage.data.roomid,
  //         // messageid: remoteMessage.data.messageid,
  //       },
  //     });
  //   });
  // }, []);

  useEffect(() => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          console.log('firebase message permission %c YES', 'color: #4169e1');
        } else {
          console.log('firebase message permission %c NO', 'color: red');
        }
      });
  }, []);

  useEffect(() => {
    // const allowToReceiveMessage = async () => {
    //   await inAppMessaging().setMessagesDisplaySuppressed(true);
    //   console.log('setMessagesDisplaySuppressed')
    // };
    // allowToReceiveMessage();

    const InBackground = messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log('Firebase handled Background!', remoteMessage);

        await PushNotification.localNotification({
          channelId: 'Lunar_Chatting_channel_id2',
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body,
          playSound: true, // (optional) default: true
          soundName: "lunar_alarm", // (optional) See `soundName` parameter of `localNotification` function
          ticker: remoteMessage.data,
          importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
          // vibration: 300,
          color: 'red',
          invokeApp: true,
          actions: ['확인하기', '다음에'],
        });
      },
    );
    return InBackground;
  }, []);

  useEffect(() => {
    messaging().onMessage(async (remoteMessage) => {
      console.log('onmessage route', route);
      console.log('app열려있을 때: ', remoteMessage);
      await PushNotification.localNotification({
        channelId: 'Lunar_Chatting_channel_id2',
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        playSound: true, // (optional) default: true
        soundName: 'lunar_alarm', // (optional) See `soundName` parameter of `localNotification` function
        ticker: remoteMessage.data,
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        vibration: 1000,
        color: '#ff00ff',
        actions: ['확인하기', '다음에'],
        invokeApp: true,
        visibility: 'public',
      });
    });
  }, []);

  // PushNotification.deleteChannel('Lunar_Chatting_channel_id');
  useEffect(() => {
    // PushNotification.channelExists('Lunar_Chatting_channel_id', (exists) => {
    //   // PushNotification.deleteChannel('default_channel_id');
      
    //   if (!exists) {
        PushNotification.createChannel(
          {
            channelId: 'Lunar_Chatting_channel_id2', // (required)
            channelName: 'Lunar_Chatting', // (required)
            channelDescription: '채팅알림 RNPN', // (optional) default: undefined.
            playSound: true, // (optional) default: true
            soundName: 'lunar_alarm', // (optional) See `soundName` parameter of `localNotification` function
            importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            vibration: 1000,
            color: 'black',
          },
          (created) => console.log(`firebase.js : createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    //   }
    //   else {
        PushNotification.getChannels(function (channel_ids) {
        console.log('routes.js GetChannel: ', channel_ids); // ['channel_id_1']
      });
    // }
    // });

    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    const NotiConfigure = async () => {
      await PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function async(token) {
          console.log('route.js: firebase TOKEN RN 등록 -', token);
        },

        // 알림 클릭했을 때
        onNotification: function async(notification) {
          console.log('Routes.js - onNotification:', notification);
          
          (notification.ticker?.type && notification.action === '확인하기') ?
          console.log(`Push-Notification %c 거친 알림`, 'color: orange') +
          navigation.navigate(notification.ticker.type, {
            room: { _id: notification.ticker.roomid },
          })
          :
            (notification.ticker?.type && notification.action === '다음에') ?
            console.log(`Push-Notification %c 거친 알림`, 'color: orange') +
            null
            :
              (notification.ticker?.type) ? 
              console.log(`Push-Notification %c 거친 알림`, 'color: orange') +
              navigation.navigate(notification.ticker.type, {
                room: { _id: notification.ticker.roomid },
              })
              :
                (notification.data?.type && notification.action == '확인하기') ?
                console.log(`Push-Notification %c 안 거친(firebase) 알림`, 'color: yellow') +
                navigation.navigate(notification.data.type, {
                  room: { _id: notification.data.roomid },
                }) : null;


          // if (notification.ticker?.type && notification.action === '확인하기') {
          //   console.log(`Push-Notification %c 거친 알림`, 'color: orange');
          //   navigation.navigate(notification.ticker.type, {
          //     room: { _id: notification.ticker.roomid },
          //   });
          //   if (notification.ticker?.type && notification.action === '다음에') {
          //     return null};
          // }  
          //  else {
          //   console.log(`Push-Notification %c 안 거친(firebase) 알림`, 'color: yellow');
          //   if (notification.data?.type && notification.action == '확인하기')
          //   navigation.navigate(notification.data.type, {
          //     room: { _id: notification.data.roomid },
          //   });
          // }

          // process the notification

          if (Platform.OS === 'ios') {
            // (required) Called when a remote is received or opened, or local notification is opened
            notification.finish(PushNotificationIOS.FetchResult.NoData);
          }
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

        playSound: true,
        soundName: 'iphonemessage1',

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
        requestPermissions: true,
      });
    };
    NotiConfigure();
  });

  // app 열고 있는 도중에 noti왔을 때
  // useEffect(() => {
  //   messaging().onMessage(async (remoteMessage) => {

  // console.log('app열려있을 때 function noti: ', remoteMessage);
  // Vibration.vibrate();
  // Sound.setCategory('Playback');
  // var nightowl = new Sound('iphonemessage1.mp3', Sound.MAIN_BUNDLE, (error) => {
  //   if (error) {
  //     console.log('failed to load the sound', error);
  //     return;
  //   }
  //   console.log('duration in seconds: ' + nightowl.getDuration() + 'number of channels: ' + nightowl.getNumberOfChannels());
  //   nightowl.play((success) => {
  //     if (success) {
  //       console.log('successfully finished playing');
  //     } else {
  //       console.log('playback failed due to audio decoding errors');
  //     }
  //   });
  // });
  // nightowl.setVolume(1);
  // nightowl.setPan(1);
  // nightowl.setNumberOfLoops(-1);
  // console.log('volume: ' + nightowl.getVolume());
  // console.log('pan: ' + nightowl.getPan());
  // console.log('loops: ' + nightowl.getNumberOfLoops());
  // nightowl.setCurrentTime(2.5);
  // nightowl.getCurrentTime((seconds) => console.log('at ' + seconds));
  // nightowl.pause();
  // nightowl.stop(() => {
  //   nightowl.play();
  // });
  // nightowl.release();
  // Alert.alert(
  //   `${remoteMessage.notification.title} 님이`,
  //   '\n' +
  //   JSON.stringify(remoteMessage.notification.body) + '메시지를' +
  //   JSON.stringify(remoteMessage.data.footage) + '에 읽었습니다',

  //   [
  //     {
  //       text: "다음에",
  //       onPress: () => console.log("취소 버튼 Pressed"),
  //       style: "cancel"
  //     },
  //     {
  //       text: 'OK',
  //       onPress: (route) =>
  //         navigation.navigate(remoteMessage.data.type, {
  //           room: {
  //             _id: remoteMessage.data.roomid,
  //           },
  //         }),
  //     },
  //   ],
  //   { cancelable: false },
  // );
  //   });

  // },[]);

  return (
    <ChatAppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: AppStyles.primaryColor,
        },
        headerTintColor: AppStyles.textColor,
        headerTitleStyle: {
          fontSize: 22,
        },
        headerBackTitleVisible: false,
      }}
    >
      <ChatAppStack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <IconButton
              icon="message-plus"
              size={AppStyles.iconSize}
              color={AppStyles.textColor}
              onPress={() =>
                navigation.navigate('AddRoom') +
                console.log(navigation.dangerouslyGetState().routes)
              }
            />
          ),
          // headerLeft: () => (
          //   <IconButton
          //     icon="message-plus"
          //     size={AppStyles.iconSize}
          //     color={AppStyles.textColor}
          //     onPress={() =>
          //       navigation.navigate('Room', { room: rooms[0] }) +
          //       console.log(navigation.dangerouslyGetState().routes)
          //     }
          //   />
          // ),
        })}
      />
      <ChatAppStack.Screen
        name="Room"
        component={ChatingRoomScreen}
        options={({ route, navigation }) => ({
          title: route.params.room._id,
          // onPress: ()=>console.log(navigation.dangerouslyGetState().routes),
        })}
      />
    </ChatAppStack.Navigator>
  );
};
const HomeStack = () => {
  return (
    <ModalStack.Navigator
      mode="modal"
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,
      }}
    >
      <ModalStack.Screen name="ChatApp" component={ChatApp} />
      <ModalStack.Screen name="AddRoom" component={AddRoomScreen} />
    </ModalStack.Navigator>
  );
};

export default function Routes() {
  const { data, login, loading } = useSelector((state) => state.user);
  // console.log(useSelector((state) => state.user.login));
  const dispatch = useDispatch();
  // 메시지 수신 시 원하는 페이지로 navigation.navigate하려면 stack에 등록 후 navi ref에 저장해주면 100% 됨
  const navigationRef = useRef(null);

  const navigate = (name, params) => {
    navigationRef.current?.navigate(name, params);
  };

  useEffect(() => {
    dispatch(authUser());
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      {loading ? <Loading /> : login ? <HomeStack /> : <LoginStack />}
    </NavigationContainer>
  );
}
