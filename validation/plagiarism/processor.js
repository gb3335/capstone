const sw = require('../../stopword');

const duplicateArray= (arr) => {
        let new_array = [];
        for(let i=0;i<arr.length;i++){
                // arr[i] = arr[i].replace(/^\s+|\s+$/g, '');
                if(arr[i]==""){
                        new_array.push('.')
                }else{
                        // if(arr[i].substring(arr[i].length-1)==='.'){

                        // }
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
        
        // ********************************** //
        text =text.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ").replace(/[.]{2,}/g, '.');
        text = text.replace(/[^A-Za-z0-9. ]/g, "");
        text = text.replace(/\s+/g," ");
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
        // ************************************* //

        // text = text+".";
        // text = text.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ").replace(/[.]{2,}/g, '.');
        // text = text.replace(/[^A-Za-z0-9. ]/g, " ");
        // text = text.replace(/\s+/g," ");
        // let words = text.split(' '); // array words
        // words = sw.removeStopwords(words); // stopword
        // words = words.join(' ');

        // //new
        // words = words.split('.');
        // let newword=[];
        // words.forEach(word => {
        //         word = word.replace(/^ +/gm, '').replace(/[ \t]+$/gm, '');
        //         if(word){
                        
        //                 word = word.split(' ');
                        
        //                 word = duplicateArray(word);
        //                 word = word.filter(el =>{
        //                         return el != "";
        //                 });
        //                 word = word.join(' ');
        //                 newword.push(word+".");
                        
                        
        //         }
                
        // });
        // // let len = newword.length;
        // newword = duplicateArray(newword);
        // words = newword.join(' ');
        // // console.log(words)
        // // new
        // // words = words.replace(/[ ]{2,}/g, '. ')
        
        // words = words.replace(/^[. ]/g, '');
        // words = words.replace(/[. ]{2,}$/g,'')
        // let forLen = words.split('.');
        // let len = forLen.length-1;
        // words=words+".";
        // words = words.replace(/[.]{2,}/g, '.');
        
        // return {text: words, len};
}

module.exports = {
        arrayProcess,
        textProcess
}