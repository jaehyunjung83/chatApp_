import React, { useEffect, useState, useRef } from 'react';
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

const ChatAppStack = createStackNavigator();
const Login = createStackNavigator();
const ModalStack = createStackNavigator();

const LoginStack = () => {
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

const ChatApp = ({navigation, route}) => {
  console.log('dangerouslyGetState().routes', navigation.dangerouslyGetState().routes)
console.log('route', route)
  
useEffect(()=> {
messaging().onNotificationOpenedApp((remoteMessage) => {
  console.log(
    'Notification caused app to open from background state:',
    remoteMessage,
  );
  navigation.navigate(remoteMessage.data.type);
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
              onPress={() => navigation.navigate('AddRoom') + console.log(navigation.dangerouslyGetState().routes)}
            />
          ),
        })}
      />
      <ChatAppStack.Screen
        name="Room"
        component={ChatingRoomScreen}
        options={({ route }) => ({
          title: route.params.room.name,
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
  const dispatch = useDispatch();
  // 메시지 수신 시 원하는 페이지로 navigation.navigate하려면 stack에 등록 후 navi ref에 저장해주면 100% 됨
  const navigationRef = useRef(null);
  (remoteMessage) => navigationRef.current.navigate(remoteMessage.data.type);
  useEffect(() => {
    dispatch(authUser());
  }, []);
  return (
    <NavigationContainer ref={navigationRef}>
      {loading ? <Loading /> : login ? <HomeStack /> : <LoginStack />}
    </NavigationContainer>
  );
};
