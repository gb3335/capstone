import {
  GET_JOURNAL,
  GET_JOURNALS,
  JOURNAL_LOADING,
  TOGGLE_JOURNAL_BIN,
  TOGGLE_JOURNAL_LIST,
  CHANGE_BUTTON_STATUS_JOURNAL,
  TOGGLE_SIDE_BY_SIDE_JOURNAL
} from "../actions/types";

const initialState = {
  journal: {},
  journals: {},
  loading: false,
  buttonDisable: false,
  bin: false,
  onSideBySide: false,


  //  research: {},
  // researches: {},
  // loading: false,
  // bin: false,
  // buttonDisable: false
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
    case CHANGE_BUTTON_STATUS_JOURNAL:
      return {
        ...state,
        buttonDisable: action.payload
      };
    case TOGGLE_SIDE_BY_SIDE_JOURNAL:
      return {
        ...state,
        onSideBySide: action.payload
      };
    default:
      return state;
  }
}
