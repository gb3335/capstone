import axios from "axios";
import { saveAs } from "file-saver";
import {
  GET_USER,
  GET_USERS,
  USER_LOADING,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_USERLOGS
} from "./types";


// Get all profiles
export const getUserLogs = () => dispatch => {
  dispatch(clearErrors());
  dispatch(setUserLoading());
  axios
    .get('/api/userlogs/all')
    .then(res => {
      dispatch({
        type: GET_USERLOGS,
        payload: res.data
      },
      )
    }
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get all profiles
export const getUsers = () => dispatch => {
  dispatch(clearErrors());
  dispatch(setUserLoading());
  axios
    .get('/api/users/all')
    .then(res => {
      dispatch({
        type: GET_USERS,
        payload: res.data
      },
      )
    }
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// Get users by id
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
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const createReportForUserlogs = reportData => dispatch => {
  axios
    .post("/api/userlogs/createReport", reportData)
    .then(() =>
      axios
        .get("/api/userlogs/fetchReport", { responseType: "blob" })
        .then(res => {
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });
          saveAs(pdfBlob, "UserlogsReport.pdf");
        })
    )
    .catch(err =>
      dispatch({
        type: GET_USERLOGS,
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
