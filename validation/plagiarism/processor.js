const sw = require('../../stopword');

const duplicateArray= (arr) => {
        let new_array = [];
        for(let i=0;i<arr.length;i++){
                // arr[i] = arr[i].replace(/^\s+|\s+$/g, '');
                if(arr[i]==""){
                        new_array.push('.')
                }else{
                        if(arr.indexOf(arr[i])==i){
                                new_array.push(arr[i])
                        }
                }
                
        }

        //return [...new Set(arr)];
        return new_array
}

const arrayProcess = (text) => {
        text =text.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ").replace(/[.]{2,}/g, '.');
        text = text.replace(/[^A-Za-z0-9. ]/g, " ");

        let words = text.split(' ');
        words = sw.removeStopwords(words);
        words = duplicateArray(words);
        words = words.filter(el =>{
                return el != "";
        });
        words = words.join(' ').split('.');
        words = words.join(' ').split(' ');
        words = duplicateArray(words);
        words = words.join(' ').split('.');
        words = words.join(' ');
        words = words.replace(/[ ]{2,}/g, '. ')

        words = words.replace(/^[. ]/g, '');
        words = words.replace(/[. ]{2,}$/g,'')
        let forLen = words.split('.');
        let len = forLen.length;

        words = words.split(' ');

        words[words.length-1] = words[words.length-1]+"."

        return {arr: words, len};
}

const textProcess = (text) => {
        text =text.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ").replace(/[.]{2,}/g, '.');
        text = text.replace(/[^A-Za-z0-9. ]/g, " ");

        let words = text.split(' ');
        words = sw.removeStopwords(words);
        words = duplicateArray(words);
        words = words.filter(el =>{
                return el != "";
        });
        words = words.join(' ').split('.');
        words = words.join(' ').split(' ');
        words = duplicateArray(words);
        words = words.join(' ').split('.');
        
        words = words.join(' ');
        words = words.replace(/[ ]{2,}/g, '. ')
        
        
        words = words.replace(/^[. ]/g, '');
        words = words.replace(/[. ]{2,}$/g,'')
        let forLen = words.split('.');
        let len = forLen.length;
        words=words+".";
        
        return {text: words, len};
}

module.exports = {
        arrayProcess,
        textProcess
}