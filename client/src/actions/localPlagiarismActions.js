import {PLAGIARISM_LOCAL,GET_ERRORS} from "./types";
  import axios from "axios";
  
  // Check Plagiarism Local
  export const checkPlagiarismLocal = input => dispatch => {
    axios
      .post("/api/plagiarism/local", input)
      .then(res => {
        dispatch(outputLocalPlagiarism(res.data));
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
  