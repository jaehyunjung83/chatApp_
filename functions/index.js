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


console.table(products);

exports.hellowworld = functions.https.onRequest((request, response) => {
  response.send("Before deploy Test");
});

exports.listProducts = functions.https.onCall((data, context) => {
//   functions.logger.log("products", products);
  return products;
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
