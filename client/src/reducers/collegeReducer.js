import { GET_COLLEGE, GET_COLLEGES, COLLEGE_LOADING } from "../actions/types";

const initialState = {
  college: {},
  colleges: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case COLLEGE_LOADING:
      return {
        ...state,
        loading: true
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
