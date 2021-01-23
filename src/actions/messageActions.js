import firebase from '../confiq/firebase';
import DeviceInfo from 'react-native-device-info';

export const setRef = () => {
  let senderUserId = firebase.currentUser();
  let recieverUserId = '1234';

  const uniRef = senderUserId + '/' + recieverUserId;
  return uniRef;
};

export const startFetchingMessages = () => ({
  type: 'START_FETCHING_MESSAGES',
});

export const fetchMessages = () => {
  console.log('fetchMessages');
  return function (dispatch) {
    dispatch(startFetchingMessages());
    const ref = dispatch(setRef());
    console.log(ref);
    firebase
      .database()
      .ref('messages')
      .orderByKey()
      .limitToLast(20)
      .on('value', (snapshot) => {
        // gets around Redux panicking about actions in reducers
        setTimeout(() => {
          const messages = snapshot.val() || [];

          //dispatch(receiveMessages(messages));
        }, 0);
      });
  };
};
