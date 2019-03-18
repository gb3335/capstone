import { PLAGIARISM_LOCAL, GET_ERRORS, PLAGIARISM_ONLINE_INPUT, PLAGIARISM_LOCAL_LOADING, PLAGIARISM_LOCAL_ID,PLAGIARISM_LOCAL_PATTERN_LOADING,PLAGIARISM_LOCAL_PATTERN, PLAGIARISM_LOCAL_TEXT_ID, PLAGIARISM_LOCAL_SHOW_DETAILS, PLAGIARISM_LOCAL_HIDE_DETAILS} from "./types";
import axios from "axios";

import jsscompress from "js-string-compression";

let promises = [];

// Check Plagiarism Local
export const checkPlagiarismLocal = (input, history) => dispatch => {
  dispatch(setPlagiarismLocalLoading());
  dispatch(setDocumentId(input.docuId));
  console.time("Initialize")
  axios
  .post("/api/plagiarism/local/initialize/pattern", input)
  .then(res => {
    console.log(res.data);
    if(res.data.success){
      promises = []
      input.researches.forEach(function(research){
        if(research._id !== input.docuId){
          if(research.document){
            promises.push(axios.post("/api/plagiarism/local/result", {docuId: input.docuId, title: input.title, flag: input.flag, textId: research._id, textTitle: research.title, textFile: research.document}))
          }
        }
        
      })
      axios
        .all(promises)
        .then(res => {
          const hm = new jsscompress.Hauffman();
          let newres = [];
          res.forEach(function(r, index){
            //console.log("MARK: "+index+" "+r.data.localPlagiarism.data)
            //newres.push(JSON.parse(hm.decompress(r.data.localPlagiarism.data)))
            newres.push(r.data.localPlagiarism.data)
          })
          newres.sort(function(obj1, obj2) {
            // Ascending: first age less than the previous
            return obj2.SimilarityScore - obj1.SimilarityScore;
          });
          console.log(newres);
          
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
    }//else{
    //   dispatch(outputLocalPlagiarism(res.data));
    //   dispatch({
    //     type: GET_ERRORS,
    //     payload: {initializeLocal: "Document not Found!"}
    //   });
    // }

  })

};

export const getTextPattern = (input) => dispatch =>{
  dispatch(setPlagiarismLocalPatternLoading())
  dispatch(setPlagiarismLocalShowDetails())
  dispatch(setTextDocumentId(input.textId))
  axios.post('/api/plagiarism/get/pattern', input)
  .then(res =>{
    dispatch(outputLocalPlagiarismPattern(res.data));
  })
}

export const setPlagiarismLocalHideDetails = () => {
  return {
    type: PLAGIARISM_LOCAL_HIDE_DETAILS
  };
};

export const setPlagiarismLocalShowDetails = () => {
  return {
    type: PLAGIARISM_LOCAL_SHOW_DETAILS
  };
};

export const setPlagiarismLocalPatternLoading = () => {
  return {
    type: PLAGIARISM_LOCAL_PATTERN_LOADING
  };
};

export const outputLocalPlagiarismPattern = output => {
  return {
    type: PLAGIARISM_LOCAL_PATTERN,
    payload: output
  };
};

export const setDocumentId = (id) => {
  return {
    type: PLAGIARISM_LOCAL_ID,
    payload: id
  };
};

export const setTextDocumentId = (id) => {
  return {
    type: PLAGIARISM_LOCAL_TEXT_ID,
    payload: id
  };
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
