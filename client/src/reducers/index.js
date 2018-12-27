import { combineReducers } from 'redux';
import sidebarReducer from './sidebarReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';

export default combineReducers({
    sidebar: sidebarReducer,
    errors: errorReducer,
    auth: authReducer
});