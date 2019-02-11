import { combineReducers } from "redux";
import sidebarReducer from "./sidebarReducer";
import authReducer from "./authReducer";
import onlinePlagiarismReducer from "./onlinePlagiarismReducer";
import errorReducer from "./errorReducer";
import collegeReducer from "./collegeReducer";
import researchReducer from "./researchReducer";
import activityReducer from "./activityReducer";

export default combineReducers({
  sidebar: sidebarReducer,
  errors: errorReducer,
  auth: authReducer,
  onlinePlagiarism: onlinePlagiarismReducer,
  college: collegeReducer,
  research: researchReducer,
  activity: activityReducer
});
