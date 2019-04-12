import { PLAGIARISM_RAW_LOCAL, PLAGIARISM_RAW_LOCAL_INPUT,PLAGIARISM_RAW_LOCAL_DISABLE_BUTTON, PLAGIARISM_RAW_LOCAL_AXIOS_PROGRESS, PLAGIARISM_RAW_LOCAL_LOADING,PLAGIARISM_RAW_LOCAL_SET_ABSTRACT,PLAGIARISM_RAW_LOCAL_GENERATE_REPORT, PLAGIARISM_RAW_LOCAL_SHOW_DETAILS, PLAGIARISM_RAW_LOCAL_HIDE_DETAILS, PLAGIARISM_RAW_LOCAL_SET_OPTION } from '../actions/types'

const initialState = {
    original: "",
    output: {},
    loading: false,
    buttonDisable: false,
    showDetails: false,
    generateReport: false,
    axiosProgress: {},
    abstract: false,
    option: 1,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case PLAGIARISM_RAW_LOCAL:
            return {
                ...state,
                output: action.payload,
                loading: false,
                buttonDisable: false
            }
        case PLAGIARISM_RAW_LOCAL_INPUT:
            return {
                ...state,
                original: action.payload,
                buttonDisable: false
            }
        case PLAGIARISM_RAW_LOCAL_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case PLAGIARISM_RAW_LOCAL_SET_ABSTRACT:
            return {
                ...state,
                abstract: action.payload
            }
        case PLAGIARISM_RAW_LOCAL_GENERATE_REPORT:
            return {
                ...state,
                generateReport: action.payload
            }
        case PLAGIARISM_RAW_LOCAL_SHOW_DETAILS:
            return {
                ...state,
                showDetails: true
            }
        case PLAGIARISM_RAW_LOCAL_HIDE_DETAILS:
            return {
                ...state,
                showDetails: false
            }
        case PLAGIARISM_RAW_LOCAL_AXIOS_PROGRESS:
            return {
                ...state,
                axiosProgress: action.payload
            }
        case PLAGIARISM_RAW_LOCAL_DISABLE_BUTTON:
            return {
                ...state,
                buttonDisable: true
            }
        case PLAGIARISM_RAW_LOCAL_SET_OPTION:
            return {
                ...state,
                option: action.payload
            }
        default:
            return state;
    }
}