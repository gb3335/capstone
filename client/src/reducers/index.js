import { combineReducers } from "redux";
import sidebarReducer from "./sidebarReducer";
import authReducer from "./authReducer";
import onlinePlagiarismReducer from "./onlinePlagiarismReducer";
import errorReducer from "./errorReducer";
import collegeReducer from "./collegeReducer";

export default combineReducers({
  sidebar: sidebarReducer,
  errors: errorReducer,
  auth: authReducer,
  onlinePlagiarism: onlinePlagiarismReducer,
  college: collegeReducer
});
