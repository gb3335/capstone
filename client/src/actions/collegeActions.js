import axios from "axios";

import {
  GET_COLLEGES,
  GET_COLLEGE,
  COLLEGE_LOADING,
  GET_ERRORS
} from "./types";

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

// Get college by initials
export const getCollegeByInitials = initials => dispatch => {
  dispatch(setCollegeLoading());
  axios
    .get(`/api/colleges/${initials}`)
    .then(res =>
      dispatch({
        type: GET_COLLEGE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_COLLEGE,
        payload: null
      })
    );
};

// Add Course
export const addCourse = (courseData, history) => dispatch => {
  axios
    .post("/api/colleges/course", courseData)
    .then(res =>
      history.push(`/colleges/${courseData.college.college.name.initials}`)
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Course
export const deleteCourse = (college, id) => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone.")) {
    dispatch(setCollegeLoading());
    axios
      .delete(`/api/colleges/course/${college}/${id}`)
      .then(res =>
        dispatch({
          type: GET_COLLEGE,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_COLLEGE,
          payload: err.response.data
        })
      );
  }
};

// set loading state
export const setCollegeLoading = () => {
  return {
    type: COLLEGE_LOADING
  };
};
