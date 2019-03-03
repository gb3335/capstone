import {
  GET_COLLEGE,
  GET_COLLEGES,
  COLLEGE_LOADING,
  TOGGLE_COLLEGE_BIN,
  TOGGLE_COLLEGE_LIST
} from "../actions/types";

const initialState = {
  college: {},
  colleges: {},
  loading: false,
  bin: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case COLLEGE_LOADING:
      return {
        ...state,
        loading: true
      };
    case TOGGLE_COLLEGE_BIN:
      return {
        ...state,
        bin: true
      };
    case TOGGLE_COLLEGE_LIST:
      return {
        ...state,
        bin: false
      };
    case GET_COLLEGE:
      return {
        ...state,
        college: action.payload,
        loading: false
      };
    case GET_COLLEGES:
      return {
        ...state,
        colleges: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
