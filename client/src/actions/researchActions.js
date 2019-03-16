import axios from "axios";
import { saveAs } from "file-saver";

import {
  GET_RESEARCH,
  GET_RESEARCHES,
  RESEARCH_LOADING,
  GET_ERRORS,
  CLEAR_ERRORS,
  TOGGLE_RESEARCH_BIN,
  TOGGLE_RESEARCH_LIST,
  CHANGE_BUTTON_STATUS_RESEARCH
} from "./types";

// Get all researches
export const getResearches = () => dispatch => {
  dispatch(changeButtonStatus(false));
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

// Create Report for all Researches
export const createReportForResearches = reportData => dispatch => {
  dispatch(changeButtonStatus(true));
  axios
    .post("/api/researches/createReport/researches", reportData)
    .then(() =>
      axios
        .get("/api/researches/fetchReport/researches", { responseType: "blob" })
        .then(res => {
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });
          dispatch(changeButtonStatus(false));
          saveAs(pdfBlob, "ResearchesReport.pdf");

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
        type: GET_RESEARCHES,
        payload: null
      })
    );
};

// Create Report for specific Research
export const createReportForResearch = reportData => dispatch => {
  dispatch(changeButtonStatus(true));
  axios
    .post("/api/researches/createReport/research", reportData)
    .then(() =>
      axios
        .get("/api/researches/fetchReport/research", { responseType: "blob" })
        .then(res => {
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });
          dispatch(changeButtonStatus(false));
          saveAs(pdfBlob, "ResearchReport.pdf");

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
        type: GET_RESEARCHES,
        payload: null
      })
    );
};

// Change Status of Generate Report Button
// set loading state
export const changeButtonStatus = flag => {
  return {
    type: CHANGE_BUTTON_STATUS_RESEARCH,
    payload: flag
  };
};

// Toggle Research Bin
export const toggleResearchBin = toggle => {
  if (toggle === 1) {
    return {
      type: TOGGLE_RESEARCH_BIN
    };
  } else {
    return {
      type: TOGGLE_RESEARCH_LIST
    };
  }
};

// Get research by id
export const getResearchById = id => dispatch => {
  dispatch(clearErrors());
  dispatch(setResearchLoading());
  dispatch(changeButtonStatus(false));
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
export const deleteAuthor = (research, id, name) => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone.")) {
    dispatch(setResearchLoading());
    axios
      .delete(`/api/researches/author/${research}/${id}/${name}`)
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
export const deleteDocument = (researchId, filename, name) => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone.")) {
    dispatch(setResearchLoading());
    axios
      .delete(`/api/researches/document/${researchId}/${filename}/${name}`)
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

// Move to bin Research
export const deleteResearch = (data, history) => dispatch => {
  if (window.confirm("Are you sure?")) {
    dispatch(setResearchLoading());
    axios
      .post(`/api/researches/remove/${data.id}`, data)
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

// Restore Research
export const restoreResearch = (data, history) => dispatch => {
  if (window.confirm("Are you sure?")) {
    dispatch(setResearchLoading());
    axios
      .post(`/api/researches/restore/${data.id}`, data)
      .then(dispatch(getResearches()), history.push(`/researches`), res =>
        dispatch({
          type: GET_RESEARCH,
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
    type: RESEARCH_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
