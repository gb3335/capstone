import axios from "axios";

import {
  GET_RESEARCH,
  GET_RESEARCHES,
  RESEARCH_LOADING,
  GET_ERRORS,
  CLEAR_ERRORS
} from "./types";

// Get all researches
export const getResearches = () => dispatch => {
  dispatch(setResearchLoading());
  axios
    .get("/api/researches")
    .then(res =>
      dispatch({
        type: GET_RESEARCHES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_RESEARCHES,
        payload: null
      })
    );
};

// Get research by id
export const getResearchById = id => dispatch => {
  dispatch(setResearchLoading());
  axios
    .get(`/api/researches/${id}`)
    .then(res =>
      dispatch({
        type: GET_RESEARCH,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_RESEARCH,
        payload: null
      })
    );
};

// Create / Update Research
export const createResearch = (researchData, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/researches", researchData)
    .then(res => {
      history.push(`/researches/`);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// set loading state
export const setResearchLoading = () => {
  return {
    type: RESEARCH_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
