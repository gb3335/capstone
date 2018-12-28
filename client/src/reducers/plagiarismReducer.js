import { PLAGIARISM_ONLINE} from '../actions/types'


const initialState = {
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
        default:
            return state;
    }
}