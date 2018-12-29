import { PLAGIARISM_ONLINE, PLAGIARISM_ONLINE_INPUT} from '../actions/types'


const initialState = {
    original: "",
    output: {},
    loading: false
}


export default function (state = initialState, action) {
    switch (action.type) {
        case PLAGIARISM_ONLINE:
            return {
                ...state,
                output: action.payload
            }
        case PLAGIARISM_ONLINE_INPUT:
            return {
                ...state,
                original: action.payload
            }
        default:
            return state;
    }
}