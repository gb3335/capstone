import axios from "axios";

import { GET_ERRORS } from "./types";

// Register
export const createAccount = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
      if (userData.id) {
        history.push(`/viewusers`);
      } else {
        history.push(`/viewusers`);
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const editAccount = (userData, history) => dispatch => {
  axios
    .post("/api/users/profile/update", userData)
    .then(res => {
      if (userData.id) {
        history.push(`/viewusers`);
      } else {
        history.push(`/viewusers`);
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};