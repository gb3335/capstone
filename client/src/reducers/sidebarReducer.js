import { GET_PAGE_TITLE } from '../actions/types'

const initialState = {
    pageTitle: "Dashboard"
}


export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PAGE_TITLE:
            return {
                ...state,
                pageTitle: action.payload
            }
        default:
            return state;
    }
}