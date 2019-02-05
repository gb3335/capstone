import {
  GET_RESEARCH,
  GET_RESEARCHES,
  RESEARCH_LOADING
} from "../actions/types";

const initialState = {
  research: {},
  researches: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RESEARCH_LOADING:
      return {
        ...state,
        loading: true
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
    default:
      return state;
  }
}
