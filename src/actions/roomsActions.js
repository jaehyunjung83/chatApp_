import React, { useEffect } from 'react';
import { firestore, auth } from '../config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import ChatingRoomScreen from '../screens/ChatingRoomScreen.js';

export const setRef = () => {
  let senderUserId = auth().currentUser();
  let receiverUserId = 'jjjh1983@gmail.com';

  const uniRef = senderUserId + '/' + receiverUserId;
  return uniRef;
};

export const createRoomInit = () => ({
  type: 'ROOM_CREATE_INIT',
});

export const createRoomSuccess = () => ({
  type: 'ROOM_CREATE_SUCCESS',
});

export const createRoomFail = (error) => ({
  type: 'ROOM_CREATE_FAIL',
  payload: error,
});
export const fetchRoomsInit = () => ({
  type: 'FETCH_ROOMS_INIT',
});

export const fetchRoomsSuccess = (rooms) => ({
  type: 'FETCH_ROOMS_SUCCESS',
  payload: rooms,
});

export const fetchRoomsFail = (error) => ({
  type: 'FETCH_ROOMS_FAIL',
  payload: error,
});

export const fetchRooms = () => {
  //firebase.firestore().settings({experimentalForceLongPolling: true});

  return async (dispatch) => {
    dispatch(fetchRoomsInit());
    try {
      await firestore()
        .collection('rooms')
        .orderBy('latestMessage.createdAt', 'desc')
        .onSnapshot((querySnapshot) => {
          //console.log('data=', querySnapshot.empty);
          let data = [];
          if (!querySnapshot?.empty) {
            data = querySnapshot.docs.map((documentSnapshot) => {
              return {
                _id: documentSnapshot.id,
                // give defaults
                name: '',
                latestMessage: {
                  text: '',
                },
                ...documentSnapshot.data(),
              };
            });
            return dispatch(fetchRoomsSuccess(data));
          }
        });
    } catch (error) {
      return dispatch(fetchRoomsFail(error));
    }
  };
};

export const createRoom = (roomName, navigation, route) => {
  return async (dispatch) => {
    dispatch(createRoomInit());

    try {
      if (roomName.length > 0) {
        firestore()
          .collection('rooms')
          .add({
            roomname: roomName,
            routeparams: route.params,
            latestMessage: {
              text: `${roomName}님과의 대화방이 만들어졌습니다.`,
              createdAt: new Date().getTime(),
            },
          })
          .then((docRef) => {
            console.table(route);
            docRef.collection('MESSAGES').add({
              text: `${roomName}님과의 대화방이 만들어졌습니다.`,
              createdAt: new Date().getTime(),
              system: true,
            });
            console.log('docRef.id', docRef.id);
            // navigation.navigate('Home');
            navigation.navigate('Room', {
              room: {
                _id: docRef.id,
                roomname: roomName,
                latestMessage: {
                  text: `${roomName}님과의 대화방이 만들어졌습니다.`,
                  createdAt: new Date().getTime(),
                },
              },
            });
            return (
              dispatch(createRoomSuccess()) +
              dispatch(fetchRooms()) +
              <ChatingRoomScreen />
            );
          });
      }
    } catch (error) {
      return dispatch(createRoomFail(error));
    }
  };
};
