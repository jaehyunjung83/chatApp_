import {
  MESSAGES_FETCHED,
  ADD_MESSAGE,
  START_FETCHING_MESSAGES,
} from '../actions/actionTypes';

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

export default function userReducer(state = [], action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return {};
    case START_FETCHING_MESSAGES:
      return {};
    case MESSAGES_FETCHED:
      return {};
    default:
      return state;
  }
}
