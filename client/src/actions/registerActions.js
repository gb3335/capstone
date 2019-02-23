import axios from "axios";

import { GET_ERRORS } from "./types";

// Register
export const createAccount = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
      if (userData.id) {
        history.push(`/dashboard`);
      } else {
        history.push(`/dashboard`);
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
