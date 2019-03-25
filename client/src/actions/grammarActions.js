import {
    GRAMMAR_CHECK,
    GRAMMAR_CHECK_LOADING
  } from "./types";
  import axios from "axios";

export const checkGrammar = input => dispatch => {
    dispatch(setGrammarLoading());
    axios.post('/api/grammar/', input)
    .then(res => {
        dispatch(outputCheckGrammar(res.data));
    })    
};

export const outputCheckGrammar = output => {
    return {
        type: GRAMMAR_CHECK,
        payload: output
    };
}

export const setGrammarLoading = input => {
    return {
        type: GRAMMAR_CHECK_LOADING
    };
}