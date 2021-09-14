# React Native Chat App Example

- Firebase Email-Password Auth,
- Redux for state management,
- Change password,
- Reset password,
- Toast messages for error or success actions,
- Validate E-mail and password
- React Hook Form
- Mark the message as sent, using one tick
- Mark the message as received, using two tick
- System Message
- Push Notification(For now via the Firebase console)

<p align="center">
    <img src="screenshots/signUp.png" alt="alt text" width="165" height="358">
    <img src="screenshots/signIn.png" alt="alt text"  width="165" height="358">
    <img src="screenshots/resetPassword.png" alt="alt text" width="165" height="358">
</p>
<p align="center">
    <img src="screenshots/addRoom.png" alt="alt text" width="165" height="358">
    <img src="screenshots/roomScreen.png" alt="alt text" width="165" height="358">
    <img src="screenshots/chatScreen.png" alt="alt text" width="165" height="358">
  </p>

## Installation

- 1- clone app
- 2- `npm install` in terminal project directory
- 3- Install and configure [@react-native-firebase](https://rnfirebase.io/#installation)
- 4- For IOS => go to /ios directory and run => `npx pod-install`

Don't forget [Create a Firebase project](https://console.firebase.google.com) and configure config/firebase.js file in project.

## Usage Libraries

- [React Redux](https://github.com/reduxjs/react-redux)
- [Redux](https://github.com/reduxjs/redux)
- [redux-thunk](https://github.com/reduxjs/redux-thunk)
- [@react-native-firebase](https://rnfirebase.io/)
- [@react-navigation](https://reactnavigation.org/)
- [react-hook-form](https://react-hook-form.com/)
- [react-native-toast-message](https://github.com/calintamas/react-native-toast-message#readme)
- [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)
- [react-native-gifted-chat](https://github.com/FaridSafi/react-native-gifted-chat)
- [react-native-config](https://github.com/luggit/react-native-config)
- [react-native-paper](https://github.com/callstack/react-native-paper)
- [react-native-push-notification](https://github.com/zo0r/react-native-push-notification)

# Will be added

- Push Notification for messages(Firebase Functions)
- User list for select to chatting
- Sending image, video, document and audio files

## References / Thanks

- [Chat app with React Native](https://amanhimself.dev/blog/chat-app-with-react-native-part-1/)
- [React Native’de Firebase ile Push Notification Gönderimi Nasıl Yapılır?](https://zaferayan.medium.com/react-nativede-firebase-ile-push-notification-g%C3%B6nderimi-8547f3b07ece)
- [React Native’de WebSocket kullanılarak bir chat uygulaması nasıl yapılır?](https://zaferayan.medium.com/react-nativede-websocket-kullan%C4%B1larak-bir-chat-uygulamas%C4%B1-nas%C4%B1l-yap%C4%B1l%C4%B1r-c2597fa5cd8e)

# ERRORS
##  Document-picker Error
```
- [!] CocoaPods could not find compatible versions for pod "react-native-document-picker":
  In Podfile:
    react-native-document-picker (from `../node_modules/react-native-document-picker`)
```
Specs satisfying the `react-native-document-picker (from `../node_modules/react-native-document-picker`)` dependency were found, but they required a higher minimum deployment target.

Answer]
https://github.com/rnmods/react-native-document-picker/issues/313#issuecomment-802975839


> Rollback to 3.4.0 version: `yarn add react-native-document-picker@3.4.0`
 
> Reinstall pods: `cd ios && pod deintegrate && pod install --repo-update`

> Update to version 3.5.1: `yarn add react-native-document-picker`

> Update pods without deintegrate: `cd ios && pod install --repo-update`

It works for me, thanks!


## java compile Error
> Task :@react-native-firebase_app:compileDebugJavaWithJavac FAILED
```
> Task :@react-native-firebase_app:compileDebugJavaWithJavac FAILED
15 actionable tasks: 1 executed, 14 up-to-date

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':@react-native-firebase_app:compileDebugJavaWithJavac'.
> java.lang.IllegalAccessError: class org.gradle.internal.compiler.java.ClassNameCollector (in unnamed module @0x4cf82a85) cannot access class com.sun.tools.javac.code.Symbol$TypeSymbol (in module jdk.compiler) because module jdk.compiler does not export com.sun.tools.javac.code to unnamed module @0x4cf82a85
```
#### java version이 호환이 안 되서 compile을 못하는 것임!
java16 version으로 되어있었는데 gradle 7.0.2 version하고 호환이 잘 안되서
java11 version(이게 젤 호환이 잘 되고 안정적이라고 함)으로 바꿔야 했음!!!

1. 자바 버전확인
   `java -version`
   ```
   (base) jjh@MacBook-Pro-3 ~ % java -version
    openjdk version "16.0.2" 2021-07-20
    OpenJDK Runtime Environment (build 16.0.2+7-67)
    OpenJDK 64-Bit Server VM (build 16.0.2+7-67, mixed mode, sharing)
    ```
    or `/usr/libexec/java_home -V`
    ```
    Matching Java Virtual Machines (3):
    16.0.2 (x86_64) "Oracle Corporation" - "OpenJDK 16.0.2" /Users/jjh/Library/Java/JavaVirtualMachines/openjdk-16.0.2/Contents/Home
    11.0.11 (x86_64) "AdoptOpenJDK" - "AdoptOpenJDK 11" /Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home
    1.8.301.09 (x86_64) "Oracle Corporation" - "Java" /Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home
    /Users/jjh/Library/Java/JavaVirtualMachines/openjdk-16.0.2/Contents/Home
    ```

2. 자바 버전 11로 바꿈

    `export JAVA_HOME=/Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home`

    or 

    `/Users/jjh/.bash_profile`의 `export JAVA_HOME=`을 

    `export JAVA_HOME=/Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home` 
    
    로 바꾸고 
    
    `source .bash_profile` or `/usr/libexec/java_home -V`

3. 그래도 안 바뀌었다면? java16을 sudo권한으로 rm -rf 로 폴더 직접 삭제 해야 함(휴지통도)

    `sudo rm -rf /Users/jjh/Library/Java/JavaVirtualMachines/openjdk-16.0.2/Contents/Home`

    그냥 폴더만 삭제했으면 finder에는 안 보이는데 

    `/usr/libexec/java_home -V`
    
    로 검색 시 계속 설치되어 남아있을 수 있음!!!


## rn-masked-view는 에러나서 지웠다가(안쓰는 모듈인 거 같애서) java version 수정하고 다시 빌드하니까 계속 있는 거로 나와서 그냥 다시 설치함

##  patch-package(node_modules 직접 수정 후 patch폴더에 수정 사항 남김)

### Set-up

In package.json
```
 "scripts": {
+  "postinstall": "patch-package"
 }
```
Then

**npm**
```
npm i patch-package
```

You can use --save-dev if you don't need to run npm in production, e.g. if you're making a web frontend.

### Usage

Making patches
First make changes to the files of a particular package in your node_modules folder, then run

use npx (included with npm > 5.2)

```
npx patch-package package-name
```

where package-name matches the name of the package you made changes to.

If this is the first time you've used patch-package, it will create a folder called patches in the root dir of your app. Inside will be a file called package-name+0.44.0.patch or something, which is a diff between normal old package-name and your fixed version. Commit this to share the fix with your team.

#   ngrok

synology 포트포워딩 및 방화벽 예외 허용 필요

최초 local에 authtoken 등록하기

```
ngrok authtoken 1xX2YQ18j7AAoRAjE7QVttJ2cFo_6APtpbgLFck2DCQSvG6YH
```

이후 localhost에 ngrok 적용하기
```
ngrok http 3000 (ExpressServer에 지정하고 synology에 포트포워딩, 방화벽 허용한 포트)
```


#   Firebase Emulator 사용법(FireStore Export or Import 포함)

<!-- you did not need to start billing in your firebase console. 
https://www.npmjs.com/package/firestore-export-import 

1. Get your service account key 

    Open Firebase console > Project settings > Service accounts > generate new private key

2. rename the downloaded file with serviceAccountKey.json

    -Now create a new folder and index.js file.

    -Paste you servicekey.json in this folder

    -Now install this package

3. npm install firestore-export-import


3. Exporting data from firebase

- anyname.js    -> node anyname.js

    ```
    const { initializeApp} =  require('firestore-export-import')

    const  serviceAccount  =  require('./serviceAccountKey.json')

    const  appName  =  '[DEFAULT]'

    initializeApp(serviceAccount, appName)

    const  fs  =  require('fs');

    const { backup } =  require('firestore-export-import')
    //backup('collection name')

    backup('users').then((data) =>
    {
        const  json  =  JSON.stringify(data);

        //where collection.json is your output file name.
        fs.writeFile('collection.json', json, 'utf8',()=>{

        console.log('done');

    })
    });
    ```


 - https://codebeautify.org/jsonviewer

    This anyname.js was just a very basic configuration which exports the whole collection with everything in it, read their documentation you could do queries and much more!

4. Importing data to firebase

    ```
    const { initializeApp,restore } =  require('firestore-export-import')

    const  serviceAccount  =  require('./serviceAccountKey.json')
    const  appName  =  '[DEFAULT]'

    initializeApp(serviceAccount, appName)
    restore('collection.json', {
    //where refs is an array of key items
        refs: ['users'],
        //autoParseDates to parse dates if documents have timestamps
        autoParseDates: true,

        },()=>{

    console.log('done');
    })
    ```
     -->


    - https://jsmobiledev.com/article/firebase-emulator/


1. Emulator 실행
```
firebase emulators:start
```
- function만 실행할 거면
```
firebase emulators:start-only functions
```
-->
```
(base) jjh@MacBook-Pro-3 functions % firebase emulators:start
i  emulators: Starting emulators: auth, functions, firestore, pubsub
⚠  functions: The following emulators are not running, calls to these services from the Functions emulator will affect production: database, hosting, storage
⚠  Your requested "node" version "14" doesn't match your global version "15"
⚠  firestore: Did not find a Cloud Firestore rules file specified in a firebase.json config file.
⚠  firestore: The emulator will default to allowing all reads and writes. Learn more about this option: https://firebase.google.com/docs/emulator-suite/install_and_configure#security_rules_configuration.
i  firestore: Firestore Emulator logging to firestore-debug.log
i  pubsub: Pub/Sub Emulator logging to pubsub-debug.log
⚠  ui: Emulator UI unable to start on port 4000, starting on 4001 instead.
i  ui: Emulator UI logging to ui-debug.log
i  functions: Watching "/Users/jjh/Documents/ReactNative/chatApp_/functions" for Cloud Functions...
>  admin initialized
✔  functions[us-central1-addMessage]: http function initialized (http://localhost:5001/djsl-9198c/us-central1/addMessage).
✔  functions[us-central1-listProducts]: http function initialized (http://localhost:5001/djsl-9198c/us-central1/listProducts).
✔  functions[us-central1-ListProducts]: http function initialized (http://localhost:5001/djsl-9198c/us-central1/ListProducts).
✔  functions[us-central1-MessageNotify]: firestore function initialized.
✔  functions[us-central1-createTeamMember]: firestore function initialized.

┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect your app. │
│ i  View Emulator UI at http://localhost:4001                │
└─────────────────────────────────────────────────────────────┘

┌────────────────┬────────────────┬─────────────────────────────────┐
│ Emulator       │ Host:Port      │ View in Emulator UI             │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Authentication │ localhost:5003 │ http://localhost:4001/auth      │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Functions      │ localhost:5001 │ http://localhost:4001/functions │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Firestore      │ localhost:5002 │ http://localhost:4001/firestore │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Pub/Sub        │ localhost:5004 │ n/a                             │
└────────────────┴────────────────┴─────────────────────────────────┘
  Emulator Hub running at localhost:4400
  Other reserved ports: 4500

Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files.
```

2. FireStore의 data 전체 가져오기

```
firestore-export --accountCredentials djsl-9198c-firebase-adminsdk-2cj0l-b59c845556(바꿔도됨).json --backupFile output.json(바꿔도됨)
```
-->
```
Starting Export 🏋️
Retrieving documents from rooms
Retrieving documents from userProfile
Retrieving documents from users
Retrieving documents from rooms/9qGpWJzCRVHN8NNPZko6/MESSAGES
Retrieving documents from rooms/Az5FoDJMobVm7Nr8CyrT/MESSAGES
Retrieving documents from rooms/xy34sisvrFN0rbLZjAjp/MESSAGES
Retrieving documents from rooms/UvTHR52PYAdLjSoteyqq/MESSAGES
Retrieving documents from rooms/mYPIj3VCNrZpET0DAiY4/MESSAGES
Retrieving documents from rooms/htijMyIpvJxiYaildS5z/MESSAGES
Results were saved to output.json
All done 🎉
```

3. FireStore data Emulator에 Import하기

```
firestore-import --accountCredentials djsl-9198c-firebase-adminsdk-2cj0l-b59c845556.json  --backupFile output.json 
```

```
About to import data 'output.json' to the 'djsl-9198c' firestore at '[database root]'.
 === Warning: This will overwrite existing data. Do you want to proceed? === 
✔ Proceed with import? (y/N) · true
Starting Import 🏋️
Writing documents for rooms
Writing documents for userProfile
Writing documents for users
Writing documents for rooms/9qGpWJzCRVHN8NNPZko6/MESSAGES
Writing documents for rooms/Az5FoDJMobVm7Nr8CyrT/MESSAGES
Writing documents for rooms/UvTHR52PYAdLjSoteyqq/MESSAGES
Writing documents for rooms/htijMyIpvJxiYaildS5z/MESSAGES
Writing documents for rooms/mYPIj3VCNrZpET0DAiY4/MESSAGES
Writing documents for rooms/xy34sisvrFN0rbLZjAjp/MESSAGES
All done 🎉
```

4. Emulator에 있는 data를 backup폴더에 내보내 놓기

```
firebase emulators:export ./emulators.backup
```
-->
```
i  Found running emulator hub for project djsl-9198c at http://localhost:4400
i  Creating export directory /Users/jjh/Documents/ReactNative/chatApp_/functions/emulators.backup
i  Exporting data to: /Users/jjh/Documents/ReactNative/chatApp_/functions/emulators.backup
✔  Export complete
```

5. Emulator 다시 시작 시

```
firebase emulators:start --import=./emulators.backup
```
-->
```
i  emulators: Starting emulators: auth, functions, firestore, pubsub
⚠  functions: The following emulators are not running, calls to these services from the Functions emulator will affect production: database, hosting, storage
⚠  Your requested "node" version "14" doesn't match your global version "15"


i  firestore: Importing data from /Users/jjh/Documents/ReactNative/chatApp_/functions/emulators.backup/firestore_export/firestore_export.overall_export_metadata


⚠  firestore: Did not find a Cloud Firestore rules file specified in a firebase.json config file.
⚠  firestore: The emulator will default to allowing all reads and writes. Learn more about this option: https://firebase.google.com/docs/emulator-suite/install_and_configure#security_rules_configuration.
i  firestore: Firestore Emulator logging to firestore-debug.log
i  auth: Importing config from /Users/jjh/Documents/ReactNative/chatApp_/functions/emulators.backup/auth_export/config.json
i  auth: Importing accounts from /Users/jjh/Documents/ReactNative/chatApp_/functions/emulators.backup/auth_export/accounts.json
i  pubsub: Pub/Sub Emulator logging to pubsub-debug.log
⚠  ui: Emulator UI unable to start on port 4000, starting on 4001 instead.
i  ui: Emulator UI logging to ui-debug.log
i  functions: Watching "/Users/jjh/Documents/ReactNative/chatApp_/functions" for Cloud Functions...
>  admin initialized
✔  functions[us-central1-addMessage]: http function initialized (http://localhost:5001/djsl-9198c/us-central1/addMessage).
✔  functions[us-central1-listProducts]: http function initialized (http://localhost:5001/djsl-9198c/us-central1/listProducts).
✔  functions[us-central1-ListProducts]: http function initialized (http://localhost:5001/djsl-9198c/us-central1/ListProducts).
✔  functions[us-central1-MessageNotify]: firestore function initialized.
✔  functions[us-central1-createTeamMember]: firestore function initialized.

┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect your app. │
│ i  View Emulator UI at http://localhost:4001                │
└─────────────────────────────────────────────────────────────┘

┌────────────────┬────────────────┬─────────────────────────────────┐
│ Emulator       │ Host:Port      │ View in Emulator UI             │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Authentication │ localhost:5003 │ http://localhost:4001/auth      │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Functions      │ localhost:5001 │ http://localhost:4001/functions │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Firestore      │ localhost:5002 │ http://localhost:4001/firestore │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Pub/Sub        │ localhost:5004 │ n/a                             │
└────────────────┴────────────────┴─────────────────────────────────┘
  Emulator Hub running at localhost:4400
  Other reserved ports: 4500

Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files.
 
>  admin initialized
```


# 미비점

> user별로 room 나눠서 넣기

> sender의 unreadmessagecount와 receiver의 unreadmessagecount 구분해서 넣기

> Emulator FireStore Functions 코드와 연동 안 되는 문제 해결

> Functions NotificationMessage가 여러번 오는 문제 해결
(route의 문제? functions의 문제?)

> Functions NotificationMessage를 실제 메시지 1로 count하는 문제 해결
(-> unreadmessagecount에 notification이 count되는 문제발생)

