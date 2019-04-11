import axios from "axios";
import { saveAs } from "file-saver";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  GET_USER,
  USER_LOADING,
  CLEAR_ERRORS,
  CHANGE_USER_BUTTON_STATUS,
  GET_USERS,
  TOGGLE_USERS_BLOCK,
  TOGGLE_USERS_LIST,
  GET_BACKUPS,
  BACKUP_LOADING
} from "./types";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { getUserById } from "./userActions";

export const toggleUsersBlocked = toggle => {
  if (toggle === 1) {
    return {
      type: TOGGLE_USERS_BLOCK
    };
  } else {
    return {
      type: TOGGLE_USERS_LIST
    };
  }
};

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
      const { token } = res.data;
      // Set token to local storage
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));

      if (userData.from) {
        history.push(`/`);
      } else {
        history.push(`${userData.oldlink}`);
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// set Logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const changeAvatar = (userData, history) => (dispatch, decoded) => {
  dispatch(setUserLoading());
  axios
    .post("/api/users/avatar", userData)
    .then(res => {
      localStorage.removeItem("jwtToken");
      // Remove the auth header for future request
      setAuthToken(false);
      // Set the current to an empty object which will also set isAuthenticated FALSE
      const Data = {
        username: res.data.username,
        id: userData.id
      };

      axios.post("/api/users/avatarupdateauth", Data).then(res => {
        // Save to Local storage

        const { token } = res.data;
        // Set token to local storage
        localStorage.setItem("jwtToken", token);
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user
        dispatch(setCurrentUser(decoded));
        dispatch(getUserById(userData.id));
        axios.get(`/api/users/${userData.id}`).then(res =>
          dispatch({
            type: GET_USER,
            payload: res.data
          })
        );

        if (userData.oldlink) {
          history.push(`/${userData.oldlink}`);
        } else {
          history.push(`/myaccount/${userData.id}`);
        }
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const editUsername = (userData, history) => dispatch => {
  axios
    .post("/api/users/profile/updateusername", userData)
    .then(res => {
      const { token } = res.data;
      // Set token to local storage
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));

      if (userData.from) {
        history.push(`/`);
      } else {
        history.push(`${userData.oldlink}`);
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


export const changeStatus = (userData, history) => dispatch => {
  dispatch(setUserLoading());
  axios
    .post("/api/users/profile/changestatus", userData)
    .then(res => {
      dispatch(getUserById(userData.id));
      history.push(`/viewusers/${userData.id}`);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Create Report for all Journals
export const createReportForUsers = reportData => dispatch => {
  dispatch(changeButtonStatus(true));
  axios
    .post("/api/users/createReport/users", reportData)
    .then(() =>
      axios
        .get("/api/users/fetchReport/users", { responseType: "blob" })
        .then(res => {
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });
          dispatch(changeButtonStatus(false));
          saveAs(pdfBlob, "UsersReport.pdf");

          // send base64 to api for s3 upload -FOR ANDROID-
          if (reportData.android) {
            const reader = new FileReader();
            reader.readAsDataURL(pdfBlob);
            reader.onloadend = function() {
              const pdfData = {
                base64: reader.result
              };
              axios
                .post("/api/colleges/uploadS3/android", pdfData)
                .then()
                .catch(err => console.log(err));
            };
          }
        })
    )
    .catch(err =>
      dispatch({
        type: GET_USERS,
        payload: null
      })
    );
};

export const createReportForUser = reportData => dispatch => {
  dispatch(changeButtonStatus(true));
  axios
    .post("/api/users/createReport/user", reportData)
    .then(() =>
      axios
        .get("/api/users/fetchReport/user", { responseType: "blob" })
        .then(res => {
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });
          dispatch(changeButtonStatus(false));
          saveAs(pdfBlob, "UserReport.pdf");

          // send base64 to api for s3 upload -FOR ANDROID-
          if (reportData.android) {
            const reader = new FileReader();
            reader.readAsDataURL(pdfBlob);
            reader.onloadend = function() {
              const pdfData = {
                base64: reader.result
              };
              axios
                .post("/api/colleges/uploadS3/android", pdfData)
                .then()
                .catch(err => console.log(err));
            };
          }
        })
    )
    .catch(err =>
      dispatch({
        type: GET_USER,
        payload: null
      })
    );
};

// Get all BACKUPS
export const getBackups = () => dispatch => {
  dispatch(setBackupLoading());
  axios
    .get("/api/users/backups/all")
    .then(res => {
      dispatch({
        type: GET_BACKUPS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// addBackup
export const createBackup = data => dispatch => {
  axios
    .post("/api/users/mongodb-backup", data)
    .then(res => dispatch(getBackups))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// restore backup
export const restoreBackup = data => dispatch => {
  axios
    .post("/api/users/mongodb-restore", data)
    .then(res => dispatch(getBackups))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// delete backup
export const deleteBackup = (data, history) => dispatch => {
  axios
    .post("/api/users/delete-backup", data)
    .then(window.location.reload(true))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const changeButtonStatus = flag => {
  return {
    type: CHANGE_USER_BUTTON_STATUS,
    payload: flag
  };
};
// set loading state
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// set loading state backup
export const setBackupLoading = () => {
  return {
    type: BACKUP_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
