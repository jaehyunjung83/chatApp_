import React, { useEffect, useCallback, useRef } from 'react';
import { AppRegistry, Platform, Alert, Vibration } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
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
import { firebaseNotification } from '../config/firebase';
import messaging from '@react-native-firebase/messaging';
import Sound from 'react-native-sound';


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
  useEffect(() => {
    console.log('route', route);
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('app닫혀있을 때 function noti:', remoteMessage);

      navigation.navigate(remoteMessage.data.type, {
        room: {
          _id: remoteMessage.data.roomid,
          // messageid: remoteMessage.data.messageid,
        },
      });
    });
  }, []);

  // app 열고 있는 도중에 noti왔을 때
  useEffect(() => {
    messaging().onMessage(async (remoteMessage) => {
      
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
    });
  
  },[]);

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

      <ChatAppStack.Screen
        name="firebasenoti"
        component={firebaseNotification}
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
  // (remoteMessage) => navigationRef.current.navigate(remoteMessage.data.type);
  // console.table(navigationRef);

  useEffect(() => {
    dispatch(authUser());
  }, []);
  return (
    <NavigationContainer ref={navigationRef}>
      {loading ? <Loading /> : login ? <HomeStack /> : <LoginStack />}
    </NavigationContainer>
  );
}
