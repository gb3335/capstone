import { GET_ERRORS, SET_CURRENT_USER, CLEAR_CURRENT_PROFILE } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

export const editPassword = (userData, history) => dispatch => {
  axios
    .post("/api/users/profile/updatepassword", userData)
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

export const editPasswordBySuper = (userData, history) => dispatch => {
  axios
    .post("/api/users/profile/updatepassword", userData)
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
      history.push(`/viewusers/${userData.id}`);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
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
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
//forgotuser
export const forgotUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/forgotpassword", userData)
    .then(res => {
      history.push(`/login`);
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

// Log user out
export const logoutUser = (userData, history) => dispatch => {
  // Remove the token from the localStorage
  axios.post("/api/users/logout", userData);

  localStorage.removeItem("jwtToken");
  // Remove the auth header for future request
  setAuthToken(false);
  // Set the current to an empty object which will also set isAuthenticated FALSE
  dispatch(setCurrentUser({}));
};

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
