import {
  ROOM_CREATE_FAIL,
  ROOM_CREATE_INIT,
  ROOM_CREATE_SUCCESS,
  FETCH_ROOMS_FAIL,
  FETCH_ROOMS_INIT,
  FETCH_ROOMS_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  loading: false,
  error: null,
  roomsList: [],
};

export default function roomsReducer(state = [], action) {
  switch (action.type) {
    case ROOM_CREATE_INIT:
      return {
        ...state,
        loading: true,
      };
    case ROOM_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ROOM_CREATE_FAIL:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case FETCH_ROOMS_INIT:
      return {
        ...state,
        loading: true,
      };
    case FETCH_ROOMS_SUCCESS:
      return {
        rooms: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_ROOMS_FAIL:
      return {
        ...state,
        loading: false,
        error: null,
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
