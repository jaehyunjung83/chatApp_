const functions = require('firebase-functions');
const admin = require('firebase-admin');
const faker = require('faker');
const serviceAccount = require('./djsl-9198c-firebase-adminsdk-2cj0l-b59c845556.json');

// const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://djsl-9198c.firebaseio.com',
});

// admin.initializeApp(functions.config().functions);

console.log('admin initialized');

const db = admin.firestore();
db.collection('/rooms/AL63ayVAgyKY26ggT2pG/MESSAGES')
  .doc('1mcrGrdjs2qG3V6JIDAe')
  .onSnapshot((snap) => {
    console.log(snap);
  });
// const collections = ['rooms'];
// console.log(collections.length);
// for (let i = 0; i < collections.length; i++) {
//   const rawData = [];
//   rawData.push(fs.readFileSync('./ChatApp.json'));
//   const arr = JSON.stringify(JSON.parse(rawData));
//   console.log('arr', arr);
//   console.log('arr.length', arr.length);
//   for (let j = 0; j < arr.length; j++) {
//     db.collection(collections[i])
//       .add(arr[j])
//       .then((val) => console.log(val))
//       .catch((err) => console.log('ERRO: ', err));
//   }
// }

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin
    .firestore()
    .collection('messages')
    .add({ original: original });
  // Send back a message that we've successfully written the message
  console.log(original);
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// eslint-disable-next-line no-unused-vars
async function sendNotification() {
  // 삼성 갤럭시 폴드 device token
  const registrationToken =
    'fQw7nwfATbmFm6h8c5xEiA:APA91bET7ECcmOfnvdJ_9jTfibA0iw-Xj4qFNqft-FN7VZt0OCQ2U1ovk0dYl5E2t1jVrpYi4v54xA-59Hcr6CH2aCkycNmVpYfn8jqhpU1ti1lZ7iZR8OKId0UeYTTZj8Alcvb6dskT';

  const message = {
    notification: { title: 'Super title', body: 'this is a test' },
    token: registrationToken,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent notification:', response);
      return { success: true };
    })
    .catch((error) => {
      console.log('Error sending notification:', error);
    });

  return {
    success: true,
  };
}

// Initialize products array
const products = [];

// Max number of products
const LIMIT = 5;

// Push a new product to the array
for (let i = 0; i < LIMIT; i++) {
  products.push({
    products: faker.commerce.product(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
  });
}

// console.table(products);

// exports.hellowworld = functions.https.onRequest((request, response) => {
//   response.send("Before deploy Test");
// });

// http로 api test할 땐 oncall이 아니라 onrequest
exports.listProducts = functions.https.onRequest((request, response) => {
  response.send(products);
});

exports.ListProducts = functions.https.onCall((data, context) => {
  const { page = 1, limit = 10 } = data;

  const startAt = (page - 1) * limit;
  const endAt = startAt + limit;

  return products.slice(startAt, endAt);
});

exports.MessageNotify = functions.firestore
  // .document('/rooms/{collectionId}/MESSAGES/{documentId}')
  .document('/rooms/{documentId}/MESSAGES/{documentId}')
  .onUpdate(async (change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}

    const tokens = [
      // 삼성 갤럭시 폴드 device token
      'fQw7nwfATbmFm6h8c5xEiA:APA91bET7ECcmOfnvdJ_9jTfibA0iw-Xj4qFNqft-FN7VZt0OCQ2U1ovk0dYl5E2t1jVrpYi4v54xA-59Hcr6CH2aCkycNmVpYfn8jqhpU1ti1lZ7iZR8OKId0UeYTTZj8Alcvb6dskT',
      // 추가 등록가능
    ];

    const newValue = change.after.data();

    // ...or the previous value before this update
    const previousValue = change.before.data();
    console.log('prev', previousValue);
    console.log('changed to', newValue);
    console.log('context', context);
    const payLoad = {
      notification: {
        // user.name 없는 걸로 나옴!!! 수정해야 함!
        title: newValue.user.name,
        body: newValue.text ? newValue.text : newValue.image,
        sound: '1',
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        message: newValue.text,
        delivered_priority: 'high',
        type: 'Room',
        roomid: context.params.documentId,
        messageid: context.params.documentId,
        footage: context.timestamp,
      },
    };

    try {
      const response = await admin.messaging().sendToDevice(tokens, payLoad, {
        // Required for background/quit data-only messages on iOS
        contentAvailable: true,
        // Required for background/quit data-only messages on Android
        priority: 'high',
      });
      console.log('payLoad.notification', payLoad.notification);
      console.log('payLoad.data', payLoad.data);
      console.log('그림 type: ', typeof(payLoad.body));
      console.log('Notification Send succesfuully');
      return response;
    } catch (err) {
      console.log('Error sending notification');
      console.log(err);
    }
  });

exports.test = admin.firestore()
  .doc('/rooms/eOnbPL0z9APRdaiw09me/MESSAGES/4cNdSJWtc9YEbd1lMTgg')
  .update({ received: true });
  // .update({ received: false });
// 
exports.createTeamMember = functions.firestore
  .document('/teamProfile/{teamId}/teamMemberList/{newUserId}')
  .onUpdate(async (change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = change.after.data();

    // ...or the previous value before this update
    const previousValue = change.before.data();

    // access a particular field as you would any JS property
    const name = newValue.name;
    console.log('prev', previousValue);
    console.log('changed', newValue);

    // const updatedUser = await admin.auth().getUserByEmail(email);
    // console.log('firebase function에서 set한', updatedUser);
    // await admin.firestore().doc(`userProfile/${id}`).set({
    //   email: email,
    //   id: id,
    //   teamId: teamId,
    //   teamAdmin: false,
    // });

    return name;
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info('Hello logs!', {structuredData: true});
//   response.send('Hello from Firebase!');
// });

// Third function is to check the emulator trigger
exports.onWriteData = functions.firestore
  .document('emulatorTest/{docId}')
  .onWrite((change, context) => {
    console.log('its working');
    console.log(JSON.stringify(change.after.data()));
    return { response: change.after.data() };
  });
