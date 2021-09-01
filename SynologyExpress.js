var FormData = require('form-data');
var axios = require('axios');
var fs = require('fs');
var request = require('request');


var data = new FormData();
data.append(
  'file',
  fs.createReadStream(
    '/Users/jjh/Downloads/국민신문고.pdf',
  ),
);
// url로 직접 upload할 떄는 request필요!!
// data.append('file', request('https://re-ply.r-e.kr/firestore/car.gif'));


var config = {
  method: 'post',
  url: 'http://24b3-218-153-215-206.ngrok.io/rn-upload-multi',
  headers: {
    ...data.getHeaders(),
  },
  data: data,
};
console.log('🤣🤣config.data.uploadFile🤣🤣', config.data.uploadFile)
console.log('🤣🤣')
axios(config)
.then(console.time('express upload time'))
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    console.timeEnd('express upload time')
  })
  .catch(function (error) {
    console.log(error);
  });
