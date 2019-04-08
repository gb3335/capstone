import { PLAGIARISM_RAW_LOCAL, PLAGIARISM_RAW_LOCAL_INPUT, PLAGIARISM_RAW_LOCAL_LOADING,PLAGIARISM_RAW_LOCAL_AXIOS_PROGRESS, GET_ERRORS, PLAGIARISM_RAW_LOCAL_SET_ABSTRACT, PLAGIARISM_RAW_LOCAL_GENERATE_REPORT, PLAGIARISM_RAW_LOCAL_SHOW_DETAILS, PLAGIARISM_RAW_LOCAL_HIDE_DETAILS, PLAGIARISM_RAW_LOCAL_DISABLE_BUTTON, CLEAR_ERRORS } from '../actions/types'

import axios from "axios";

import { saveAs } from "file-saver";
let promises = [];
let total=0;
let comFlag=0;

const setAxiosProgress = (input) => {
  return {
    type: PLAGIARISM_RAW_LOCAL_AXIOS_PROGRESS,
    payload: input
  };
}

// Check Plagiarism Local
export const checkPlagiarismLocal = (input, history) => dispatch => {
    total=0;
    comFlag=0;
    let config = {
      onUploadProgress: progressEvent =>{
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
        let percentCompleted = Math.floor((progressEvent.loaded * 100) / totalLength);
        // console.log(percentCompleted);
        
        if(percentCompleted===100){
          comFlag++;
          let progress = parseFloat((comFlag/total)*100).toFixed(2).toString().replace(/\.00$/,'');
          let tag = "Scanning for plagiarism..."
          if(progress==="100"){
            tag="Generating Results..."
          }
          const axiosProgress ={
            tag,
            axiosProgress: progress
          }
          // console.log(progress)
          dispatch(setAxiosProgress(axiosProgress));
        }
        
      }
    }
    
    
    console.time("Initialize")
    dispatch(setPlagiarismRawLocalDisableButton());
    axios
      .post("/api/plagiarism/local/initialize/pattern", input)
      .then(res => {
        dispatch(getRawLocalPlagiarismInput(input.original));
        dispatch(setPlagiarismLocalLoading());
        dispatch(setPlagiarismLocalAbstract(input.abstract))
        dispatch(setPlagiarismRawLocalDisableButton());
        dispatch(clearErrors());
        console.log(res.data);
        if (res.data.success) {
          promises = []
          input.researches.forEach(function (research) {
            
              if (input.abstract) {
                if (research.deleted !== 1) {
                  total++;
                  promises.push(axios.post("/api/plagiarism/local/result", { docuId: input.docuId, raw: input.raw, abstract: input.abstract, title: input.title, flag: input.flag, textId: research._id, textTitle: research.title, textFile: research.document },config))
                }
              } else {
                if (research.document && research.deleted !== 1) {
                  total++;
                  promises.push(axios.post("/api/plagiarism/local/result", { docuId: input.docuId, raw: input.raw, abstract: input.abstract, title: input.title, flag: input.flag, textId: research._id, textTitle: research.title, textFile: research.document },config))
                }
              }
          })
          axios
            .all(promises)
            .then(res => {
              let newres = [];
              res.forEach(function (r, index) {
                //console.log("MARK: "+index+" "+r.data.localPlagiarism.data)
                //newres.push(JSON.parse(hm.decompress(r.data.localPlagiarism.data)))
                newres.push(r.data.localPlagiarism.data)
              })
              total=0;
              comFlag=0;
              newres.sort(function (obj1, obj2) {
                // Ascending: first age less than the previous
                return obj2.SimilarityScore - obj1.SimilarityScore;
              });
              const axiosProgress ={
                tag:"",
                axiosProgress: 0
              }
              dispatch(setAxiosProgress(axiosProgress));
              dispatch(outputLocalPlagiarism(newres));
              console.timeEnd("Initialize")
            })
        }//else{
        //   dispatch(outputLocalPlagiarism(res.data));
        //   dispatch({
        //     type: GET_ERRORS,
        //     payload: {initializeLocal: "Document not Found!"}
        //   });
        // }
  
      })
      .catch(err => {
        dispatch(getRawLocalPlagiarismInput(input.original));
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        });
    });
  };

  export const setPlagiarismLocalLoading = () => {
    return {
      type: PLAGIARISM_RAW_LOCAL_LOADING
    };
  };

  export const setPlagiarismLocalAbstract = (flag) => {
    return {
      type: PLAGIARISM_RAW_LOCAL_SET_ABSTRACT,
      payload: flag
    };
  };

  export const outputLocalPlagiarism = output => {
    return {
      type: PLAGIARISM_RAW_LOCAL,
      payload: output
    };
  };

  export const setPlagiarismGenerateReportLoading = (input) =>{
    return {
      type: PLAGIARISM_RAW_LOCAL_GENERATE_REPORT,
      payload: input
    };
  }

  export const setPlagiarismRawLocalShowDetails = output => {
    return {
      type: PLAGIARISM_RAW_LOCAL_SHOW_DETAILS
    };
  };
  
  export const setPlagiarismRawLocalHideDetails = output => {
    return {
      type: PLAGIARISM_RAW_LOCAL_HIDE_DETAILS
    };
  };

  export const createRawLocalPlagiarismReport = (input) => dispatch => {
    axios.post('/api/plagiarism/create/report/online', input)
    .then(() => axios.get('/api/plagiarism/get/report/online', {responseType: 'blob'}))
    .then((res) =>{
      const  pdfBlob = new Blob([res.data], {type: 'application/pdf'})
  
      saveAs(pdfBlob, 'PlagiarismOnlineResult.pdf');
      dispatch(setPlagiarismGenerateReportLoading(false));
    })
  }

  // Get Input
export const getRawLocalPlagiarismInput = output => {
    return {
      type: PLAGIARISM_RAW_LOCAL_INPUT,
      payload: output
    };
  };

  export const setPlagiarismRawLocalDisableButton = output => {
    return {
      type: PLAGIARISM_RAW_LOCAL_DISABLE_BUTTON
    };
  };


  export const clearErrors = output => {
    return {
      type: CLEAR_ERRORS
    };
  };