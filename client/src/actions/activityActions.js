import axios from "axios";

import { GET_ACTIVITIES } from "./types";

// Get all colleges
export const getActivities = () => dispatch => {
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
