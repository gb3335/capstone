import { GET_ERRORS,GET_PAGE_TITLE } from '../actions/types'

const initialState = {}


export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            return action.payload
        case GET_PAGE_TITLE:
            return {}
        default:
            return state;
    }
}