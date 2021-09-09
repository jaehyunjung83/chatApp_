import {firestore, auth} from '../config/firebase';
import React, {useEffect} from 'react';
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

export const fetchMessagesSuccess = (fetchmessages) => ({
  type: 'FETCH_MESSAGES_SUCCESS',
  payload: fetchmessages,
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

// 받은 메시지 중 상대방이 보낸 메시지 received 처리
// recieved처리할게 없으면 success도출 안 하고 그냥 init에서 끝남
export const setMessageReceived = (room) => {
  return async (dispatch, getState) => {
    dispatch(setMessageReceivedInit());
    const {
      messages: {messagesList},
      user: {
        data: {userId}, //내 id
      },
    } = getState();
    messagesList.map((message) => {
      if (!message?.received && message?.user._id !== userId) {
        firestore()
          .collection('rooms')
          .doc(room._id)
          .collection('MESSAGES')
          .doc(message._id)
          .update({received: true})
          // 내가 아닌 user가 보낸 메시지 중 received: false인게 있어야 setMessageReceivedSuccess를 실행하는데
          // 모두 true 처리 되어있다면 success 처리 자체가 없어서 redux-logger에도 당연히 안 뜸!!
          .then(() => dispatch(setMessageReceivedSuccess()))
          .catch((error) => dispatch(setMessageReceivedFail(error)));
      }
    });
  };
};

export const sendMessage = (room, text, uri) => {
  console.log('sendmessage action text',text)
  return async (dispatch, getState) => {
    dispatch(sendMessageInit());
    const {
      user: {data},
    } = getState();
    try {
      console.log('fileuploadeduri', uri)
      
      await firestore()
        .collection('rooms')
        .doc(room._id)
        .collection('MESSAGES')
        .add(
          uri? 
          {
          text: text,
          image: uri,
          createdAt: new Date().getTime(),
          user: {
            _id: data.userId,
            name: data.email,
          },
          sent: true,
          received: false,
        } : 
        {
          text: text,
          createdAt: new Date().getTime(),
          user: {
            _id: data.userId,
            name: data.email,
          },
          sent: true,
          received: false,
        }
            )
      
  
      await firestore()
        .collection('rooms')
        .doc(room._id)
        .set(
          uri? 
          {
            latestMessage: {
              text: '📩 ',
              createdAt: new Date().getTime(),
            },
          } :
          {
            latestMessage: {
              text,
              createdAt: new Date().getTime(),
            },
          }
          ,
          {merge: true},
            );

      

      
      return dispatch(sendMessageSuccess());
    } catch (error) {
      return dispatch(sendMessageFail(error));
    }
  };
};

export const fetchMessages = (room) => {
  console.log('send message일때 fetch message 자동실행 여부', room)
  return async (dispatch, getState) => {
    dispatch(fetchMessagesInit());
    // const {
    //   messages: {messagesList},
    //   user: {
    //     data: {userId}, //내 id
    //   },
    // } = getState();
    try {
      await firestore()
        .collection('rooms')
        .doc(room._id)
        .collection('MESSAGES')
        .orderBy('createdAt', 'desc')
        .onSnapshot((querySnapshot) => {
          const fetchmessages = querySnapshot.docs.map((doc) => {
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
          return dispatch(fetchMessagesSuccess(fetchmessages));
        });
    } catch (error) {
      return dispatch(fetchMessagesFail(error));
    }
  };
};






const firestoreTransaction = async() => {
  
  
  const reconcilReference = await firestore()
  .doc(`rooms/UvTHR52PYAdLjSoteyqq`);
  const collectionReference = reconcilReference.collection('MESSAGES').doc('0sJXXHOspJhjH0cKOhJL');
  console.log("🚀 ~ file: messageActions.js ~ line 210 ~ firestoreTransaction ~ collection", collectionReference)

    return firestore().runTransaction(async transaction => {
      const messageSnapshot = await transaction.get(reconcilReference)
      console.log("🚀 ~ file: messageActions.js ~ line 202 ~ returnfirestore ~ messageSnapshot", messageSnapshot)
      
      const unreadSnapshot = await transaction.get(collectionReference)
      console.log("🚀 ~ file: messageActions.js ~ line 207 ~ returnfirestore ~ unreadSnapshot", unreadSnapshot)

      if (!unreadSnapshot.data().received) {
      transaction.update(reconcilReference, {
        unReadMessageCount: messageSnapshot.data().unReadMessageCount ? messageSnapshot.data().unReadMessageCount + 1 : 1,
      });
      } 
      else 
      {console.log(`${unreadSnapshot.data().text} ${unreadSnapshot.data().imgage}메시지를 상대방이 읽었음`)}
    });
          

  };
  firestoreTransaction()
  .then(()=> console.log('server changed'))
  .catch((err)=> console.error(err));