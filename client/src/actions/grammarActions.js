import {
    GRAMMAR_CHECK,
    GRAMMAR_CHECK_LOADING,
    GET_ERRORS,
    CLEAR_ERRORS
  } from "./types";
  import axios from "axios";

export const checkGrammar = input => dispatch => {
    dispatch(setGrammarLoading(true));
    dispatch(clearError());
    axios.post('/api/grammar/', input)
    .then(res => {
        dispatch(outputCheckGrammar(res.data));
    })
    .catch(err => {
        dispatch(setGrammarLoading(false));
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })}
      );
};

export const outputCheckGrammar = output => {
    return {
        type: GRAMMAR_CHECK,
        payload: output
    };
}

export const setGrammarLoading = input => {
    return {
        type: GRAMMAR_CHECK_LOADING,
        payload: input
    };
}

export const clearError = input => {
    return {
        type: CLEAR_ERRORS
    };
}