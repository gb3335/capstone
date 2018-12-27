import { GET_PAGE_TITLE,HIDE_SIDEBAR } from '../actions/types'

const initialState = {
    pageTitle: "Welcome to our Website",
    hide: false
}


export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PAGE_TITLE:
            return {
                ...state,
                pageTitle: action.payload
            }
        case HIDE_SIDEBAR:
            return {
                ...state,
                hide: !action.payload
            }
        default:
            return state;
    }
}