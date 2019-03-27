import axios from "axios";

import { GET_ERRORS, SET_CURRENT_USER, GET_USER } from "./types";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
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




// set Logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};



export const changeAvatar = (userData, history) => (dispatch, decoded) => {

  axios
    .post("/api/users/avatar", userData)
    .then(res => {

      localStorage.removeItem("jwtToken");
      // Remove the auth header for future request
      setAuthToken(false);
      // Set the current to an empty object which will also set isAuthenticated FALSE

      console.log(userData)
      const Data = {
        username: res.data.username,
        id: userData.id
      };

      axios
        .post("/api/users/avatarupdateauth", Data)
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
          axios
            .get(`/api/users/${userData.id}`)
            .then(res =>
              dispatch({
                type: GET_USER,
                payload: res.data,

              })
            )

          if (userData.id) {
            history.push(`/viewusers/${Data.id}`);
          } else {
            history.push(`/viewusers/${Data.id}`);
          }
        })


    })
    .catch(err =>
      dispatch({
      })
    );
};

export const editUsername = (userData, history) => dispatch => {
  axios
    .post("/api/users/profile/updateusername", userData)
    .then(res => {
      if (userData.id) {
        history.push(`/viewusers/${userData.id}`);
      } else {
        history.push(`/viewusers/${userData.id}`);
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
export const editPassword = (userData, history) => dispatch => {
  axios
    .post("/api/users/profile/updatepassword", userData)
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

export const changeStatus = (userData, history) => dispatch => {
  axios
    .post("/api/users/profile/changestatus", userData)
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