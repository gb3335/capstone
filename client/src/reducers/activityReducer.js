import { GET_ACTIVITIES,ACTIVITY_LOADING  } from "../actions/types";

const initialState = {
  activities: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ACTIVITY_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_ACTIVITIES:
      return {
        ...state,
        activities: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
