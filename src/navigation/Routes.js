import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {IconButton} from 'react-native-paper';

import {authUser} from '../actions/userActions';

import HomeScreen from '../screens/HomeScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import RoomScreen from '../screens/RoomScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import Loading from '../components/Loading';

const ChatAppStack = createStackNavigator();
const Login = createStackNavigator();
const ModalStack = createStackNavigator();

const LoginStack = () => {
  return (
    <Login.Navigator headerMode="none">
      <Login.Screen name="SignIn" component={SignInScreen} headerMode="none" />
      <Login.Screen name="SignUp" component={SignUpScreen} headerMode="none" />
    </Login.Navigator>
  );
};

const ChatApp = () => {
  return (
    <ChatAppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#255c99',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 22,
        },
      }}>
      <ChatAppStack.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          headerRight: () => (
            <IconButton
              icon="message-plus"
              size={28}
              color="#ffffff"
              onPress={() => navigation.navigate('AddRoom')}
            />
          ),
        })}
      />
      <ChatAppStack.Screen
        name="Room"
        component={RoomScreen}
        options={({route}) => ({
          title: route.params.room.name,
        })}
      />
    </ChatAppStack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <ModalStack.Navigator mode="modal" headerMode="none">
      <ModalStack.Screen name="ChatApp" component={ChatApp} />
      <ModalStack.Screen name="AddRoom" component={AddRoomScreen} />
    </ModalStack.Navigator>
  );
};

export default function Routes() {
  const {data, login, loading} = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authUser());
  }, []);
  return (
    <NavigationContainer>
      {loading ? <Loading /> : login ? <HomeStack /> : <LoginStack />}
    </NavigationContainer>
  );
}
