import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import firebase from 'firebase';
import {IconButton} from 'react-native-paper';

import {checkAuthState, login} from '../actions/userActions';

import HomeScreen from '../screens/HomeScreen';
import AddRoomScreen from '../screens/AddRoomScreen';

const Stack = createStackNavigator();
const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

const ChatApp = () => {
  return (
    <ChatAppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#213453',
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
  const {userId} = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    //firebase.auth().signOut();
    dispatch(checkAuthState());
  }, []);
  console.log(userId);
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}
