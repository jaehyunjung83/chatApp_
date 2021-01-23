import firebase from '../confiq/firebase';

export const login = () => {
  console.log('login');
  return (dispatch, getState) => {
    dispatch(startLogin());

    firebase
      .auth()
      .signInAnonymously()
      .then(async ({user}) => {
        console.log('user_1', user);

        // console.log('deviceinfo', DeviceInfo.getUniqueId());
        //const {name, avatar} = getState().user;
        firebase.database().ref(`users/${user.uid}`).set({
          uid: user.uid,
        });
        console.log('user_2', user);

        dispatch(setUserData(user.uid));
        dispatch(finishLogin());

        // startChatting(dispatch);
      });
  };
};

export const startLogin = () => ({
  type: 'USER_START_LOGIN',
});
export const finishLogin = () => ({
  type: 'USER_FINISH_LOGIN',
});
export const setUserData = (userId) => ({
  type: 'LOGIN_USER',
  payload: userId,
});
