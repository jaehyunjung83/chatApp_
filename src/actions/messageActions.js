import {firestore, auth} from '../config/firebase';

export const setRef = () => {
  let senderUserId = auth().currentUser();
  let receiverUserId = '1234';

  const uniRef = senderUserId + '/' + receiverUserId;
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

export const setMessageReceivedInit = () => ({
  type: 'SET_MESSAGES_RECEIVED_INIT',
});

export const setMessageReceivedSuccess = (messages) => ({
  type: 'SET_MESSAGES_RECEIVED_SUCCESS',
});

export const setMessageReceivedFail = (error) => ({
  type: 'SET_MESSAGES_RECEIVED_FAIL',
  payload: error,
});

export const setMessageReceived = (room) => {
  return async (dispatch, getState) => {
    dispatch(setMessageReceivedInit());
    const {
      messages: {messagesList},
      user: {
        data: {userId},
      },
    } = getState();
    messagesList.map((message) => {
      if (!message.received && message.user._id !== userId) {
        firestore()
          .collection('rooms')
          .doc(room._id)
          .collection('MESSAGES')
          .doc(message._id)
          .update({received: true})
          .then(() => dispatch(setMessageReceivedSuccess()))
          .catch((error) => dispatch(setMessageReceivedFail(error)));
      }
    });
  };
};

export const sendMessage = (room, text) => {
  return async (dispatch, getState) => {
    dispatch(sendMessageInit());
    const {
      user: {data},
    } = getState();
    try {
      await firestore()
        .collection('rooms')
        .doc(room._id)
        .collection('MESSAGES')
        .add({
          text,
          createdAt: new Date().getTime(),
          user: {
            _id: data.userId,
            name: data.email,
          },
          sent: true,
          received: false,
        });
      await firestore()
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
      await firestore()
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
