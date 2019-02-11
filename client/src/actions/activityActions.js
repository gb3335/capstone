import axios from "axios";

import { GET_ACTIVITIES, ACTIVITY_LOADING } from "./types";

// Get all colleges
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

// set loading state
export const setActivityLoading = () => {
  return {
    type: ACTIVITY_LOADING
  };
};
