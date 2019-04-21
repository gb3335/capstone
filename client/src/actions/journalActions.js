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
  TOGGLE_SIDE_BY_SIDE_JOURNAL,
  SET_DESCRIPTION_CLICK
} from "./types";

export const onSideBySide = input => dispatch => {
  dispatch(setAbstractClick(input.abstract));
  dispatch({
    type: TOGGLE_SIDE_BY_SIDE_JOURNAL,
    payload: input.fromFlag
  });
};

export const setAbstractClick = abstract => {
  return {
    type: SET_DESCRIPTION_CLICK,
    payload: abstract
  };
};
// Get all journals
export const getJournals = () => dispatch => {
  dispatch(clearErrors());
  dispatch(setJournalLoading());
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

// Create Report for all Journals
export const createReportForJournals = reportData => dispatch => {
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
            reader.onloadend = function () {
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

// Toggle Journal Bin
export const toggleJournalBin = toggle => {
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

// Get Journal by id
export const getJournalById = id => dispatch => {
  dispatch(clearErrors());
  dispatch(setJournalLoading());
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

// Create / Update Journal
export const createJournal = (journalData, history) => dispatch => {
  axios
    .post("/api/journals", journalData)
    .then(res => {
      if (journalData.id) {
        history.push(`/journals/${journalData.id}`);
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
  dispatch(setJournalLoading());
  axios
    .post("/api/journals/author", authorData)
    .then(res => history.push(`/journals/${authorData.journalId}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Create Report for specific Journal
export const createReportForJournal = reportData => dispatch => {
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
            reader.onloadend = function () {
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
  dispatch(setJournalLoading());

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
};

// Add Images
export const addImages = (data, history) => dispatch => {
  dispatch(setJournalLoading());
  axios
    .post("/api/journals/images", data)
    .then(res => {
      dispatch(getJournals());
      history.push("/journals");
      history.push(`/journals/${data.id}`);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Document
export const addDocument = (docuData, history) => dispatch => {
  dispatch(setJournalLoading());
  axios
    .post("/api/journals/document", docuData)
    .then(res => {
      dispatch(getJournals());
      history.push("/journals/");
      history.push(`/journals/${docuData.journalId}`);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
export const addExcel = (docuData, history) => dispatch => {
  dispatch(setJournalLoading());
  axios
    .post("/api/journals/excel", docuData)
    .then(res => {
      axios
        .get("/api/journals/test").then(res => {
          console.log("saved")
        })
      dispatch(getJournals());
      history.push("/journals/");

    })
    .catch(err =>
      console.log(err)
    );
};
// Delete Document
export const deleteDocument = (journalId, filename, name) => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone.")) {
    dispatch(setJournalLoading());
    axios
      .delete(`/api/journals/document/${journalId}/${filename}/${name}`)
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

// Move to bin Journal
export const deleteJournal = (data, history) => dispatch => {
  dispatch(setJournalLoading());
  axios
    .post(`/api/journals/remove/${data.id}`, data)
    .then(dispatch(getJournals()), history.push(`/journals`), res =>
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

// Restore Journal
export const restoreJournal = (data, history) => dispatch => {
  dispatch(setJournalLoading());
  axios
    .post(`/api/journals/restore/${data.id}`, data)
    .then(dispatch(getJournals()), history.push(`/journals`), res =>
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

// Download Journal Document
export const downloadJournalDoc = jourData => dispatch => {
  axios
    .post("/api/journals/downloadJourDoc", jourData, { responseType: "blob" })
    .then(res => {
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      saveAs(pdfBlob, `${jourData.title}-Document.pdf`);
    });
};

export const changeButtonStatus = flag => {
  return {
    type: CHANGE_BUTTON_STATUS_JOURNAL,
    payload: flag
  };
};

// set loading state
export const setJournalLoading = () => {
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
