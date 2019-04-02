import { combineReducers } from "redux";
import sidebarReducer from "./sidebarReducer";
import authReducer from "./authReducer";
import onlinePlagiarismReducer from "./onlinePlagiarismReducer";
import localPlagiarismReducer from "./localPlagiarismReducer";
import errorReducer from "./errorReducer";
import collegeReducer from "./collegeReducer";
import researchReducer from "./researchReducer";
import activityReducer from "./activityReducer";
import userReducer from "./userReducer";
import journalReducer from "./journalReducer";
import grammarReducer from "./grammarReducer";
import userlogsReducer from "./userlogsReducer";

export default combineReducers({
  sidebar: sidebarReducer,
  errors: errorReducer,
  auth: authReducer,
  onlinePlagiarism: onlinePlagiarismReducer,
  localPlagiarism: localPlagiarismReducer,
  college: collegeReducer,
  research: researchReducer,
  journal: journalReducer,
  activity: activityReducer,
  users: userReducer,
  grammar: grammarReducer,
  userlogs: userlogsReducer

});
