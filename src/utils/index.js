import firebaseConfig from '../config/firebase';
import {messaging} from '../config/firebase';

export const emailValid = (email) => {
  const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
  return emailRegex.test(email);
};

export const getToken = async () => {
  const token = await messaging().getToken(firebaseConfig.messagingSenderId);

  return token;
};
