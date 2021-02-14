import {
  USER_LOGIN_INIT,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT_FAIL,
  USER_LOGOUT_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  userId: null,
  loading: false,
  error: null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_INIT:
      return {
        ...state,
        loading: true,
      };
    case USER_LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        userId: action.payload,
      };
    case USER_LOGOUT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case USER_LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        userId: null,
      };
    default:
      return state;
  }
}
