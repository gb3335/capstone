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

const textProcess = (text) => {
        text =text.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ");
        text = text.replace(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/g, " ");
        let words = text.split(' ');
        words = sw.removeStopwords(words);
        words = words.join(' ');

        const textarr = words.split('.');
        const textdupliremoved = duplicateArray(textarr);
        textdupliremoved.forEach((t, index) => {
                let newtext = t.split(' ');
                newtext = duplicateArray(newtext);
                textdupliremoved[index] = newtext.join(' ');
        })
        return textdupliremoved;
}

module.exports = {
        // arrayProcess,
        textProcess
}