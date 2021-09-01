const path = require('path');
// const Synology = require('./node_modules/@ltaoo/synology/index.js');
const Synology = require('./@ltaoo/synology/index.js');
// const Synology = require('synology');

const { ACCOUNT, PASSWD, HOST, PORT } = process.env;
const synology = new Synology({
  protocol: 'https',
  host: 're-ply.r-e.kr',
  port: 5001,
});

const init = async () => {
  try {
    const { Auth, FileStation } = synology;
    // login
    console.time('auth');
    await Auth.auth({
      username: '정재현',
      password: 'wjdwogus1@',
    });
    console.timeEnd('auth');
    console.time('upload');
    await FileStation.upload({
      path: '/home/Drive',
      overwrite: 'false',
      // file: path.join(__dirname, './example.jpg'),
      //   name: undefined,
      // name: 'package-lock.json',
      // file: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=317358076,3499491004&fm=173&app=49&f=JPEG?w=218&h=146&s=011E827D05D0DC635AA5A57B03004073',
      file: '/Users/jjh/Documents/ReactNative/chatkitty-example-react-native/package-lock.json',
      // name: 'hello.gif',
      
    });
    console.timeEnd('upload');
    console.log(FileStation.upload)
  } 
  catch (err) {
    console.error(err);
  }
};
init();
