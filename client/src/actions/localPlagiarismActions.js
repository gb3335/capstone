import { PLAGIARISM_LOCAL, GET_ERRORS, PLAGIARISM_ONLINE_INPUT } from "./types";
import axios from "axios";

// Check Plagiarism Local
export const checkPlagiarismLocal = (input, history) => dispatch => {
  axios
    .post("/api/plagiarism/local", input)
    .then(res => {
      dispatch(outputLocalPlagiarism(res.data));
      history.push(`/localResult`);
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
// Dispatch
export const outputLocalPlagiarism = output => {
  return {
    type: PLAGIARISM_LOCAL,
    payload: output
  };
};

// Get Input
export const getOnlinePlagiarismInput = output => {
  return {
    type: PLAGIARISM_ONLINE_INPUT,
    payload: output
  };
};
