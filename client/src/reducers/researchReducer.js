import {
  GET_RESEARCH,
  GET_RESEARCHES,
  RESEARCH_LOADING,
  TOGGLE_RESEARCH_BIN,
  TOGGLE_RESEARCH_LIST,
  CHANGE_BUTTON_STATUS_RESEARCH
} from "../actions/types";

const initialState = {
  research: {},
  researches: {},
  loading: false,
  bin: false,
  buttonDisable: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RESEARCH_LOADING:
      return {
        ...state,
        loading: true
      };
    case TOGGLE_RESEARCH_BIN:
      return {
        ...state,
        bin: true
      };
    case TOGGLE_RESEARCH_LIST:
      return {
        ...state,
        bin: false
      };
    case GET_RESEARCH:
      return {
        ...state,
        research: action.payload,
        loading: false
      };
    case GET_RESEARCHES:
      return {
        ...state,
        researches: action.payload,
        loading: false
      };
    case CHANGE_BUTTON_STATUS_RESEARCH:
      return {
        ...state,
        buttonDisable: action.payload
      };
    default:
      return state;
  }
}
