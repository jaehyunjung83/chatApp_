import {combineReducers} from 'redux';

import user from './userReducer';
import messages from './messagesReducer';
import rooms from './roomsReducer';

const rootReducer = combineReducers({
  user,
  messages,
  rooms,
});

export default rootReducer;
