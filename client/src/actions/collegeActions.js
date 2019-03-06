import axios from "axios";
import { saveAs } from "file-saver";

import {
  GET_COLLEGES,
  GET_COLLEGE,
  COLLEGE_LOADING,
  GET_ERRORS,
  CLEAR_ERRORS,
  TOGGLE_COLLEGE_BIN,
  TOGGLE_COLLEGE_LIST,
  TOGGLE_COLLEGE_GRIDVIEW,
  TOGGLE_COLLEGE_LISTVIEW
} from "./types";

// Get all colleges
export const getColleges = () => dispatch => {
  dispatch(clearErrors());
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

// Create Report
export const createReport = reportData => dispatch => {
  axios
    .post("/api/colleges/createReport/college", reportData)
    .then(() =>
      axios
        .get("/api/colleges/fetchReport/college", { responseType: "blob" })
        .then(res => {
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });

          saveAs(pdfBlob, "newCollegeReportPdf.pdf");
        })
    )
    .catch(err =>
      dispatch({
        type: GET_COLLEGES,
        payload: null
      })
    );
};

// Toggle College Bin
export const toggleCollegeBin = toggle => {
  if (toggle === 1) {
    return {
      type: TOGGLE_COLLEGE_BIN
    };
  } else {
    return {
      type: TOGGLE_COLLEGE_LIST
    };
  }
};

// Toggle College View
export const toggleCollegeList = toggle => {
  if (toggle === 1) {
    return {
      type: TOGGLE_COLLEGE_GRIDVIEW
    };
  } else {
    return {
      type: TOGGLE_COLLEGE_LISTVIEW
    };
  }
};

// Get college by initials
export const getCollegeByInitials = initials => dispatch => {
  dispatch(clearErrors());
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

// Create / Update College
export const createCollege = (collegeData, history) => dispatch => {
  axios
    .post("/api/colleges/", collegeData)
    .then(res => {
      history.push(`/colleges/${collegeData.initials}`);
      window.location.reload();
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Change College Logo
export const changeCollegeLogo = (collegeData, history) => dispatch => {
  axios
    .post("/api/colleges/changeLogo", collegeData)
    .then(res => {
      history.push(`/colleges/${collegeData.initials}`);
      window.location.reload();
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
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

// Delete College
export const deleteCollege = (data, history) => dispatch => {
  if (window.confirm("Are you sure?")) {
    dispatch(setCollegeLoading());
    axios
      .post(`/api/colleges/remove/${data.id}`, data)
      .then(history.push(`/colleges`), res =>
        dispatch({
          type: GET_COLLEGE,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};

// Restore College
export const restoreCollege = (data, history) => dispatch => {
  if (window.confirm("Are you sure?")) {
    dispatch(setCollegeLoading());
    axios
      .post(`/api/colleges/restore/${data.id}`, data)
      .then(history.push(`/colleges`), res =>
        dispatch({
          type: GET_COLLEGE,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
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

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
