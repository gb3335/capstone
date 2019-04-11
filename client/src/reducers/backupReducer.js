import { GET_BACKUPS, BACKUP_LOADING } from "../actions/types";

const initialState = {
  backups: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case BACKUP_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_BACKUPS:
      return {
        ...state,
        backups: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
