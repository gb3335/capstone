import {
  GET_JOURNAL,
  GET_JOURNALS,
  JOURNAL_LOADING,
  TOGGLE_JOURNAL_BIN,
  TOGGLE_JOURNAL_LIST
} from "../actions/types";

const initialState = {
  journal: {},
  journals: {},
  loading: false,
  bin: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case JOURNAL_LOADING:
      return {
        ...state,
        loading: true
      };
    case TOGGLE_JOURNAL_BIN:
      return {
        ...state,
        bin: true
      };
    case TOGGLE_JOURNAL_LIST:
      return {
        ...state,
        bin: false
      };
    case GET_JOURNAL:
      return {
        ...state,
        journal: action.payload,
        loading: false
      };
    case GET_JOURNALS:
      return {
        ...state,
        journals: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
