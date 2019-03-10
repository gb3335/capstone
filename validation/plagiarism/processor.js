const sw = require('stopword');
const stripchar = require('stripchar').StripChar;

const duplicateArray= (arr) => {
        let new_array = [];
        for(let i=0;i<arr.length;i++){
                if(arr.indexOf(arr[i])==i){
                        new_array.push(arr[i])
                }
        }
        return new_array;
}

const arrayProcess = (arr) => {
        arr = arr.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ");
        arr = stripchar.RSspecChar(arr);
        const newarr = arr.split(' ');
        const dupliremoved = duplicateArray(newarr);
        return sw.removeStopwords(dupliremoved);
}

const textProcess = (text) => {
        text =text.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ");
        text = stripchar.RSspecChar(text);
        const textarr = text.split(' ');
        const textdupliremoved = duplicateArray(textarr);
        const stopwordRemoved = sw.removeStopwords(textdupliremoved);
        return stopwordRemoved.join(' ');
}

module.exports = {
        arrayProcess,
        textProcess
}