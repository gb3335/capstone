import axios from "axios";

import {
  GET_JOURNAL,
  GET_JOURNALS,
  JOURNAL_LOADING,
  GET_ERRORS,
  CLEAR_ERRORS,
  TOGGLE_JOURNAL_BIN,
  TOGGLE_JOURNAL_LIST
} from "./types";

// Get all researches
export const getResearches = () => dispatch => {
  dispatch(clearErrors());
  dispatch(setResearchLoading());
  axios
    .get("/api/journals")
    .then(res =>
      dispatch({
        type: GET_JOURNALS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_JOURNALS,
        payload: null
      })
    );
};

// Toggle Research Bin
export const toggleResearchBin = toggle => {
  if (toggle === 1) {
    return {
      type: TOGGLE_JOURNAL_BIN
    };
  } else {
    return {
      type: TOGGLE_JOURNAL_LIST
    };
  }
};

// Get research by id
export const getResearchById = id => dispatch => {
  dispatch(clearErrors());
  dispatch(setResearchLoading());
  axios
    .get(`/api/journals/${id}`)
    .then(res =>
      dispatch({
        type: GET_JOURNAL,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_JOURNAL,
        payload: null
      })
    );
};

// Create / Update Research
export const createResearch = (researchData, history) => dispatch => {
  axios
    .post("/api/journals", researchData)
    .then(res => {
      if (researchData.id) {
        history.push(`/journals/${researchData.id}`);
      } else {
        history.push(`/journals`);
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
    .post("/api/journals/author", authorData)
    .then(res => history.push(`/journals/${authorData.researchId}`))
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
      .delete(`/api/journals/author/${research}/${id}`)
      .then(res =>
        dispatch({
          type: GET_JOURNAL,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_JOURNAL,
          payload: err.response.data
        })
      );
  }
};

// Add Images
export const addImages = (data, history) => dispatch => {
  dispatch(setResearchLoading());
  axios
    .post("/api/journals/images", data)
    .then(
      history.push("/journals"),
      history.push(`/journals/${data.id}`),
      res =>
        dispatch(
          {
            type: GET_JOURNALS,
            payload: res.data
          },
          {
            type: GET_JOURNAL,
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
    .post("/api/journals/document", docuData)
    .then(res => {
      dispatch(getResearches());
      history.push("/journals/");
      history.push(`/journals/${docuData.researchId}`);
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
      .delete(`/api/journals/document/${researchId}/${filename}`)
      .then(res =>
        dispatch({
          type: GET_JOURNAL,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_JOURNAL,
          payload: err.response.data
        })
      );
  }
};

// Move to bin Research
export const deleteResearch = (data, history) => dispatch => {
  if (window.confirm("Are you sure?")) {
    dispatch(setResearchLoading());
    axios
      .post(`/api/journals/remove/${data.id}`, data)
      .then(dispatch(getResearches()), history.push(`/journals`), res =>
        dispatch({
          type: GET_JOURNAL,
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

// Restore Research
export const restoreResearch = (data, history) => dispatch => {
  if (window.confirm("Are you sure?")) {
    dispatch(setResearchLoading());
    axios
      .post(`/api/journals/restore/${data.id}`, data)
      .then(dispatch(getResearches()), history.push(`/journals`), res =>
        dispatch({
          type: GET_JOURNAL,
          payload: res.data
        }).catch(err =>
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data
          })
        )
      );
  }
};

// set loading state
export const setResearchLoading = () => {
  return {
    type: JOURNAL_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
