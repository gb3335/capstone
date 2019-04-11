const checkPlagiarism = (text, pattern, textSentenceLen, patternSentenceLen) => {
    let result = {};
  
    let textWordLen;
    let patternWordLen;
    let curHitNum = 0;
    let index= [];
  
    let sentenceSimilarNum = 0;
  
    pattern = pattern.split('.');
    text = text.split('.');
    text.forEach(t => {
      if(t!==""){
        t=t.replace(/^\s+/g, '').replace(/\s+$/,"");
        t = t.split(' ').sort();
        textWordLen = t.length;
        pattern.forEach(pat => {
          if(pat!==""){
            pat = pat.replace(/^\s+/g, '').replace(/\s+$/,"");
            pat = pat.split(' ');
            patternWordLen = pat.length;
            pat.forEach(p => {
              let binary = binarySearch(t, p);
              if(binary!==-1){
                curHitNum++;
              }
            })
            if(calculateSentence(curHitNum, textWordLen, patternWordLen) > 80){
              sentenceSimilarNum++;
              index.push(`{ "Pattern": "${pat.join(' ')}"}`);
            }
            curHitNum=0;
          }
          
        })
      }
      
    });
    result.pattern = (sentenceSimilarNum/patternSentenceLen)*100;
    if(result.pattern>100){
      result.pattern=100;
    }
    result.text = (sentenceSimilarNum/textSentenceLen)*100;
    result.index = index;
    return result;
  }
  
  const calculateSentence = (numOfHits, textWordLen, patternWordLen) => {
    let pattern = (numOfHits/patternWordLen)*100;
    let text = (numOfHits/textWordLen)*100;
  
    let result = (pattern+text)/2;
    
    return result;
  }
  
  const binarySearch = (items, value) => {
    let startIndex  = 0,
        stopIndex   = items.length - 1,
        middle      = Math.floor((stopIndex + startIndex)/2);
  
    while(items[middle] != value && startIndex < stopIndex){
  
        //adjust search area
        if (value < items[middle]){
            stopIndex = middle - 1;
        } else if (value > items[middle]){
            startIndex = middle + 1;
        }
  
        //recalculate middle
        middle = Math.floor((stopIndex + startIndex)/2);
    }
  
    //make sure it's the right value
    return (items[middle] != value) ? -1 : middle;
  }
  

  module.exports = {
    checkPlagiarism
}