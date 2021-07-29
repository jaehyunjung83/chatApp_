const functions = require("firebase-functions");

const faker = require("faker");

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

// rnfirebase.io에 있는 oncall 예제는 안 됨! onrequest로 해야 emulator test가 됨
exports.listProducts = functions.https.onRequest((request, response) => {
  response.send(products);
});

exports.ListProducts = functions.https.onCall((data, context) => {
  const {page = 1, limit = 10} = data;

  const startAt = (page - 1) * limit;
  const endAt = startAt + limit;

  return products.slice(startAt, endAt);
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
