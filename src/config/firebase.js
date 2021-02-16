import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyAdm_UJeGuY3vxv2ZjLuupS-LuJJZtxiKs',
  authDomain: 'chatapp-a0eae.firebaseapp.com',
  projectId: 'chatapp-a0eae',
  storageBucket: 'chatapp-a0eae.appspot.com',
  messagingSenderId: '978617145962',
  appId: '1:978617145962:web:1673da13b81138a9e6c813',
  measurementId: 'G-X7PQFGTWCZ',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
