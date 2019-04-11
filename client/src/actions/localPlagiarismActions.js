import { PLAGIARISM_LOCAL, GET_ERRORS, PLAGIARISM_ONLINE_INPUT, PLAGIARISM_LOCAL_LOADING, PLAGIARISM_LOCAL_ID, PLAGIARISM_LOCAL_PATTERN_LOADING, PLAGIARISM_LOCAL_PATTERN, PLAGIARISM_LOCAL_TEXT_ID, PLAGIARISM_LOCAL_SHOW_DETAILS, PLAGIARISM_LOCAL_HIDE_DETAILS, PLAGIARISM_LOCAL_SET_FROM, PLAGIARISM_LOCAL_TEXT_LOADING, PLAGIARISM_LOCAL_TEXT, PLAGIARISM_LOCAL_GENERATE_REPORT, PLAGIARISM_LOCAL_SET_ABSTRACT, PLAGIARISM_LOCAL_CLEAR_STATE, PLAGIARISM_LOCAL_AXIOS_PROGRESS, PLAGIARISM_LOCAL_GLOBAL_CHECK, PLAGIARISM_LOCAL_SET_JOURNAL } from "./types";
import axios from "axios";
import { saveAs } from "file-saver";

import jsscompress from "js-string-compression";
let comFlag = 0;
let total = 0;

const setAxiosProgress = (input) => {
  return {
    type: PLAGIARISM_LOCAL_AXIOS_PROGRESS,
    payload: input
  };
}
let promises = [];

// Check Plagiarism Local
export const checkPlagiarismLocal = (input, history) => dispatch => {
  total = 0;
  comFlag = 0;
  let config = {
    onUploadProgress: progressEvent => {
      const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
      let percentCompleted = Math.floor((progressEvent.loaded * 100) / totalLength);
      // console.log(percentCompleted);

      if (percentCompleted === 100) {
        comFlag++;
        let progress = parseFloat((comFlag / total) * 100).toFixed(2).toString().replace(/\.00$/, '');
        let tag = "Scanning for plagiarism..."
        if (progress === "100") {
          tag = "Generating Results..."
        }
        const axiosProgress = {
          tag,
          axiosProgress: progress
        }
        // console.log(progress)
        dispatch(setAxiosProgress(axiosProgress));
      }

    }
  }
  dispatch(setPlagiarismLocalLoading());
  if(input.abstract){
    dispatch(setPlagiarismGlobalCheck({loading: true, number: 2}));
  }else{
    dispatch(setPlagiarismGlobalCheck({loading: true, number: 1}));
  }
  dispatch(setPlagiarismLocalJournal(false));
  dispatch(setDocumentId(input.docuId));
  dispatch(setPlagiarismLocalFromFlag(input.fromFlag))
  dispatch(setPlagiarismLocalAbstract(input.abstract))
  console.time("Initialize")
  // axios
  //   .post("/api/plagiarism/local/initialize/pattern", input)
  //   .then(res => {
  //     console.log(res.data);
  //     if (res.data.success) {
        promises = []
        input.researches.forEach(function (research) {
          if (research._id !== input.docuId) {
            if (input.abstract) {
              if (research.deleted !== 1) {
                total++;
                promises.push(axios.post("/api/plagiarism/local/result", { docuId: input.docuId, abstract: input.abstract, title: input.title, flag: input.flag, textId: research._id, textTitle: research.title, textFile: research.document }, config))
              }
            } else {
              if (research.document && research.deleted !== 1) {
                total++;
                promises.push(axios.post("/api/plagiarism/local/result", { docuId: input.docuId, abstract: input.abstract, title: input.title, flag: input.flag, textId: research._id, textTitle: research.title, textFile: research.document }, config))
              }
            }
          }

        })
        axios
          .all(promises)
          .then(res => {
            const hm = new jsscompress.Hauffman();
            let newres = [];
            res.forEach(function (r, index) {
              //console.log("MARK: "+index+" "+r.data.localPlagiarism.data)
              //newres.push(JSON.parse(hm.decompress(r.data.localPlagiarism.data)))
              newres.push(r.data.localPlagiarism.data)
            })
            total = 0;
            comFlag = 0;
            newres.sort(function (obj1, obj2) {
              // Ascending: first age less than the previous
              return obj2.SimilarityScore - obj1.SimilarityScore;
            });
            const axiosProgress = {
              tag: "",
              axiosProgress: 0
            }
            dispatch(setAxiosProgress(axiosProgress));
            console.timeEnd("Initialize")
            dispatch(outputLocalPlagiarism(newres));
            dispatch(setPlagiarismGlobalCheck({}));
            if (input.abstract) {
              if (input.fromFlag) {
                history.push(`/localResultSideBySide/abstract`);
              } else {
                history.push(`/localresult/abstract`);
              }
            } else {
              if (input.fromFlag) {
                history.push(`/localResultSideBySide/research`);
              } else {
                history.push(`/localresult/research`);
              }
            }
          })
          .catch(err => {
            dispatch({
              type: GET_ERRORS,
              payload: err.response.data
            });
          });
      //}//else{
      //   dispatch(outputLocalPlagiarism(res.data));
      //   dispatch({
      //     type: GET_ERRORS,
      //     payload: {initializeLocal: "Document not Found!"}
      //   });
      // }

    // })

};


