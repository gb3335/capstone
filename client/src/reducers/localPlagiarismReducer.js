import { PLAGIARISM_LOCAL, PLAGIARISM_LOCAL_SET_JOURNAL, PLAGIARISM_LOCAL_PATTERN_HIDE, PLAGIARISM_LOCAL_GLOBAL_CHECK, PLAGIARISM_LOCAL_LOADING, PLAGIARISM_LOCAL_ID, PLAGIARISM_LOCAL_PATTERN, PLAGIARISM_LOCAL_PATTERN_LOADING, PLAGIARISM_LOCAL_TEXT_ID, PLAGIARISM_LOCAL_SHOW_DETAILS, PLAGIARISM_LOCAL_HIDE_DETAILS, PLAGIARISM_LOCAL_SET_FROM, PLAGIARISM_LOCAL_TEXT_LOADING, PLAGIARISM_LOCAL_TEXT, PLAGIARISM_LOCAL_GENERATE_REPORT, PLAGIARISM_LOCAL_SET_ABSTRACT, PLAGIARISM_LOCAL_CLEAR_STATE, PLAGIARISM_LOCAL_AXIOS_PROGRESS } from "../actions/types";

const initialState = {
  output: {},
  docuId: "",
  textId: "",
  pattern: "",
  patterHide: "",
  text: "",
  showDetails: false,
  patternLoading: false,
  textLoading: false,
  loading: false,
  fromFlag: false,
  generateReport: false,
  abstract: false,
  journal: false,
  globalLoading: {},
  axiosProgress: {
    tag: "Initializing...",
    axiosProgress: 0
  }
};

export default function (state = initialState, action) {
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
    case PLAGIARISM_LOCAL_PATTERN_HIDE:
      return {
        ...state,
        patternHide: action.payload,
        patternLoading: false
      };
    case PLAGIARISM_LOCAL_TEXT:
      return {
        ...state,
        text: action.payload,
        textLoading: false
      };
    case PLAGIARISM_LOCAL_PATTERN_LOADING:
      return {
        ...state,
        patternLoading: true
      };
    case PLAGIARISM_LOCAL_TEXT_LOADING:
      return {
        ...state,
        textLoading: true
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

    case PLAGIARISM_LOCAL_SET_FROM:
      return {
        ...state,
        fromFlag: action.payload
      };
    case PLAGIARISM_LOCAL_SET_ABSTRACT:
      return {
        ...state,
        abstract: action.payload
      };
    case PLAGIARISM_LOCAL_SET_JOURNAL:
      return {
        ...state,
        journal: action.payload
      };
    case PLAGIARISM_LOCAL_GENERATE_REPORT:
      return {
        ...state,
        generateReport: action.payload
      };
    case PLAGIARISM_LOCAL_AXIOS_PROGRESS:
      return {
        ...state,
        axiosProgress: action.payload
      };
    case PLAGIARISM_LOCAL_GLOBAL_CHECK:
      return {
        ...state,
        globalLoading: action.payload
      };
    case PLAGIARISM_LOCAL_CLEAR_STATE:
      return {
        ...state,
        output: {},
        docuId: "",
        textId: "",
        pattern: "",
        text: "",
        showDetails: false,
        patternLoading: false,
        textLoading: false,
        loading: false,
        fromFlag: false,
        generateReport: false,
        abstract: false
      };
    default:
      return state;
  }
}
