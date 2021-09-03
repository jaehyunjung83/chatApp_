import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
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
    const renderSentTicks = () => {
      if (
        props.currentMessage &&
        props.user &&
        props.currentMessage.user &&
        props.currentMessage.user._id !== props.user._id
      ) {
        return null;
      }
      if (
        props &&
        (props.currentMessage.sent ||
          props.currentMessage.received ||
          props.currentMessage.pending)
      ) {
        return (
          <View>
            {!!props.currentMessage.sent && (
              <Text style={{ color: 'black' }}></Text>
            )}
            {!!props.currentMessage.received && <Text style={[]}>읽음</Text>}
            {!!props.currentMessage.pending && <Text style={[]}>🕓</Text>}
          </View>
        );
      }
      return null;
    };

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
        tickStyle={{ color: props.currentMessage.received ? 'white' : 'red' }}
        renderTicks={renderSentTicks}
      />
    );
  };

  // const renderMessageImage = (props) => {
  //   return (
  //     <View
  //       style={{
  //         borderRadius: 15,
  //         padding: 2,
  //       }}
  //     >
  //       <ImageModal
  //         resizeMode="contain"
  //         style={{
  //           width: 200,
  //           height: 200,
  //           padding: 6,
  //           borderRadius: 15,
  //           resizeMode: "cover",
  //         }}
  //         source={{ uri: messagesList.image }}
  //       />
  //     </View>
  //   );
  // };

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
    console.log('newMessage', newMessage);
    console.log(
      'sendtostore_multiplefile',
      multipleFile.length > 0 ? multipleFile : '파일첨부없음',
    );
    dispatch(sendMessage(room, newMessage[0]?.text, multipleFile[0]?.uri));
    // if (multipleFile.length > 0) {
    //   dispatch(sendMessage(room, multipleFile[0].uri))
    //   // + dispatch(sendMessage(room, newMessage[0].text));
    // }
    // else {
    //   dispatch(sendMessage(room, newMessage[0].text, multipleFile[0].uri))
    //   }
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

  const renderCustomActions = (props) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ marginRight: -5 }} transparent dark>
          <IconButton icon="arrow-up" onPress={selectMultipleFile} />
        </View>
        <View style={{ marginHorizontal: -5 }} transparent dark>
          <IconButton icon="arrow-down" />
        </View>
      </View>
    );
  };

  const [multipleFile, setMultipleFile] = useState('');
  const [realpath, setRealPath] = useState('');
  const selectMultipleFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      // console.log('res : ' + JSON.stringify(res));
      // console.log('URI : ', res[0].uri);
      // console.log('Type : ', res[0].type);
      // console.log('File Name : ' , res[0].name);
      // console.log('File Size : ' , res[0].size);
      console.table(res);
      //Setting the state to show single file attributes
      // const newpath = res[0].uri.replace('content://', '');
      // console.log(
      //   '🚀 ~ file: ChatingRoomScreen.js ~ line 311 ~ selectMultipleFile ~ newpath',
      //   newpath,
      // );

      // const split = res[0].uri.split('/');
      // const name1 = split.pop();
      // const inbox = split.pop();
      // console.log(
      //   '🚀 ~ file: ChatingRoomScreen.js ~ line 316 ~ selectMultipleFile ~ inbox',
      //   inbox,
      // );
      // setRealPath(RNFetchBlob.fs.dirs.CacheDir + '/' + res[0].name);
      // console.log('realpath', realpath);

      // RNFetchBlob.fs
      //   .readFile(res[0].uri, 'base64', 10240000)
      //   .then((data) => {
      //     console.log(data);
      //     const dirs = RNFetchBlob.fs.dirs;

      //     // .writeFile(
      //     RNFetchBlob.fs.writeFile(realpath, data, 'base64').then(() => {
      //       console.log('file Writed!');
      //     });
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      const destPath = RNFS.DocumentDirectoryPath + '/' + res[0].name;
      await RNFS.copyFile(res[0].uri, destPath);

      setMultipleFile(res);
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

  // const MultiFileHandleSubmit = async () => {
  //   const fsfilepath = RNFS.DocumentDirectoryPath + '/' + multipleFile[0].name;

  //   RNFS.exists(fsfilepath)
  //     .then((success) => {
  //       if (success) {
  //         console.log(`${multipleFile[0].name} exists!!!`);
  //       }});

  //   try {
  //     await upload({
  //       overwrite: false,
  //       path: '/home/Drive',
  //       // file: path.join(__dirname, './example.jpg'),
  //       //   name: undefined,
  //       // name: multipleFile[0].name,
  //       // file: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=317358076,3499491004&fm=173&app=49&f=JPEG?w=218&h=146&s=011E827D05D0DC635AA5A57B03004073',
  //       file: fsfilepath,
  //       // name: 'hello.gif',

  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  // MultiFileHandleSubmit();

  if (multipleFile.length > 0) {
    const synoupload = async () => {
      // console.log('synoup에서 realPath', realpath);
      console.table('multipleFile', multipleFile[0]);

      const url =
      //  `https://re-ply.r-e.kr:5001/webapi/entry.cgi?api=SYNO.FileStation.Upload&method=upload&version=2&_sid=${synosid}`;
      'http://3351-218-153-215-206.ngrok.io/rn-upload-multi';

      // const [, type] = name.split('.');

      // const fsfilepath =
      //   RNFS.DocumentDirectoryPath + '/' + multipleFile[0].name;
      // console.log(
      //   '🚀 ~ file: ChatingRoomScreen.js ~ line 377 ~ synoupload ~ fsfilepath',
      //   fsfilepath,
      // );

      // const reservepath = '/home/Drive';

      // const rnfbreadfile = RNFetchBlob.fs.readFile(
      //   multipleFile[0].uri,
      //   'base64',
      // );
      // console.log(
      //   '🚀 ~ file: ChatingRoomScreen.js ~ line 379 ~ synoupload ~ rnfbreadfile',
      //   rnfbreadfile,
      // );
      // await upload({
      //   path: '/home/Drive',
      //   overwrite: 'false',
      //   // file: path.join(__dirname, './example.jpg'),
      //   //   name: undefined,
      //   // name: 'package-lock.json',
      //   // file: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=317358076,3499491004&fm=173&app=49&f=JPEG?w=218&h=146&s=011E827D05D0DC635AA5A57B03004073',
      //   file: multipleFile[0],
      //   // name: 'hello.gif',

      // });

      // console.log('type', type);
      // return new Promise(async (resolve, reject) => {

      // const r = request({ url }, resolve, reject);
      // const form = r.form();

      // const name = multipleFile[0].name;
      // // const [ , absolutepath ] = multipleFile[0].uri.split('//');
      // const absolutepath = RNFetchBlob.wrap(multipleFile[0].uri);

      // // RNFetchBlob.fs.readFile(RNFetchBlob.fs.dirs.DownloadDir +'/' + multipleFile[0].name, 'utf8')
      // //    .then((data) => {
      // //     console.log('read data', data)
      // //    })


      // const task = storage().ref('chatapp/').putFile(multipleFile[0].uri);
      // try {
      //   await task;
      // } catch(e) {
      //   console.log(e);
      // }




      // const formData = new FormData();
      // const rnfbreadstream = await RNFetchBlob.fs.readStream(
      //   multipleFile[0].fileCopyUri,
      // );
      // console.log(
      //   '🚀 ~ file: ChatingRoomScreen.js ~ line 442 ~ synoupload ~ rnfbreadstream',
      //   rnfbreadstream,
      // );

      // const RNFSReadfile = RNFS.readFile(fsfilepath, 'base64');
      // console.log(
      //   '🚀 ~ file: ChatingRoomScreen.js ~ line 418 ~ //returnnewPromise ~ RNFSReadfile',
      //   RNFSReadfile,
      // );

      var data = new FormData();
      // data.append('overwrite', 'false');
      // data.append('path', '/home/Drive');
      data.append('file', multipleFile[0]);

      var config = {
        method: 'post',
        url: url,
        headers: {
          // Cookie: `id=${synosid}`,
          // Accept: 'application/json',
          'content-type': 'multipart/form-data',
        },
        data: data,
      };

      axios(config)
        .then(console.time('fileupload'))
        .then(function (response) {
          console.log(response);
          console.timeEnd('fileupload');
        })
        .catch(function (error) {
          console.log(error);
        });



      // formData.append({
      //   name: multipleFile[0].name,
      //   data: rnfbreadstream,
      //   overwrite: false,
      //   // path: reservepath,
      //   file: multipleFile[0],

      // });

      // formData.append('file', RNFetchBlob.wrap(multipleFile[0].fileCopyUri), { type: 'text/csv' });
      // formData.append(
      //   'file', rnfbreadstream
      // )
      //   console.log(formData)

      // await axios
      //   .post(
      //     `https://re-ply.r-e.kr:5001/webapi/entry.cgi?api=SYNO.FileStation.Upload&method=upload&version=2&_sid=${synosid}`,
      //     // 'http://re-ply.r-e.kr:3000/rn-upload-multi',
      //     {
      //       headers: {
      //         Accept: 'application/json',
      //         'content-type': 'multipart/form-data',
      //       },
      //     },
      //     {files: formData},
      //   )
      //   .then((res) => console.log(res.data))
      //   .then((e) => console.log(e));

      // await axios({
      //   url: 'http://re-ply.r-e.kr:3000/rn-upload-multi',
      //   method: 'POST',
      //   data: formData,
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })
      //   .then((res) => console.log(res.data))
      //   .then((e) => console.log(e));

      // });

      // const fs = require('fs');
      // const javafs = fs.createReadStream(fsfilepath);
      // console.log("🚀 ~ file: ChatingRoomScreen.js ~ line 439 ~ synoupload ~ javafs", javafs)

      // const rnfbreadstream = await RNFetchBlob.fs.readStream(multipleFile[0].fileCopyUri, 'utf8');
      // console.log("🚀 ~ file: ChatingRoomScreen.js ~ line 442 ~ synoupload ~ rnfbreadstream", rnfbreadstream)

      // await RNFetchBlob
      // .fetch(
      //   'POST',
      //   // `https://re-ply.r-e.kr:5001/webapi/entry.cgi?api=SYNO.FileStation.Upload&method=upload&version=2&_sid=${synosid}`,
      //       url,
      //   {
      //     // Authorization : "xAfdk019UaLmxbDWPIlZtUOZmyJ-P3PKrquUVPjBAVUiLt9mkDODK8hJWH3xOdXtlvkyxTSsRTmPWzpEvyNPjU",
      //     otherHeader: 'file',
      //     // this is required, otherwise it won't be process as a multipart/form-data request

      //     // Accept: 'application/json',
      //     'Content-Type': 'multipart/form-data',
      //   },
      //   // formData,
      //   [
      //     {
      //       // overwrite: false,
      //       // path: reservepath,
      //       data: multipleFile[0].uri,
      //       // Change BASE64 encoded data to a file path with prefix `RNFetchBlob-file://`.
      //       // Or simply wrap the file path with RNFetchBlob.wrap().
      //       // file: fsfilepath,
      //     },
      //   ],
      // )
      // .then(console.time('upload'))
      // .then((res) => {
      //   console.log(res);
      //   console.timeEnd('upload');
      // })
      // .catch((err) => {
      //   console.log(err);
      // });



      // RNFS.readDir(RNFS.DocumentDirectoryPath).then((files) => {
      //   console.log(files);
      // });
      // const fsfilepath = RNFS.DocumentDirectoryPath + '/' + multipleFile[0].name;
      // console.log(
      //   '🚀 ~ file: ChatingRoomScreen.js ~ line 461 ~ synoupload ~ fsfilepath',
      //   fsfilepath,
      // );

      // RNFS.exists(fsfilepath)
      //   .then((success) => {
      //     if (success) {
      //       console.log('exists!!!');
      //       readFile(fsfilepath);
      //     } else {
      //       writeFile(fsfilepath);
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err.message, err.code);
      //   });
      // const readFile = (fsfilepath) => {
      //   RNFS.readFile(fsfilepath, 'base64')

      //     .then((res) => {
      //       console.log('read-res', res);
      //       setValue(res);
      //     })
      //     .catch((err) => {
      //       console.log('err: ', err.message, err.code);
      //     });
      // };
      // const writeFile = (fsfilepath) => {
      //   RNFS.writeFile(fsfilepath, 'utf8')
      //     .then(() => {
      //       console.log('writed');
      //     })
      //     .catch((err) => {
      //       console.log(err.message, err.code);
      //     });
      // };

      // const file = [
      //   {
      //     name: multipleFile[0].name,
      //     filename: multipleFile[0].name,
      //     filetype: multipleFile[0].type,
      //     // name: multipleFile[0].name,
      //     // overwrite: false,
      //     // path: reservepath,
      //     filepath: fsfilepath,
      //   },
      // ];
      // RNFS.uploadFiles({
      //   toUrl:
      //     // `https://re-ply.r-e.kr:5001/webapi/entry.cgi?api=SYNO.FileStation.Upload&method=upload&version=2&_sid=${synosid}`,
      //     'http://re-ply.r-e.kr:3000/rn-upload-multi',
      //   binaryStreamOnly: false,
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      //   // fields: reservepath,
      //   files: file,
      // })
      //   .promise.then((res) => {
      //     console.log('Response_내용:' + JSON.stringify(res));
      //     if (res.statusCode == 200) {
      //       console.log('FILES UPLOADED!:' + res.statusCode); // response.statusCode, response.headers, response.body
      //     } else {
      //       console.log(res);
      //     }
      //   })
      //   .catch((err) => {
      //     if (err.description === 'cancelled') {
      //       // cancelled by user
      //       console.log('Uploading Canceleed by User');
      //     }
      //   });

      // const rnfbreadstream = await RNFetchBlob.fs.readStream(
      //   multipleFile[0].uri,
      //   'base64',
      // );
      // console.log(
      //   '🚀 ~ file: ChatingRoomScreen.js ~ line 576 ~ synoupload ~ rnfbreadstream',
      //   rnfbreadstream,
      // );
      // try {
      //   let dataChunk = [];

      //   rnfbreadstream.open();

      //   rnfbreadstream.onData((chunk) => {
      //     const bufferChunk = Buffer.from(chunk, 'utf8').toJSON().data;
      //     dataChunk.push(...bufferChunk);
      //   });

      //   rnfbreadstream.onError((err) => {
      //     console.log(err);
      //     console.error('Error while read stream');
      //   });

      //   rnfbreadstream.onEnd(async () => {
      //     try {
      //       /**
      //        * My simple encryption algorithm
      //        * I just take the first and the last binary from the Buffer data
      //        *
      //        * It's only worked for small file size but won't work with a big file (out of memory)
      //        * like 10MB++, but I need it to work with large file size like 100MB, 300MB, 1GB+
      //        * if this is possible
      //        */
      //       const pattern = _.pullAt(dataChunk, [0, dataChunk.length - 1]);
      //       const encFile = Buffer.from(dataChunk, 'ascii').toString('base64');

      //       const saveLocation = RNFS.DocumentDirectoryPath;
      //       await RNFetchBlob.fs.writeFile(saveLocation, encFile, 'base64');

      //       console.warn('Encrypting is done :)');
      //     } catch (error) {
      //       console.log(error);
      //       console.error('Error while encrypting');
      //     }
      //   });
      // } catch (error) {
      //   console.log(error);
      //   console.error('Error start read stream');
      // }

      // const data = new FormData();
      // // data.append("overwrite", "false");
      // // data.append("path", "/home/Drive");
      // data.append('files', multipleFile[0].uri);

      // var xhr = new XMLHttpRequest();
      // xhr.withCredentials = true;

      // xhr.addEventListener('readystatechange', function () {
      //   if (this.readyState === 4) {
      //     console.log(this.responseText);
      //   }
      // });

      // // xhr.open("POST", `https://re-ply.r-e.kr:5001/webapi/entry.cgi?api=SYNO.FileStation.Upload&method=upload&version=2&_sid=${synosid}`);
      // // xhr.setRequestHeader("Cookie", `id=${synosid}`);
      // xhr.open('POST', 'http://re-ply.r-e.kr:3000/rn-upload-multi', true);
      // // xhr.setRequestHeader("content-type","multipart/form-data; charset=utf-8; boundary=" + Math.random().toString().substr(2));

      // xhr.send(data);
    };

    synoupload();

    // function SynologyUploadJava() {
    //   /*jshint validthis:true */
    //   var
    //     userParams =
    //       typeof arguments[0] === 'object' ? arguments[0] :
    //       {},
    //     callback =
    //       typeof arguments[1] === 'function' ? arguments[1] :
    //       typeof arguments[0] === 'function' ? arguments[0] :
    //       null,
    //     form = new FormData(),
    //     syno = this,
    //     data = [],
    //     dataLength = 0,
    //     query
    //   ;
    //   var params = {
    //     api             : 'SYNO.FileStation.Upload',
    //     method          : 'upload',
    //     version         : '1',
    //     overwrite       : 'false',
    //     create_parents  : 'true',
    //     dest_folder_path: '/home'
    //   };

    //   util._extend(params, userParams);

    //   for (var label in params) {
    //     form.append(label, params[label]);
    //   }

    //   form.on('data', function(chunk) {
    //     chunk = new Buffer(chunk);
    //     dataLength += chunk.length;
    //     data.push(chunk);
    //   });

    //   form.on('end', function() {
    //     query = syno.query({
    //       path   : '/webapi/FileStation/api_upload.cgi',
    //       method : 'POST',
    //       params : params,
    //       headers: {
    //         'Content-Type': 'multipart/form-data; boundary=' + form.getBoundary(),
    //         'Cookie'      : 'id=' + synosid
    //       },
    //       body   : Buffer.concat(data, dataLength + 2) // Magic number !
    //     }, callback || null);
    //   });

    //   form.submit('https' + '://' + 're-ply.r-e.kr' + ':' + 5001 + '/webapi/FileStation/api_upload.cgi');

    //   return query;
    // }
    // SynologyUploadJava();
  } else null;

  // const MultiFilehandleSubmit = () => {
  //   const files = multipleFile.uri;
  //   const handleSubmit = async () => {
  //     const formData = new FormData();
  //     const name = files.name;
  //     const [, type] = name.split('.');
  //     formData.append('file', { name, type: 'pdf', uri: files });
  //     try {
  //       const {
  //         data: { path },
  //       } = await axios.post('http://re-ply.r-e.kr/upload', formData, {
  //         headers: { 'content-type': 'multipart/form-data' },
  //       });
  //     } catch (e) {
  //       Alert.alert('Cant upload', 'Try later');
  //     }
  //   };
  //   return null;
  // };

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
      onSend={(newMessage, multipleFile) =>
        sendMessageToStore(newMessage) + setMultipleFile('')
      }
      user={{ _id: data.userId, name: data.email }}
      renderBubble={(data) => renderBubble(data)}
      placeholder={multipleFile.length > 0 ? multipleFile[0].type : '...'}
      showUserAvatar={false}
      renderSend={renderSendButton}
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
