import axios from "axios";

import { GET_USERS, GET_ERRORS, CLEAR_ERRORS } from "./types";
// Get all researches
export const getUser = () => dispatch => {
  axios
    .get("/api/users/all")
    .then(res =>
      dispatch({
        type: GET_USERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_USERS,
        payload: null
      })
    );
};
