import {
  USER_START_LOGIN,
  USER_FINISH_LOGIN,
  LOGIN_USER,
} from '../actions/actionTypes';

const initialState = {
  userId: null,
  loading: false,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_START_LOGIN:
      return {
        ...state,
        loading: true,
      };
    case USER_FINISH_LOGIN:
      return {
        ...state,
        loading: false,
      };
    case LOGIN_USER:
      return {
        ...state,
        userId: action.payload.userId,
      };
    default:
      return state;
  }
}
