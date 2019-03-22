import {
  PLAGIARISM_ONLINE,
  GET_ERRORS,
  PLAGIARISM_ONLINE_INPUT,
  PLAGIARISM_ONLINE_LOADING,
  PLAGIARISM_ONLINE_DISABLE_BUTTON,
  PLAGIARISM_ONLINE_SHOW_DETAILS,
  PLAGIARISM_ONLINE_HIDE_DETAILS,
  PLAGIARISM_ONLINE_GOOGLE
} from "./types";
import axios from "axios";

import { saveAs } from "file-saver";
// Check Plagiarism Online
export const checkPlagiarismOnline = input => dispatch => {
  dispatch(setPlagiarismOnlineDisableButton());
  axios
    .post("/api/plagiarism/online", input)
    .then(res => {
      //dispatch(outputOnlinePlagiarism(res.data));
      dispatch(outputOnlinePlagiarismGoogle(res.data));
      dispatch(getOnlinePlagiarismInput(input.original));
      dispatch(setPlagiarismOnlineLoading());
      dispatch(getOnlinePlagiarismResult({text:res.data , pattern: input.q}));
    })
    .catch(err => {
      dispatch(getOnlinePlagiarismInput(input.original));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

let promises = [];

export const getOnlinePlagiarismResult = input => dispatch =>{
  console.time("Initialize")
  dispatch(setPlagiarismOnlineDisableButton());
  axios
  .post("/api/plagiarism/online/initialize/pattern", input)
  .then(res => {
    console.log(res.data);
    if(res.data.success){
      promises = []
      input.text.onlinePlagiarism.data.items.forEach(function(item, index){
          let mime = item.mime || "not_pdf";
          promises.push(axios.post("/api/plagiarism/online/result", {link: item.link, title: item.title, mime, index}))
      })
      axios
        .all(promises)
        .then(res => {
          let newres = [];
          res.forEach(function(r, index){
            //console.log("MARK: "+index+" "+r.data.localPlagiarism.data)
            //newres.push(JSON.parse(hm.decompress(r.data.localPlagiarism.data)))
            newres.push(r.data.onlinePlagiarism.data)
          })
          newres.sort(function(obj1, obj2) {
            // Ascending: first age less than the previous
            return obj2.SimilarityScore - obj1.SimilarityScore;
          });
          // console.log(newres);

          dispatch(outputOnlinePlagiarism(newres));
          console.timeEnd("Initialize")
        })
        .catch(err => {
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data
          });
        });
    }
  })
}


export const createOnlinePlagiarismReport = (input) => dispatch => {
  axios.post('/api/plagiarism/create/report/online', input)
  .then(() => axios.get('/api/plagiarism/get/report/online', {responseType: 'blob'}))
  .then((res) =>{
    const  pdfBlob = new Blob([res.data], {type: 'application/pdf'})

    saveAs(pdfBlob, 'PlagiarismOnlineResult.pdf');
  })
}

export const setPlagiarismOnlineShowDetails = output => {
  return {
    type: PLAGIARISM_ONLINE_SHOW_DETAILS
  };
};

export const setPlagiarismOnlineHideDetails = output => {
  return {
    type: PLAGIARISM_ONLINE_HIDE_DETAILS
  };
};



export const setPlagiarismOnlineLoading = output => {
  return {
    type: PLAGIARISM_ONLINE_LOADING
  };
};

export const setPlagiarismOnlineDisableButton = output => {
  return {
    type: PLAGIARISM_ONLINE_DISABLE_BUTTON
  };
};

// Dispatch
export const outputOnlinePlagiarismGoogle = output => {
  return {
    type: PLAGIARISM_ONLINE_GOOGLE,
    payload: output
  };
};

// Dispatch
export const outputOnlinePlagiarism = output => {
  return {
    type: PLAGIARISM_ONLINE,
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
