import { PLAGIARISM_ONLINE, GET_ERRORS } from './types'
import axios from 'axios';

// Check Plagiarism Online
export const checkPlagiarismOnline = (input) => dispatch => {
    axios.post('/api/google', input)
        .then(res => {
            dispatch(outputOnlinePlagiarism(res.data))
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            }))
};
// Dispatch
export const outputOnlinePlagiarism = (output) => {
    return {
        type: PLAGIARISM_ONLINE,
        payload: output
    }
}
