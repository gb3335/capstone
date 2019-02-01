import {
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_PAGE_TITLE,
  PLAGIARISM_ONLINE
} from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    case GET_PAGE_TITLE:
      return {};
    case PLAGIARISM_ONLINE:
      return {};
    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
}
