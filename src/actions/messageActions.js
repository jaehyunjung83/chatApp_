import firebase from '../confiq/firebase';

export const setRef = () => {
  let senderUserId = firebase.currentUser();
  let recieverUserId = '1234';

  const uniRef = senderUserId + '/' + recieverUserId;
  return uniRef;
};

export const sendMessageInit = () => ({
  type: 'SEND_MESSAGE_INIT',
});

export const sendMessageSuccess = () => ({
  type: 'SEND_MESSAGE_SUCCESS',
});

export const sendMessageFail = (error) => ({
  type: 'SEND_MESSAGE_FAIL',
  payload: error,
});

export const fetchMessagesInit = () => ({
  type: 'FETCH_MESSAGES_INIT',
});

export const fetchMessagesSuccess = (messages) => ({
  type: 'FETCH_MESSAGES_SUCCESS',
  payload: messages,
});

export const fetchMessagesFail = (error) => ({
  type: 'FETCH_MESSAGES_FAIL',
  payload: error,
});

export const sendMessage = (room, text) => {
  return async (dispatch, getState) => {
    dispatch(sendMessageInit());
    const {user} = getState();

    try {
      await firebase
        .firestore()
        .collection('rooms')
        .doc(room._id)
        .collection('MESSAGES')
        .add({
          text,
          createdAt: new Date().getTime(),
          user: {
            _id: user.userId,
          },
        });
      await firebase
        .firestore()
        .collection('rooms')
        .doc(room._id)
        .set(
          {
            latestMessage: {
              text,
              createdAt: new Date().getTime(),
            },
          },
          {merge: true},
        );
      return dispatch(sendMessageSuccess());
    } catch (error) {
      return dispatch(sendMessageFail(error));
    }
  };
};

export const fetchMessages = (room) => {
  return async (dispatch, getState) => {
    dispatch(fetchMessagesInit());

    try {
      await firebase
        .firestore()
        .collection('rooms')
        .doc(room._id)
        .collection('MESSAGES')
        .orderBy('createdAt', 'desc')
        .onSnapshot((querySnapshot) => {
          const messages = querySnapshot.docs.map((doc) => {
            const firebaseData = doc.data();

            const data = {
              _id: doc.id,
              text: '',
              createdAt: new Date().getTime(),
              ...firebaseData,
            };

            if (!firebaseData.system) {
              data.user = {
                ...firebaseData.user,
              };
            }

            return data;
          });
          return dispatch(fetchMessagesSuccess(messages));
          //setMessages(messages);
        });
    } catch (error) {
      return dispatch(fetchMessagesFail(error));
    }
  };
};
