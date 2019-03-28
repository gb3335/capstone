import axios from "axios";
import { saveAs } from "file-saver";

import { GET_ACTIVITIES, ACTIVITY_LOADING } from "./types";

// Get all activities
export const getActivities = () => dispatch => {
  dispatch(setActivityLoading());
  axios
    .get("/api/activities/all")
    .then(res =>
      dispatch({
        type: GET_ACTIVITIES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ACTIVITIES,
        payload: null
      })
    );
};

// Create Report for activities
export const createReportForActivity = reportData => dispatch => {
  axios
    .post("/api/activities/createReport", reportData)
    .then(() =>
      axios
        .get("/api/activities/fetchReport", { responseType: "blob" })
        .then(res => {
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });
          saveAs(pdfBlob, "ActivityReport.pdf");
        })
    )
    .catch(err =>
      dispatch({
        type: GET_ACTIVITIES,
        payload: null
      })
    );
};

// set loading state
export const setActivityLoading = () => {
  return {
    type: ACTIVITY_LOADING
  };
};
