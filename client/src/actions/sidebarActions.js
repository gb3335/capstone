import {GET_PAGE_TITLE} from './types';


// Change Page Title
export const changePageTitle = (pageTitle) =>{
    return {
        type: GET_PAGE_TITLE,
        payload: pageTitle
    }
}