import {
  PLAGIARISM_ONLINE,
  GET_ERRORS,
  PLAGIARISM_ONLINE_INPUT,
  PLAGIARISM_ONLINE_LOADING,
  PLAGIARISM_ONLINE_DISABLE_BUTTON,
  PLAGIARISM_ONLINE_SHOW_DETAILS,
  PLAGIARISM_ONLINE_HIDE_DETAILS,
  PLAGIARISM_ONLINE_GOOGLE,
  PLAGIARISM_ONLINE_GENERATE_REPORT,
  PLAGIARISM_ONLINE_CLEAR_OUTPUT,
  PLAGIARISM_ONLINE_AXIOS_PROGRESS,
  PLAGIARISM_LOCAL_GLOBAL_CHECK
} from "./types";
import axios from "axios";

import { saveAs } from "file-saver";
let promises = [];
let total=0;
let comFlag=0;

const setAxiosProgress = (input) => {
  return {
    type: PLAGIARISM_ONLINE_AXIOS_PROGRESS,
    payload: input
  };
}
// Check Plagiarism Online
export const checkPlagiarismOnline = input => dispatch => {
  total=0;
  comFlag=0;
  let config = {
    onDownloadProgress: progressEvent =>{
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
  dispatch(setPlagiarismOnlineDisableButton());
  axios
    .post("/api/plagiarism/online", input)
    .then(res => {
      //dispatch(outputOnlinePlagiarism(res.data));
      dispatch(clearOnlinePlagiarismOutput());
      dispatch(outputOnlinePlagiarismGoogle(res.data));
      dispatch(getOnlinePlagiarismInput(input.original));
      if(res.data.onlinePlagiarism.data.items.length>0 && res.data.onlinePlagiarism.data.items){
        dispatch(setPlagiarismOnlineLoading());
        dispatch(setPlagiarismGlobalCheck({loading:true, number:5}));
        const input2 = {
          text:res.data , pattern: input.q
        }
        /// SECOND BATCH START
          console.time("Initialize")
          dispatch(setPlagiarismOnlineDisableButton());
          axios
          .post("/api/plagiarism/online/initialize/pattern", input2)
          .then(res => {
            console.log(res.data);
            if(res.data.success){
              promises = []
              input2.text.onlinePlagiarism.data.items.forEach(function(item, index){
                  let mime = item.mime || "not_pdf";
                  let link=item.link;
                  // if(item.mime==="text/plain"){
                  //   link=item.formattedUrl;
                  // }
                  promises.push(axios.post("/api/plagiarism/online/result", {link, pattern: input2.pattern, title: item.title, mime, index},config))
                  total++;
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
                  total=0;
                  comFlag=0;
                  const axiosProgress ={
                    tag:"",
                    axiosProgress: 0
                  }
                  dispatch(setPlagiarismGlobalCheck({}));
                  dispatch(setAxiosProgress(axiosProgress));
                  dispatch(outputOnlinePlagiarism(newres));
                  console.timeEnd("Initialize")
                })
                .catch(err => {
                  const errors={}
                  errors.time = "Timeout Error"
                  dispatch({
                    type: GET_ERRORS,
                    payload: errors
                  });
                });
            }
          })
        /// SECOND BATCH END
        // dispatch(getOnlinePlagiarismResult({text:res.data , pattern: input.q}));
      }
      
    })
    .catch(err => {
      dispatch(setPlagiarismGlobalCheck({}));
      dispatch(getOnlinePlagiarismInput(input.original));
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// export const getOnlinePlagiarismResult = input => dispatch =>{
//   console.time("Initialize")
//   dispatch(setPlagiarismOnlineDisableButton());
//   axios
//   .post("/api/plagiarism/online/initialize/pattern", input)
//   .then(res => {
//     console.log(res.data);
//     if(res.data.success){
//       promises = []
//       input.text.onlinePlagiarism.data.items.forEach(function(item, index){
//           let mime = item.mime || "not_pdf";
//           promises.push(axios.post("/api/plagiarism/online/result", {link: item.link, title: item.title, mime, index}))
//       })
//       axios
//         .all(promises)
//         .then(res => {
//           let newres = [];
//           res.forEach(function(r, index){
//             //console.log("MARK: "+index+" "+r.data.localPlagiarism.data)
//             //newres.push(JSON.parse(hm.decompress(r.data.localPlagiarism.data)))
//             newres.push(r.data.onlinePlagiarism.data)
//           })
//           newres.sort(function(obj1, obj2) {
//             // Ascending: first age less than the previous
//             return obj2.SimilarityScore - obj1.SimilarityScore;
//           });
//           // console.log(newres);

//           dispatch(outputOnlinePlagiarism(newres));
//           console.timeEnd("Initialize")
//         })
//         .catch(err => {
//           dispatch({
//             type: GET_ERRORS,
//             payload: err.response.data
//           });
//         });
//     }
//   })
// }

export const setPlagiarismGlobalCheck= (input) => {
  return {
    type: PLAGIARISM_LOCAL_GLOBAL_CHECK,
    payload: input
  };
}

export const setPlagiarismGenerateReportLoading = (input) =>{
  return {
    type: PLAGIARISM_ONLINE_GENERATE_REPORT,
    payload: input
  };
}

export const clearOnlinePlagiarismOutput = () =>{
  return {
    type: PLAGIARISM_ONLINE_CLEAR_OUTPUT
  };
}

export const createOnlinePlagiarismReport = (input) => dispatch => {
  axios.post('/api/plagiarism/create/report/online', input)
  .then(() => axios.get('/api/plagiarism/get/report/online', {responseType: 'blob'}))
  .then((res) =>{
    const  pdfBlob = new Blob([res.data], {type: 'application/pdf'})

    saveAs(pdfBlob, 'PlagiarismOnlineResult.pdf');
    dispatch(setPlagiarismGenerateReportLoading(false));
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
