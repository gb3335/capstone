import {
  PLAGIARISM_ONLINE,
  GET_ERRORS,
  PLAGIARISM_ONLINE_INPUT
} from "./types";
import axios from "axios";

// Check Plagiarism Online
export const checkPlagiarismOnline = input => dispatch => {
  axios
    .post("/api/plagiarism/online", input)
    .then(res => {
      dispatch(outputOnlinePlagiarism(res.data));
      dispatch(getOnlinePlagiarismInput(input.original));
    })
    .catch(err => {
      dispatch(getOnlinePlagiarismInput(input.original));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
// Dispatch
export const outputOnlinePlagiarism = output => {
  return {
    type: PLAGIARISM_ONLINE,
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
