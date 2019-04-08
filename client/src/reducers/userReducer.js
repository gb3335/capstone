import {
  GET_USER,
  GET_USERS,
  USER_LOADING,
  TOGGLE_USERS_BLOCK,
  TOGGLE_USERS_LIST,
  CHANGE_USER_BUTTON_STATUS
} from "../actions/types";

const initialState = {
  user: {},
  users: {},
  loading: false,
  blocked: false,
  buttonDisable: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false
      };
    case TOGGLE_USERS_BLOCK:
      return {
        ...state,
        blocked: true
      };
    case TOGGLE_USERS_LIST:
      return {
        ...state,
        blocked: false
      };
    case CHANGE_USER_BUTTON_STATUS:
      return {
        ...state,
        buttonDisable: action.payload
      };
    case GET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
