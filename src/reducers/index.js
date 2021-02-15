import {combineReducers} from 'redux';

import user from './userReducer';
import messagesReducer from './messagesReducer';
import roomsReducer from './roomsReducer';

const rootReducer = combineReducers({
  user,
  messages: messagesReducer,
  rooms: roomsReducer,
});

export default rootReducer;
