const sw = require('../../stopword');

const duplicateArray= (arr) => {
        let new_array = [];
        for(let i=0;i<arr.length;i++){
                // arr[i] = arr[i].replace(/^\s+|\s+$/g, '');
                ////// if(arr[i]==""){
                //////         new_array.push('.')
                ////// }else{
                        // if(arr[i].substring(arr[i].length-1)==='.'){

                        // }
                        if(arr.indexOf(arr[i])==i){
                                new_array.push(arr[i])
                        }
                ////// }
                
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
        // text =text.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ").replace(/[.]{2,}/g, '.');
        // text = text.replace(/[^A-Za-z0-9. ]/g, "");
        // text = text.replace(/\s+/g," ");
        // let words = text.split(' ');
        // words = sw.removeStopwords(words);
        // words = duplicateArray(words);
        // words = words.filter(el =>{
        //         return el != "";
        // });
        // words = words.join(' ').split('.');
        // words = words.join(' ').split(' ');
        // words = duplicateArray(words);
        // words = words.join(' ').split('.');
        
        // words = words.join(' ');
        // words = words.replace(/[ ]{2,}/g, '. ')
        
        
        // words = words.replace(/^[. ]/g, '');
        // words = words.replace(/[. ]{2,}$/g,'')
        // let forLen = words.split('.');
        // let len = forLen.length;
        // words=words+".";
        
        // return {text: words, len};
        // ************************************* //

        // REAL SHERLOCK START
        text =text.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ").replace(/[.]{2,}/g, '.');
        text = text.replace(/[^A-Za-z0-9. ]/g, "");
        text = text.replace(/\s+/g," ");

        let words = text.split('.');
        words = words.filter(el =>{
                return el != "";
        });
        let newword= [];
        words.forEach((word)=>{
                word = word.replace(/^\s+/g, '').replace(/\s+$/,"");
                
                word = word.split(' ');
                word = sw.removeStopwords(word);
                word = duplicateArray(word);
                
                word = word.filter(el =>{
                        return el != "";
                });

                word = word.join(' ');
                if(word!==""){
                        let flag=0;
                        let word1 = word.replace(/[^A-Za-z0-9 ]/g, "").split(' ');
                        word1.sort();
                        newword.forEach((n)=> {
                                let word2 = n.replace(/[^A-Za-z0-9 ]/g, "").split(' ');        
                                if(JSON.stringify(word1) === JSON.stringify(word2)){
                                        flag=1;
                                }
                        })      
                        if(flag===0){
                                word = word+'.';
                                newword.push(word);
                        }
                }     
        })
        words = newword.join(' ');
        let forlen = words.split('.').length-1;
        
        return {text: words,len:forlen};

        // REAL SHERLOCK END
        
}

module.exports = {
        arrayProcess,
        textProcess
}