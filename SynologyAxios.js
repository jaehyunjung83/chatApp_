const fetch = require('node-fetch');
var FormData = require('form-data');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var axios = require('axios');
var fs = require('fs');

var data = new FormData();
data.append('overwrite', 'false');
data.append('path', '/home/Drive');
data.append(
  'file',
  fs.createReadStream(
    '/Users/jjh/Documents/ReactNative/chatkitty-example-react-native/package-lock.json',
  ),
  // 'https://re-ply.r-e.kr/firestore/transaction.png'
);

console.log(data);

const fscreatereadstrem = fs.createReadStream(
  '/Users/jjh/Documents/ReactNative/chatkitty-example-react-native/package-lock.json',
);
// console.log(
//   '🚀 ~ file: SynologyAxios.js ~ line 14 ~ fscreatereadstrem',
//   fscreatereadstrem,
// );

var config = {
  method: 'post',
  url: 'https://re-ply.r-e.kr:5001/webapi/entry.cgi?api=SYNO.FileStation.Upload&method=upload&version=2&_sid=AuynTkJ9CvyYNUDCC2fDBnPa4GHSMgQTql-dZ3S-aKY8Y2Nm9S9IxumUGeERXNwUjkw5QyMqRJ_uy-CE3vCw7M',
  headers: {
    Cookie:
      'id=AuynTkJ9CvyYNUDCC2fDBnPa4GHSMgQTql-dZ3S-aKY8Y2Nm9S9IxumUGeERXNwUjkw5QyMqRJ_uy-CE3vCw7M',
    ...data.getHeaders(),
  },
  data: data,
};

axios(config)
  .then(console.time('fileupload'))
  .then(function (response) {
    console.log(JSON.stringify('success: ' + response.data.success));
    console.timeEnd('fileupload')
  })
  .catch(function (error) {
    console.log(error);
  });
