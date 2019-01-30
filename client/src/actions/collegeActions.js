import axios from "axios";

import { GET_COLLEGES, COLLEGE_LOADING } from "./types";

// Get all colleges
export const getColleges = () => dispatch => {
  dispatch(setCollegeLoading());
  axios
    .get("/api/colleges/all")
    .then(res =>
      dispatch({
        type: GET_COLLEGES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_COLLEGES,
        payload: null
      })
    );
};

// set loading state
export const setCollegeLoading = () => {
  return {
    type: COLLEGE_LOADING
  };
};
