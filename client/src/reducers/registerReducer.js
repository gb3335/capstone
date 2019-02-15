import { REGISTER_ACCOUNT } from "..action/types";

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REGISTER_ACCOUNT:
      return {
        ...state
      };
    default:
      return state;
  }
}
