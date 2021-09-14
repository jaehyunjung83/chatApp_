import { firestore, auth } from '../config/firebase';
import React, { useEffect } from 'react';
import { SystemMessage } from 'react-native-gifted-chat';
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
      messages: { messagesList },
      user: {
        data: { userId }, //내 id
      },
    } = getState();
    messagesList.map((message) => {
      const NotMeUnRead = !message?.received && message?.user._id !== userId;
      if (!message?.received && message?.user._id !== userId) {
        firestore()
          .collection('rooms')
          .doc(room._id)
          .collection('MESSAGES')
          .doc(message._id)
          .update({ received: true })

          // 내가 아닌 user가 보낸 메시지 중 received: false인게 있어야 setMessageReceivedSuccess를 실행하는데
          // 모두 true 처리 되어있다면 success 처리 자체가 없어서 redux-logger에도 당연히 안 뜸!!
          .then(() => dispatch(setMessageReceivedSuccess()))
          // .then(() =>
          //   firestore().runTransaction(async (transaction) => {
          //     const MTR = (await transaction.get(firestore().collection('rooms').doc(room._id))).data().MeToRead;
          //     transaction.update(firestore().doc(`rooms/${room._id}`), {
          //       MeToRead: MTR? MTR - 1 : 0,
          //     });
          //   }),
          // )
          
          .catch((error) => dispatch(setMessageReceivedFail(error)));
      } else {
        console.log('안 읽은 메시지 없음!');
      }
    });
    await firestore()
      .collection('rooms')
      .doc(room._id)
      .update({MeToRead: 0})
  };
};

export const sendMessage = (room, text, uri) => {
  console.log('sendmessage action text', text);
  return async (dispatch, getState) => {
    dispatch(sendMessageInit());
    const {
      messages: { messagesList },
      user: { data },
    } = getState();
    try {
      console.log('fileuploadeduri', uri);

      await firestore()
        .collection('rooms')
        .doc(room._id)
        .collection('MESSAGES')
        .add(
          uri
            ? {
                text: text,
                image: uri,
                createdAt: new Date().getTime(),
                user: {
                  _id: data.userId,
                  name: data.email,
                },
                sent: true,
                received: false,
              }
            : {
                text: text,
                createdAt: new Date().getTime(),
                user: {
                  _id: data.userId,
                  name: data.email,
                },
                sent: true,
                received: false,
              },
        );

      await firestore()
        .collection('rooms')
        .doc(room._id)
        .set(
          uri
            ? {
                latestMessage: {
                  text: '📩 ',
                  createdAt: new Date().getTime(),
                },
              }
            : {
                latestMessage: {
                  text,
                  createdAt: new Date().getTime(),
                },
              },
          { merge: true },
        );


        const OTR = [];
      await 
      firestore()
      .collection('rooms')
      .doc(room._id)
      .collection('MESSAGES')
      .where('user._id', '==', data.userId)
      .where('received', '==', false)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          OTR.push(doc.data());
        });
      });
      console.log('OTR',OTR)
      await firestore()
      .collection('rooms')
      .doc(room._id)
      .update({OtherToRead: OTR.length});


      // try {
      //   await firestore().runTransaction(async (transaction) => {
      //     const OTR = (await transaction.get(firestore().collection('rooms').doc(room._id))).data().OtherToRead;
      //     transaction.update(firestore().doc(`rooms/${room._id}`), {
      //       OtherToRead:
      //       OTR > 0 ? OTR + 1 : 1,
      //     });
      //   });
      // } catch (error) {
      //   console.log(error);
      // }

      return dispatch(sendMessageSuccess());
    } catch (error) {
      return dispatch(sendMessageFail(error));
    }
  };
};

export const fetchMessages = (room) => {
  // console.log('send message일때 fetch message 자동실행 여부', room);
  return async (dispatch, getState) => {
    dispatch(fetchMessagesInit());
    const {
      user: {
        data: { userId }, //내 id
      },
    } = getState();
    try {

      const OTR = [];
      await 
      firestore()
      .collection('rooms')
      .doc(room._id)
      .collection('MESSAGES')
      .where('user._id', '==', userId)
      .where('received', '==', false)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          OTR.push(doc.data());
        });
      });
      console.log('OTR',OTR)
      await firestore()
      .collection('rooms')
      .doc(room._id)
      .update({OtherToRead: OTR.length});


      const MTR = [];
      await 
      firestore()
      .collection('rooms')
      .doc(room._id)
      .collection('MESSAGES')
      .where('user._id', '!=', userId)
      .where('received', '==', false)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          MTR.push(doc.data());
        })
        console.log('MTR', MTR);
      });
      await firestore()
      .collection('rooms')
      .doc(room._id)
      .update({MeToRead: MTR.length});


      
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
            // SystemMessage의 user는 그냥 아무거나 넣어서 state로 넣음
            if (!firebaseData.system) {
              data.user = {
                ...firebaseData.user,
              };
            }
            return data;
          });
          // console.log('fetchmessages', fetchmessages)
          return dispatch(fetchMessagesSuccess(fetchmessages));
        });


      
    

    } catch (error) {
      return dispatch(fetchMessagesFail(error));
    }
  };
};

// const firestoreTransaction = async() => {

//   const reconcilReference = await firestore()
//   .doc(`rooms/UvTHR52PYAdLjSoteyqq`);
//   const collectionReference = reconcilReference.collection('MESSAGES').doc('0sJXXHOspJhjH0cKOhJL');

//     return firestore().runTransaction(async transaction => {
//       const messageSnapshot = await transaction.get(reconcilReference)

//       const unreadSnapshot = await transaction.get(collectionReference)

//       if (!unreadSnapshot.data().received) {
//       transaction.update(reconcilReference, {
//         unReadMessageCount: messageSnapshot.data().unReadMessageCount ? messageSnapshot.data().unReadMessageCount + 1 : 1,
//       });
//       }
//       else
//       {console.log(`${unreadSnapshot.data().text} ${unreadSnapshot.data().imgage}메시지를 상대방이 읽었음`)}
//     });

//   };
//   firestoreTransaction()
//   .then(()=> console.log('server changed'))
//   .catch((err)=> console.error(err));
