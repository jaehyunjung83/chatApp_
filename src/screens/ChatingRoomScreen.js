import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
  ImagePickerIOS,
} from 'react-native';
import axios from 'axios';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import storage from '@react-native-firebase/storage';
import { utils } from '@react-native-firebase/app';
import {
  fetchMessages,
  sendMessage,
  setMessageReceived,
} from '../actions/messageActions';
import DocumentPicker from 'react-native-document-picker';
import Toast from 'react-native-toast-message';
import { launchCamera, launchImageLibrary, ImagePicker } from 'react-native-image-picker';
// import Synology from '@ltaoo/synology';
import { Buffer } from 'buffer';
import _ from 'lodash';
var util = require('util');
// var fs = require('fs');
var RNFS = require('react-native-fs');
const files = RNFS.readDir(RNFS.DocumentDirectoryPath);
// const request = require('request');
// const request = require('../../request');
import RNFetchBlob from 'rn-fetch-blob';


export default function ChatingRoomScreen({ route }) {
  const { room } = route.params;

  const notifiedmessageid = [];
  if (route.params.notifiedmessage != undefined) {
    notifiedmessageid.push(route.params.notifiedmessage.notifiedmessageid);
  }
  const { data } = useSelector((state) => state.user);
  const { messagesList } = useSelector((state) => state.messages);
  const dispatch = useDispatch();

  const giftedChatRef = useRef();

  // setTimeout(() => {
  //   // giftedChatRef?.current?._messageContainerRef?.current?.scrollToEnd();
  //   giftedChatRef?.current?._messageContainerRef?.current?.scrollToItem({
  //     animated: true,
  //     item: messages[messages.length - 1],
  //     viewPosition: 1,
  //   });
  // }, 700);

  // console.log(route.params);
  // console.log(room);
  // console.log(messagesList);
  // if (route.params.notifiedmessage != undefined) {
  //   console.log(notifiedmessageid);
  // }
  useEffect(() => {
    dispatch(fetchMessages(room));
    //firebase.auth().signOut();
  }, []);

  useEffect(() => {
    dispatch(setMessageReceived(room));
  }, []);

  const [synosid, setSynoSid] = useState('');
  const protocol = 'https';
  const host = 're-ply.r-e.kr';
  const port = '5001';
  const authpath = 'auth.cgi?';
  const authapi = 'api=SYNO.API.Auth';
  const authapiversion = '3';
  const authmethod = 'method=login';
  const username = '정재현';
  const password = 'wjdwogus1@';

  const synoauth = async (synosid) => {
    const authurl = `${protocol}://${host}:${port}/webapi/${authpath}${authapi}&version=${authapiversion}&${authmethod}&account=${username}&passwd=${password}&session=FileStation&format=cookie`;
    // `https://re-ply.r-e.kr:5001/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=${username}&passwd=${password}&session=FileStation&format=cookie`;

    axios
      .get(authurl)
      .then(console.time('auth-req-res'))
      .then((res) => {
        // console.table(res.data);
        console.timeEnd('auth-req-res');
        setSynoSid(res.data.data.sid);
      });
  };

  useEffect(() => {
    synoauth();
  }, []);
  useEffect(() => {
    console.log('syno sid', synosid);
  }, [synosid]);

  const [notimsgidx, setNotiMsgIdx] = useState('0');

  if (route.params.notifiedmessage != undefined) {
    useEffect(() => {
      setNotiMsgIdx(messagesList.findIndex((e) => e._id == notifiedmessageid));
    }, [messagesList]);
  }
  const loadingComponent = () => {
    return (
      <View style={styles.loadingStyles}>
        <ActivityIndicator size="large" color="#255c99" />
      </View>
    );
  };

  const renderBubble = (props, message, data) => {
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
        tickStyle={{ color: props.currentMessage.received ? 'red' : 'white' }}
        // renderTicks={renderSentTicks}
      />
    );
  };

  const renderSendButton = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendingContainerStyles}>
          <IconButton icon="send-circle" size={32} color="black" />
        </View>
      </Send>
    );
  };

  const renderFileSendButton = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendingContainerStyles}>
          <IconButton icon="message-plus" size={32} color="crimson" />
        </View>
      </Send>
    );
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

  const [multipleFile, setMultipleFile] = useState('');
  const selectMultipleFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      console.table('ducupick', res);
      setMultipleFile(res);

      for (let i = 0; i < res.length; i++){
      if (res[i].type === 'video/*') {
        Toast.show({
          type: 'error',
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 60,
          text1: '📹 동영상 파일형식은 전송할 수 없습니다.🙈',
          text2: '링크 등을 이용하여 전송해주세요🔗'
        });
        setMultipleFile('');
      }
    };

    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        console.log('선택 취소');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const SynoUpload = async () => {
    // console.log('synoup에서 realPath', realpath);
    console.table('multipleFile', multipleFile);

    const url =
      //  `https://re-ply.r-e.kr:5001/webapi/entry.cgi?api=SYNO.FileStation.Upload&method=upload&version=2&_sid=${synosid}`;
      // 'http://94de-218-153-215-206.ngrok.io/rn-upload-multi';
      'http://re-ply.r-e.kr:3005/rn-upload-multi';

    

    const formdata = new FormData();
    for (let i = 0; i < multipleFile.length; i++) {
      // data.append('overwrite', 'false');
      // data.append('path', '/home/Drive');
      formdata.append('newfilename', data.userId + '_' + room._id +  '_' + multipleFile[i].name);
      formdata.append('file', multipleFile[i]);
    }

    const config = {
      method: 'post',
      url: url,
      headers: {
        Accept: 'application/json',
        'content-type': 'multipart/form-data',
      },
      data: formdata,
    };

    axios(config)
      .then(console.time('fileupload'))
      .then(function (response) {
        console.log(response);
        for (let j=0; j < response.data.data.length; j++){
          dispatch(sendMessage(room, '', 'https://re-ply.r-e.kr/Chatting_UploadFiles/' + response.data.data[j].name))
        }
        console.timeEnd('fileupload');
      })
      // .then(dispatch(sendMessage(room, '', uri)))
      .then(setMultipleFile(''))
      .then(console.log(multipleFile))
      .catch(function (error) {
        console.log(error);
      });
  

      };

  // helper method that is sends a message
  const sendMessageToStore = (newMessage) => {
    console.log('newMessage', newMessage);
    console.log(
      'sendtostore_multiplefile',
      multipleFile ? multipleFile : '파일첨부없음',
    );
    dispatch(sendMessage(room, newMessage[0]?.text, multipleFile[0]?.uri));
  };

  const renderCustomActions = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ marginRight: -5, marginTop: -5 }}>
          <IconButton
            style={{ marginBottom: 2 }}
            size={28}
            icon= {multipleFile ? "send" : "file-upload"}
            title='file'
            animated
            color="maroon"
            onPress={multipleFile ? SynoUpload : selectMultipleFile} 
          />
        </View>
      </View>
    ) 
  };

  (ref) => {
    if (ref != undefined) {
      ref._messageContainerRef.current._listRef._frames.scrollTo({
        offset: 100,
      });
    } else {
      ref._messageContainerRef.current.scrollToBottom();
    }
  };

  return (
    <GiftedChat
      ref={(ref) => {
        // instance = ref;
        // console.table('instance', instance);

        ref;
      }}
      // onScrollToIndexFailed={onScrollToIndexFailed}
      messages={messagesList}
      renderSend={renderSendButton}
      renderFileSend={renderFileSendButton}
      onSend={(newMessage, multipleFile) =>
        sendMessageToStore(newMessage, multipleFile)
      }
      user={{ _id: data.userId, name: data.email }}
      renderBubble={(data) => renderBubble(data)}
      placeholder={multipleFile? multipleFile[0].name : ''}
      showUserAvatar={false}
      alwaysShowSend={true}
      locale="tr"
      scrollToBottom
      scrollToBottomComponent={scrollToBottomIcon}
      renderLoading={loadingComponent}
      showAvatarForEveryMessage={false}
      renderAvatarOnTop={true}
      renderActions={renderCustomActions}
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
