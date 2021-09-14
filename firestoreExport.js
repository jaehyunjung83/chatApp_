const { initializeApp } = require('firestore-export-import');

const serviceAccount = require('./functions/djsl-9198c-firebase-adminsdk-2cj0l-b59c845556.json');

const appName = '[DEFAULT]';

initializeApp(serviceAccount, appName);

const fs = require('fs');

const { backup } = require('firestore-export-import');
//backup('collection name')

backup('rooms').then((data) => {
  const json = JSON.stringify(data);

  //where collection.json is your output file name.
  fs.writeFile('ChatApp.json', json, 'utf8', () => {
    console.log('done');
  });
});
