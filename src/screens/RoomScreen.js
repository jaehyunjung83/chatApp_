// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import {IconButton} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
//import 'dayjs/locale/tr';

import {
  fetchMessages,
  sendMessage,
  setMessageReceived,
} from '../actions/messageActions';

export default function RoomScreen({route}) {
  const {room} = route.params;
  const {data} = useSelector((state) => state.user);
  const {messagesList} = useSelector((state) => state.messages);
  const dispatch = useDispatch();

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
            backgroundColor: '#255c99',
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

  return (
    <GiftedChat
      messages={messagesList}
      onSend={(newMessage) => sendMessageToStore(newMessage)}
      user={{_id: data.userId, name: data.email}}
      renderBubble={renderBubble}
      placeholder="Type your message here..."
      showUserAvatar
      renderSend={renderSendButton}
      alwaysShowSend
      //locale="tr"
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
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5,
  },
});
