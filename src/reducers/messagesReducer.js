import {
  SEND_MESSAGE_FAIL,
  SEND_MESSAGE_INIT,
  SEND_MESSAGE_SUCCESS,
  FETCH_MESSAGES_FAIL,
  FETCH_MESSAGES_INIT,
  FETCH_MESSAGES_SUCCESS,
  SET_MESSAGES_RECEIVED_INIT,
  SET_MESSAGES_RECEIVED_FAIL,
  SET_MESSAGES_RECEIVED_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  loading: false,
  error: null,
  messagesList: [],
};

export default function messagesReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_MESSAGE_INIT:
      return {
        ...state,
        loading: true,
      };
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case SEND_MESSAGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case FETCH_MESSAGES_INIT:
      return {
        ...state,
        loading: true,
      };
    case FETCH_MESSAGES_SUCCESS:
      return {
        messagesList: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_MESSAGES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SET_MESSAGES_RECEIVED_INIT:
      return {
        ...state,
      };
    case SET_MESSAGES_RECEIVED_SUCCESS:
      return {
        ...state,
      };
    case SET_MESSAGES_RECEIVED_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

// const initialState = {
//   loading: false,
//   _id: 1,
//   text: 'My message',
//   createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
//   user: {
//     _id: 2,
//     name: 'React Native',
//     avatar: 'https://facebook.github.io/react/img/logo_og.png',
//   },
//   image: 'https://facebook.github.io/react/img/logo_og.png',
//   // You can also add a video prop:
//   video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//   // Mark the message as sent, using one tick
//   sent: true,
//   // Mark the message as received, using two tick
//   received: true,
//   // Mark the message as pending with a clock loader
//   pending: true,
//   // Any additional custom parameters are passed through
// };
