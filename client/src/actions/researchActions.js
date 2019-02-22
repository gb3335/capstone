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
  dispatch(clearErrors());
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
  dispatch(clearErrors());
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
  axios
    .post("/api/researches", researchData)
    .then(res => {
      if (researchData.id) {
        history.push(`/researches/${researchData.id}`);
      } else {
        history.push(`/researches`);
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Author
export const addAuthor = (authorData, history) => dispatch => {
  dispatch(setResearchLoading());
  axios
    .post("/api/researches/author", authorData)
    .then(res => history.push(`/researches/${authorData.researchId}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Author
export const deleteAuthor = (research, id) => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone.")) {
    dispatch(setResearchLoading());
    axios
      .delete(`/api/researches/author/${research}/${id}`)
      .then(res =>
        dispatch({
          type: GET_RESEARCH,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_RESEARCH,
          payload: err.response.data
        })
      );
  }
};

// Add Images
export const addImages = (data, history) => dispatch => {
  dispatch(setResearchLoading());
  axios
    .post("/api/researches/images", data)
    .then(
      history.push("/researches"),
      history.push(`/researches/${data.id}`),
      window.location.reload(),
      res =>
        dispatch(
          {
            type: GET_RESEARCHES,
            payload: res.data
          },
          {
            type: GET_RESEARCH,
            payload: res.data
          }
        )
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Document
export const addDocument = (docuData, history) => dispatch => {
  dispatch(setResearchLoading());
  axios
    .post("/api/researches/document", docuData)
    .then(res => {
      dispatch(getResearches());
      history.push("/researches/");
      history.push(`/researches/${docuData.researchId}`);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Document
export const deleteDocument = (researchId, filename) => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone.")) {
    dispatch(setResearchLoading());
    axios
      .delete(`/api/researches/document/${researchId}/${filename}`)
      .then(res =>
        dispatch({
          type: GET_RESEARCH,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_RESEARCH,
          payload: err.response.data
        })
      );
  }
};

// Delete Research
export const deleteResearch = (data, history) => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone.")) {
    dispatch(setResearchLoading());
    axios
      .delete(`/api/researches/${data.id}`)
      .then(dispatch(getResearches()), history.push(`/researches`), res =>
        dispatch({
          type: GET_RESEARCH,
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
