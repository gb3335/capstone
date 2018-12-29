import { GET_ERRORS,GET_PAGE_TITLE,PLAGIARISM_ONLINE } from '../actions/types'

const initialState = {}


export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            return action.payload
        case GET_PAGE_TITLE:
            return {}
        case PLAGIARISM_ONLINE:
            return {}
        default:
            return state;
    }
}