import {
  GET_USERLOGS,
  USER_LOADING
} from "../actions/types";

const initialState = {
  userlogs: {},
  loading: false

};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_USERLOGS:
      return {
        ...state,
        userlogs: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
