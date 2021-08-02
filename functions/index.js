const functions = require('firebase-functions');
const admin = require('firebase-admin');
const faker = require('faker');

const serviceAccount = require('./djsl-9198c-firebase-adminsdk-2cj0l-b59c845556.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://djsl-9198c.firebaseio.com',
});

// admin.initializeApp(functions.config().functions);

console.log('admin initialized');

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
  .document('/rooms/htijMyIpvJxiYaildS5z/MESSAGES/{documentId}')
  // .onCreate(async (snapshot, context) => {
  //   if (snapshot.empty) {
  //     console.log('No new Messages');
  //     return;
  //   }
  //   const tokens = [
  //     'fQw7nwfATbmFm6h8c5xEiA:APA91bET7ECcmOfnvdJ_9jTfibA0iw-Xj4qFNqft-FN7VZt0OCQ2U1ovk0dYl5E2t1jVrpYi4v54xA-59Hcr6CH2aCkycNmVpYfn8jqhpU1ti1lZ7iZR8OKId0UeYTTZj8Alcvb6dskT',
  //   ];
  //   newData = snapshot.data();
  //   console.log(newData);
  //   const payLoad = {
  //     notification: {
  //       body: 'Body Push',
  //       title: 'Cloud function',
  //       sound: 'default',
  //     },
  //     data: {
  //       click_action: 'FLUTTER_NOTIFICATION_CLICK',
  //       message: newData.message,
  //     },
  //   };
  //   try {
  //     const response = await admin.messaging().sendToDevice(tokens, payLoad);
  //     console.log('Notification Send succesfuully');
  //     return response;
  //   } catch (err) {
  //     console.log('Error sending notification');
  //   }
  // })
  .onUpdate(async (change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const tokens = [
      'fQw7nwfATbmFm6h8c5xEiA:APA91bET7ECcmOfnvdJ_9jTfibA0iw-Xj4qFNqft-FN7VZt0OCQ2U1ovk0dYl5E2t1jVrpYi4v54xA-59Hcr6CH2aCkycNmVpYfn8jqhpU1ti1lZ7iZR8OKId0UeYTTZj8Alcvb6dskT',
    ];
    const newValue = change.after.data();

    // ...or the previous value before this update
    const previousValue = change.before.data();
    console.log('prev', previousValue);
    console.log('changed', newValue);

    const payLoad = {
      notification: {
        body: 'Body Push',
        title: 'Cloud function',
        sound: 'default',
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        message: newValue.text,
      },
    };

    try {
      const response = await admin.messaging().sendToDevice(tokens, payLoad);
      console.log('Notification Send succesfuully');
      return response;
    } catch (err) {
      console.log('Error sending notification');
    }
  });

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
