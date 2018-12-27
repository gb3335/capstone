import {GET_PAGE_TITLE, HIDE_SIDEBAR} from './types';


// Change Page Title
export const changePageTitle = (pageTitle) =>{
    return {
        type: GET_PAGE_TITLE,
        payload: pageTitle
    }
}

export const hideSideBar = (flag) =>{
    return {
        type: HIDE_SIDEBAR,
        payload: flag
    }
}