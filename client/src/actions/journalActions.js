import axios from "axios";
import { saveAs } from "file-saver";

import {
  GET_JOURNAL,
  GET_JOURNALS,
  JOURNAL_LOADING,
  GET_ERRORS,
  CLEAR_ERRORS,
  TOGGLE_JOURNAL_BIN,
  TOGGLE_JOURNAL_LIST,
  CHANGE_BUTTON_STATUS_JOURNAL,
  TOGGLE_SIDE_BY_SIDE_JOURNAL
} from "./types";

export const onSideBySide = flag => {
  console.log(flag);
  return {
    type: TOGGLE_SIDE_BY_SIDE_JOURNAL,
    payload: flag
  };
};
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

// Create Report for all Researches
export const createReportForResearches = reportData => dispatch => {
  dispatch(changeButtonStatus(true));
  axios
    .post("/api/journals/createReport/journals", reportData)
    .then(() =>
      axios
        .get("/api/journals/fetchReport/journals", { responseType: "blob" })
        .then(res => {
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });
          dispatch(changeButtonStatus(false));
          saveAs(pdfBlob, "JournalsReport.pdf");

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
// Create Report for specific Research
export const createReportForResearch = reportData => dispatch => {
  dispatch(changeButtonStatus(true));
  axios
    .post("/api/journals/createReport/journal", reportData)
    .then(() =>
      axios
        .get("/api/journals/fetchReport/journal", { responseType: "blob" })
        .then(res => {
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });
          dispatch(changeButtonStatus(false));
          saveAs(pdfBlob, "JournalReport.pdf");

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
        type: GET_JOURNALS,
        payload: null
      })
    );
};

// Delete Author
export const deleteAuthor = (journal, id, name) => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone.")) {
    dispatch(setResearchLoading());
    axios
      .delete(`/api/journals/author/${journal}/${id}/${name}`)
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
export const deleteDocument = (researchId, filename, name) => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone.")) {
    dispatch(setResearchLoading());
    axios
      .delete(`/api/journals/document/${researchId}/${filename}/${name}`)
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
};

// Restore Research
export const restoreResearch = (data, history) => dispatch => {
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
};

export const changeButtonStatus = flag => {
  return {
    type: CHANGE_BUTTON_STATUS_JOURNAL,
    payload: flag
  };
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
