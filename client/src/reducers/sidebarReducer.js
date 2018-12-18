import { GET_PAGE_TITLE } from '../actions/types'

const initialState = {
    pageTitle: "Welcome to our Website"
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