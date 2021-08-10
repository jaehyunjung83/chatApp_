// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
//import 'dayjs/locale/tr';

import {
  fetchMessages,
  sendMessage,
  setMessageReceived,
} from '../actions/messageActions';

export default function ChatingRoomScreen({ route }) {
  console.table(route);
  const { room } = route.params;

  const notifiedmessageid = [];
  if (route.params.notifiedmessage != undefined) {
    notifiedmessageid.push(route.params.notifiedmessage.notifiedmessageid);
  }
  const { data } = useSelector((state) => state.user);
  const { messagesList } = useSelector((state) => state.messages);
  const dispatch = useDispatch();

  const giftedChatRef = useRef();
  console.log(
    '🚀 ~ file: ChatingRoomScreen.js ~ line 33 ~ ChatingRoomScreen ~ giftedChatRef',
    giftedChatRef,
  );
  // console.log("🚀 ~ file: ChatingRoomScreen.js ~ line 33 ~ ChatingRoomScreen ~ giftedChatRef", giftedChatRef)

  // setTimeout(() => {
  //   // giftedChatRef?.current?._messageContainerRef?.current?.scrollToEnd();
  //   giftedChatRef?.current?._messageContainerRef?.current?.scrollToItem({
  //     animated: true,
  //     item: messages[messages.length - 1],
  //     viewPosition: 1,
  //   });
  // }, 700);

  console.log(route.params);
  console.log(room);
  console.log(messagesList);
  if (route.params.notifiedmessage != undefined) {
    console.log(notifiedmessageid);
  }
  useEffect(() => {
    dispatch(fetchMessages(room));
    //firebase.auth().signOut();
  }, []);

  useEffect(() => {
    dispatch(setMessageReceived(room));
  }, [messagesList]);

  const [notimsgidx, setNotiMsgIdx] = useState('0');

  if (route.params.notifiedmessage != undefined) {
    useEffect(() => {
      setNotiMsgIdx(messagesList.findIndex((e) => e._id == notifiedmessageid));
    }, [messagesList]);
    console.log(
      '🚀 ~ file: ChatingRoomScreen.js ~ line 37 ~ ChatingRoomScreen ~ notimsgidx',
      notimsgidx,
    );
  }
  const loadingComponent = () => {
    return (
      <View style={styles.loadingStyles}>
        <ActivityIndicator size="large" color="#255c99" />
      </View>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: 'slategray',
          },
          left: {
            // Here is the color change
            backgroundColor: '#255c99',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
          left: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const renderSendButton = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendingContainerStyles}>
          <IconButton icon="send-circle" size={32} color="#6646ee" />
        </View>
      </Send>
    );
  };
  // helper method that is sends a message
  const sendMessageToStore = (newMessage) => {
    dispatch(sendMessage(room, newMessage[0].text));
  };

  const scrollToBottomIcon = () => {
    return (
      <View style={styles.scrollToIconStyles}>
        <IconButton icon="arrow-down" size={36} color="#6646ee" />
      </View>
    );
  };

  const renderSystemMessage = (props) => {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  };

  // function onScrollToIndexFailed(notimsgidx) {
  //   console.log('scrollfailed');
  //   const wait = new Promise((resolve) => setTimeout(resolve, 100));
  //   wait.then((instance) => {
  //     if (notimsgidx !== -1) {
  //       instance._messageContainerRef.current.scrollToIndex({
  //         index: notimsgidx,
  //         viewOffset: 0,
  //         viewPosition: 1,
  //       });
  //     }
  //     else null;
  //   });
  // }
  // useEffect(() => {
  //   instance._messageContainerRef.current._listRef._frames;
  // },[]);
  (ref) => {
    if (ref != undefined) {
      ref._messageContainerRef.current._listRef._frames.scrollTo({offset:100})
    }
    else {
      ref._messageContainerRef.current.scrollToBottom()
    }
  };
  

  return (
    <GiftedChat
      ref={(ref) => {
        // instance = ref;
        // console.table('instance', instance);

        ref;
        console.log('ref', ref);
        
      }}
      // onScrollToIndexFailed={onScrollToIndexFailed}
      messages={messagesList}
      onSend={(newMessage) => sendMessageToStore(newMessage)}
      user={{ _id: data.userId, name: data.email }}
      renderBubble={renderBubble}
      placeholder="..."
      showUserAvatar={false}
      renderSend={renderSendButton}
      alwaysShowSend={false}
      locale="tr"
      scrollToBottom
      scrollToBottomComponent={scrollToBottomIcon}
      renderLoading={loadingComponent}
      renderSystemMessage={renderSystemMessage}
    />
  );
}

const styles = StyleSheet.create({
  sendingContainerStyles: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollToIconStyles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  systemMessageWrapper: {
    backgroundColor: '#556677',
    borderRadius: 4,
    padding: 5,
  },
});
