import firebase from '../confiq/firebase';

const loginUser = async () => {
  try {
    const {user} = await firebase.auth().signInAnonymously();
    return user;
  } catch (error) {
    return error;
  }
};

export const login = () => {
  return async (dispatch, getState) => {
    dispatch(userLoginInit());
    try {
      const user = await loginUser();
      return dispatch(userLoginSuccess(user.uid));
    } catch (error) {
      return dispatch(userLoginFail(error));
    }
  };
};

export const logOut = () => {
  return async (dispatch) => {
    try {
      await firebase.auth().signOut();
      return dispatch(logOutSuccess());
    } catch (error) {
      return dispatch(logOutFail(error));
    }
  };
};

export const checkAuthState = () => {
  return async (dispatch) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        return dispatch(userLoginSuccess(user.uid));
      }
      return dispatch(login());
    });
  };
};

export const userLoginInit = () => ({
  type: 'USER_LOGIN_INIT',
});
export const userLoginFail = (error) => ({
  type: 'USER_LOGIN_FAIL',
  payload: error,
});
export const userLoginSuccess = (userId) => ({
  type: 'USER_LOGIN_SUCCESS',
  payload: userId,
});

export const logOutSuccess = () => ({
  type: 'USER_LOGOUT_SUCCESS',
});

export const logOutFail = (error) => ({
  type: 'USER_LOGOUT_FAIL',
  payload: error,
});