// Check Plagiarism Local
export const journalPlagiarismLocal = (input, history) => dispatch => {
  total = 0;
  comFlag = 0;
  let config = {
    onUploadProgress: progressEvent => {
      const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
      let percentCompleted = Math.floor((progressEvent.loaded * 100) / totalLength);
      // console.log(percentCompleted);

      if (percentCompleted === 100) {
        comFlag++;
        let progress = parseFloat((comFlag / total) * 100).toFixed(2).toString().replace(/\.00$/, '');
        let tag = "Scanning for plagiarism..."
        if (progress === "100") {
          tag = "Generating Results..."
        }
        const axiosProgress = {
          tag,
          axiosProgress: progress
        }
        // console.log(progress)
        dispatch(setAxiosProgress(axiosProgress));
      }

    }
  }
  dispatch(setPlagiarismLocalLoading());
  dispatch(setPlagiarismGlobalCheck({loading: true, number: 4}));
  dispatch(setPlagiarismLocalJournal(true));
  dispatch(setDocumentId(input.docuId));
  dispatch(setPlagiarismLocalFromFlag(input.fromFlag))
  console.time("Initialize")
  // axios
  //   .post("/api/plagiarism/local/initialize/journal/pattern", input)
  //   .then(res => {
  //     console.log(res.data);
  //     if (res.data.success) {
        promises = []
        input.journals.forEach(function (journal) {
          if (journal._id !== input.docuId) {
            if (journal.document && journal.deleted !== 1) {
              promises.push(axios.post("/api/plagiarism/local/journal/result", { docuId: input.docuId, title: input.title, flag: input.flag, textId: journal._id, textTitle: journal.title, textFile: journal.document }, config))
              total++;
            }
          }

        })
        axios
          .all(promises)
          .then(res => {
            const hm = new jsscompress.Hauffman();
            let newres = [];
            res.forEach(function (r, index) {
              //console.log("MARK: "+index+" "+r.data.localPlagiarism.data)
              //newres.push(JSON.parse(hm.decompress(r.data.localPlagiarism.data)))
              newres.push(r.data.localPlagiarism.data)
            })
            newres.sort(function (obj1, obj2) {
              // Ascending: first age less than the previous
              return obj2.SimilarityScore - obj1.SimilarityScore;
            });
            total = 0;
            comFlag = 0;
            const axiosProgress = {
              tag: "",
              axiosProgress: 0
            }
            dispatch(setPlagiarismGlobalCheck({}));
            dispatch(setAxiosProgress(axiosProgress));
            console.timeEnd("Initialize")
            dispatch(outputLocalPlagiarism(newres));
            console.log("test")
            if (input.fromFlag) {
              history.push(`/localResultSideBySide/journal`);
            } else {
              history.push(`/localresult/journal`);
            }

          })
          .catch(err => {
            dispatch({
              type: GET_ERRORS,
              payload: err.response.data
            });
          });
    //   }//else{
    //   //   dispatch(outputLocalPlagiarism(res.data));
    //   //   dispatch({
    //   //     type: GET_ERRORS,
    //   //     payload: {initializeLocal: "Document not Found!"}
    //   //   });
    //   // }

    // })

};

export const setPlagiarismGenerateReportLoading = (input) => {
  return {
    type: PLAGIARISM_LOCAL_GENERATE_REPORT,
    payload: input
  };
}

export const setPlagiarismGlobalCheck= (input) => {
  return {
    type: PLAGIARISM_LOCAL_GLOBAL_CHECK,
    payload: input
  };
}

