import { PLAGIARISM_ONLINE, PLAGIARISM_ONLINE_INPUT, PLAGIARISM_ONLINE_LOADING, PLAGIARISM_ONLINE_DISABLE_BUTTON, PLAGIARISM_ONLINE_SHOW_DETAILS, PLAGIARISM_ONLINE_HIDE_DETAILS, PLAGIARISM_ONLINE_GOOGLE, PLAGIARISM_ONLINE_GENERATE_REPORT, PLAGIARISM_ONLINE_CLEAR_OUTPUT} from '../actions/types'


const initialState = {
    original: "",
    output: {},
    googleOutput: {},
    loading: false,
    buttonDisable: false,
    showDetails: false,
    generateReport: false
}


export default function (state = initialState, action) {
    switch (action.type) {
        case PLAGIARISM_ONLINE:
            return {
                ...state,
                output: action.payload,
                loading: false,
                buttonDisable: false
            }
        case PLAGIARISM_ONLINE_GOOGLE:
            return {
                ...state,
                googleOutput: action.payload
            }
        case PLAGIARISM_ONLINE_INPUT:
            return {
                ...state,
                original: action.payload,
                buttonDisable: false
            }
        case PLAGIARISM_ONLINE_LOADING:
            return {
                ...state,
                loading: true
            }
        case PLAGIARISM_ONLINE_DISABLE_BUTTON:
            return {
                ...state,
                buttonDisable: true
            }
        case PLAGIARISM_ONLINE_SHOW_DETAILS:
            return {
                ...state,
                showDetails: true
            }
        case PLAGIARISM_ONLINE_HIDE_DETAILS:
            return {
                ...state,
                showDetails: false
            }
        case PLAGIARISM_ONLINE_GENERATE_REPORT:
            return {
                ...state,
                generateReport: action.payload
            }
        case PLAGIARISM_ONLINE_CLEAR_OUTPUT:
            return {
                ...state,
                output: {}
            }
        default:
            return state;
    }
}