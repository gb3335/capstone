import { PLAGIARISM_LOCAL, GET_ERRORS, PLAGIARISM_ONLINE_INPUT, PLAGIARISM_LOCAL_LOADING } from "./types";
import axios from "axios";

import jsscompress from "js-string-compression";

let promises = [];

// Check Plagiarism Local
export const checkPlagiarismLocal = (input, history) => dispatch => {
  dispatch(setPlagiarismLocalLoading())
  console.time("Initialize")
  axios
  .post("/api/plagiarism/initialize/pattern", input)
  .then(res => {
    console.log(res.data);
    promises = []
    input.researches.forEach(function(research){
      if(research._id !== input.docuId){
        if(research.document){
          promises.push(axios.post("/api/plagiarism/local", {docuId: input.docuId, title: input.title, flag: input.flag, textId: research._id, textTitle: research.title}))
        }
      }
      
    })
    axios
      .all(promises)
      .then(res => {
        const hm = new jsscompress.Hauffman();
        let newres = [];
        // console.log(res);
        // console.log("decompressing");
        // console.log(res)
        res.forEach(function(r, index){
          //console.log("MARK: "+index+" "+r.data.localPlagiarism.data)
          //newres.push(JSON.parse(hm.decompress(r.data.localPlagiarism.data)))
          newres.push(r.data.localPlagiarism.data)
        })
        console.timeEnd("Initialize")
        dispatch(outputLocalPlagiarism(newres));
        history.push(`/localResult`);
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      });
  })

};

export const setPlagiarismLocalLoading = () => {
  return {
    type: PLAGIARISM_LOCAL_LOADING
  };
};


// Dispatch
export const outputLocalPlagiarism = output => {
  return {
    type: PLAGIARISM_LOCAL,
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
