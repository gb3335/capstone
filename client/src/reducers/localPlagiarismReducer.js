import { PLAGIARISM_LOCAL, PLAGIARISM_LOCAL_LOADING, PLAGIARISM_LOCAL_ID, PLAGIARISM_LOCAL_PATTERN,PLAGIARISM_LOCAL_PATTERN_LOADING,PLAGIARISM_LOCAL_TEXT_ID, PLAGIARISM_LOCAL_SHOW_DETAILS,PLAGIARISM_LOCAL_HIDE_DETAILS } from "../actions/types";

const initialState = {
  output: {},
  docuId: "",
  textId: "",
  pattern: "",
  showDetails: false,
  patternLoading: false,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PLAGIARISM_LOCAL:
      return {
        ...state,
        // output: [...state.output, action.payload]
        output: action.payload,
        loading: false
      };
    case PLAGIARISM_LOCAL_LOADING:
      return {
        ...state,
        loading: true
      };
    case PLAGIARISM_LOCAL_ID:
      return {
        ...state,
        docuId: action.payload
      };
    case PLAGIARISM_LOCAL_TEXT_ID:
      return {
        ...state,
        textId: action.payload
      };
    case PLAGIARISM_LOCAL_PATTERN:
      return {
        ...state,
        pattern: action.payload,
        patternLoading: false
      };
    case PLAGIARISM_LOCAL_PATTERN_LOADING:
      return {
        ...state,
        patternLoading: true
      };
    case PLAGIARISM_LOCAL_SHOW_DETAILS:
      return {
        ...state,
        showDetails: true
      };
    case PLAGIARISM_LOCAL_HIDE_DETAILS:
      return {
        ...state,
        showDetails: false
      };
    default:
      return state;
  }
}
