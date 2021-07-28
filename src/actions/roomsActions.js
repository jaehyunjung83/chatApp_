import {firestore, auth} from '../config/firebase';

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

export const createRoom = (roomName, navigation) => {
  return async (dispatch) => {
    dispatch(createRoomInit());
    try {
      if (roomName.length > 0) {
        firestore()
          .collection('rooms')
          .add({
            name: roomName,
            latestMessage: {
              text: `You have joined the room ${roomName}.`,
              createdAt: new Date().getTime(),
            },
          })
          .then((docRef) => {
            docRef.collection('MESSAGES').add({
              text: `You have joined the room ${roomName}.`,
              createdAt: new Date().getTime(),
              system: true,
            });
            navigation.navigate('Home');
            return dispatch(createRoomSuccess());
          });
      }
    } catch (error) {
      return dispatch(createRoomFail(error));
    }
  };
};
