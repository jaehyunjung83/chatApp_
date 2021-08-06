// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
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
  const { notifiedmessageid } = route.params.notifiedmessage;
  const { data } = useSelector((state) => state.user);
  const { messagesList } = useSelector((state) => state.messages);
  const dispatch = useDispatch();

  console.log(route.params);
  console.log(room);
  console.log(messagesList);
  console.log(notifiedmessageid)
  const notifiedmessage = messagesList.findIndex(e=>e._id == notifiedmessageid);
  console.log("🚀 ~ file: ChatingRoomScreen.js ~ line 33 ~ ChatingRoomScreen ~ notifiedmessage", notifiedmessage)
  
  useEffect(() => {
    dispatch(fetchMessages(room));
    //firebase.auth().signOut();
  }, []);

  useEffect(() => {
    dispatch(setMessageReceived(room));
  }, [messagesList]);

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
            backgroundColor: '#6646ee',
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

    setTimeout(() => {
      instance._messageContainerRef.current.scrollToIndex({index: notifiedmessage, viewOffset: 0, viewPosition: 0, animated : true});
  }, 100);

  return (
    <GiftedChat
      ref={(c) => {
        instance = c;
      }}
      // onScrollToIndexFailed={notifiedmessage => {
      //   const wait = new Promise(resolve => setTimeout(resolve, 300));
      //   wait.then(() => {
      //     instance._messageContainerRef.current.scrollToIndex({index: notifiedmessage, viewOffset: 0, viewPosition: 1});
      // }, 300)}}
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
