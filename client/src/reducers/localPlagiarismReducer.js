import { PLAGIARISM_LOCAL, PLAGIARISM_LOCAL_LOADING, PLAGIARISM_LOCAL_ID } from "../actions/types";

const initialState = {
  output: {},
  docuId: "",
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
    default:
      return state;
  }
}