export const createLocalSideBySidePlagiarismReport = (input) => dispatch => {
  axios.post('/api/plagiarism/create/report/local/side', input)
    .then(() => axios.get('/api/plagiarism/get/report/local/side', { responseType: 'blob' }))
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' })

      saveAs(pdfBlob, 'PlagiarismLocalResult.pdf');
      dispatch(setPlagiarismGenerateReportLoading(false))
    })
}

export const createLocalPlagiarismReport = (input) => dispatch => {
  axios.post('/api/plagiarism/create/report/local', input)
    .then(() => axios.get('/api/plagiarism/get/report/local', { responseType: 'blob' }))
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' })

      saveAs(pdfBlob, 'PlagiarismLocalResult.pdf');
      dispatch(setPlagiarismGenerateReportLoading(false))
    })
}

export const checkPLagiarismSideBySide = (input) => dispatch => {
  dispatch(setPlagiarismLocalLoading());
  dispatch(setDocumentId(input.docuId));

}

export const getTextPattern = (input) => dispatch => {
  dispatch(setPlagiarismLocalPatternLoading())
  dispatch(setPlagiarismLocalShowDetails())
  dispatch(setTextDocumentId(input.textId))
  axios.post('/api/plagiarism/get/pattern', input)
    .then(res => {
      dispatch(outputLocalPlagiarismPattern(res.data));
    })
}
export const getPattern = (input) => dispatch => {
  dispatch(setPlagiarismLocalPatternLoading())
  axios.post('/api/plagiarism/get/pattern', input)
    .then(res => {
      dispatch(outputLocalPlagiarismPattern(res.data));
    })
}

export const getSourcePattern = (input) => dispatch => {
  dispatch(setPlagiarismLocalPatternLoading())
  dispatch(setTextDocumentId(input.textId))
  axios.post('/api/plagiarism/get/pattern', input)
    .then(res => {
      dispatch(outputLocalPlagiarismPattern(res.data));
    })
}

export const getJournalTextPattern = (input) => dispatch => {
  dispatch(setPlagiarismLocalPatternLoading())
  dispatch(setPlagiarismLocalShowDetails())
  dispatch(setTextDocumentId(input.textId))
  axios.post('/api/plagiarism/get/journal/pattern', input)
    .then(res => {
      dispatch(outputLocalPlagiarismPattern(res.data));
    })
}
export const getJournalPattern = (input) => dispatch => {
  dispatch(setPlagiarismLocalPatternLoading())
  axios.post('/api/plagiarism/get/journal/pattern', input)
    .then(res => {
      dispatch(outputLocalPlagiarismPattern(res.data));
    })
}

export const getJournalSourcePattern = (input) => dispatch => {
  dispatch(setPlagiarismLocalPatternLoading())
  dispatch(setTextDocumentId(input.textId))
  axios.post('/api/plagiarism/get/journal/pattern', input)
    .then(res => {
      dispatch(outputLocalPlagiarismPattern(res.data));
    })
}





export const getTargetText = (input) => dispatch => {
  dispatch(setPlagiarismLocalTextLoading())
  dispatch(setTextDocumentId(input.textId))
  axios.post('/api/plagiarism/get/text', input)
    .then(res => {
      dispatch(outputLocalPlagiarismText(res.data));
    })
}
export const getJournalTargetText = (input) => dispatch => {
  dispatch(setPlagiarismLocalTextLoading())
  dispatch(setTextDocumentId(input.textId))
  axios.post('/api/plagiarism/get/journal/text', input)
    .then(res => {
      dispatch(outputLocalPlagiarismText(res.data));
    })
}

export const setPlagiarismLocalAbstract = (flag) => {
  return {
    type: PLAGIARISM_LOCAL_SET_ABSTRACT,
    payload: flag
  };
};

export const setPlagiarismLocalJournal = (flag) => {
  return {
    type: PLAGIARISM_LOCAL_SET_JOURNAL,
    payload: flag
  };
};

export const setPlagiarismLocalFromFlag = (flag) => {
  return {
    type: PLAGIARISM_LOCAL_SET_FROM,
    payload: flag
  };
};

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

export const setPlagiarismLocalTextLoading = () => {
  return {
    type: PLAGIARISM_LOCAL_TEXT_LOADING
  };
};

export const outputLocalPlagiarismPattern = output => {
  return {
    type: PLAGIARISM_LOCAL_PATTERN,
    payload: output
  };
};

export const outputLocalPlagiarismText = output => {
  return {
    type: PLAGIARISM_LOCAL_TEXT,
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

// Clear local plagiarism state
export const clearLocalPlagiarismState = output => {
  return {
    type: PLAGIARISM_LOCAL_CLEAR_STATE,
  };
};
