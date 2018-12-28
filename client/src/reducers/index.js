import { combineReducers } from 'redux';
import sidebarReducer from './sidebarReducer';
import authReducer from './authReducer';
import plagiarismReducer from './plagiarismReducer';
import errorReducer from './errorReducer';

export default combineReducers({
    sidebar: sidebarReducer,
    errors: errorReducer,
    auth: authReducer,
    plagiarism: plagiarismReducer
});