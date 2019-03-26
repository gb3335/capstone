import {GRAMMAR_CHECK, GRAMMAR_CHECK_LOADING} from '../actions/types'

const initialState = {
    input: "",
    output: {},
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
       case GRAMMAR_CHECK:
            return {
                ...state,
                output: action.payload,
                loading: false
            }
        case GRAMMAR_CHECK_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}