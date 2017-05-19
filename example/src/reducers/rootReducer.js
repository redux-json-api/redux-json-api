import { combineReducers } from 'redux';
import { reducer as api } from 'redux-json-api';
import { reducer as posts } from './posts';

export default combineReducers({
  api,
  posts
});
