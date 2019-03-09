import axios from "axios";

import {
  GET_USER,
  GET_USERS,
  USER_LOADING,
  GET_ERRORS,
  CLEAR_ERRORS
} from "./types";

// Get all profiles
export const getUsers = () => dispatch => {
  dispatch(clearErrors());
  dispatch(setUserLoading());
  axios
    .get('/api/users/all')
    .then(res =>
      dispatch({
        type: GET_USERS,
        payload: res.data
      },


      )
    )
    .catch(err =>
      dispatch({
        type: GET_USERS,
        payload: null
      })
    );
};


// Get research by id
export const getUserById = id => dispatch => {
  dispatch(clearErrors());
  dispatch(setUserLoading());
  axios
    .get(`/api/users/${id}`)
    .then(res =>
      dispatch({
        type: GET_USER,
        payload: res.data,

      })
    )
    .catch(err =>
      dispatch({
        type: GET_USER,
        payload: null
      })
    );
};

// set loading state
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
