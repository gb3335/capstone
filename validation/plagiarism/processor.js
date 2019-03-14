const sw = require('stopword');
const stripchar = require('stripchar').StripChar;

const duplicateArray= (arr) => {
        let new_array = [];
        for(let i=0;i<arr.length;i++){
                arr[i] = arr[i].replace(/^\s+|\s+$/g, '');
                if(arr.indexOf(arr[i])==i){
                        new_array.push(arr[i])
                }
        }
        return new_array;
}

// const arrayProcess = (arr) => {
//         arr = arr.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ");
//         arr = arr.replace(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/g, " ");
//         const newarr = arr.split('.');
//         const dupliremoved = duplicateArray(newarr);
//         return sw.removeStopwords(dupliremoved);
// }

const arrayProcess = (text) => {
        text =text.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ").replace(/[.]{2,}/g, '.');
        text = text.replace(/[^A-Za-z0-9. ]/g, " ");

        const textarr = text.split('.');
        const len = textarr.length;
        let arr = [];
        textarr.forEach((t, index) => {
                let newtext = t.split(' ');
                newtext = sw.removeStopwords(newtext);
                newtext = duplicateArray(newtext);
                newtext = newtext.filter(el =>{
                        return el != "";
                });
                newtext[newtext.length-1] = newtext[newtext.length-1]+".";
                
                arr.push(newtext.join(' '));

        })
        arr = duplicateArray(arr);
        arr = arr.filter(el =>{
                return el != "";
        });
        arr = arr.join(' ').split(' ');
        return {arr, len};
}

const textProcess = (text) => {
        text =text.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ").replace(/[.]{2,}/g, '.');
        text = text.replace(/[^A-Za-z0-9. ]/g, " ");

        const textarr = text.split('.');
        let arr = [];
        textarr.forEach((t, index) => {
                let newtext = t.split(' ');
                newtext = sw.removeStopwords(newtext);
                newtext = duplicateArray(newtext);
                
                newtext = newtext.filter(el =>{
                        return el != "";
                });
                if(newtext.length!=0){
                        arr.push(newtext.join(' '));
                }
        })
        arr = duplicateArray(arr);
        let len = arr.length;
        return {text: arr.join('. '), len};
}

module.exports = {
        arrayProcess,
        textProcess
}