export default () => {
  /* eslint-disable no-restricted-globals*/
    self.addEventListener("message", e => {
      // eslint-disable-line no-restricted-globals
      if (!e) return;
        const args = e.data.args;
        
        let words = [];
      
        // args.output[0].Index.forEach(index => {
        //   let obj = JSON.parse(index);
        //   words.push(obj.Pattern)
        // })
        args.output.forEach((out) => {
          out.Index.forEach((index) => {
            let obj = JSON.parse(index);
            words.push(obj.Pattern)
          })
        })
        // let words2= words.join(' ').split(' ');
        const uniqueItems = words.filter((v, i, a) => a.indexOf(v) === i); 

        const chunks = [];
        const textLow = args.textToHighlight.toLowerCase();
        // Match at the beginning of each new word
        // New word start after whitespace or - (hyphen)
        const startSep = /[^a-zA-Z\d]/;

        // Match at the beginning of each new word
        // New word start after whitespace or - (hyphen)
        const singleTextWords = textLow.split(startSep);
        // It could be possible that there are multiple spaces between words
        // Hence we store the index (position) of each single word with textToHighlight
        let fromIndex = 0;
        const singleTextWordsWithPos = singleTextWords.map(s => { //Compound

          const indexInWord = textLow.indexOf(s, fromIndex); // Index = 0
          fromIndex = indexInWord;
          return {
            word: s,
            index: indexInWord
          };
        });

        // Add chunks for every searchWord
        uniqueItems.forEach(sw => {

          const swLow = sw.toString().toLowerCase();
          // Do it for every single text word
          singleTextWordsWithPos.forEach(s => {

            if (s.word.startsWith(swLow) && s.word.endsWith(swLow)) {
              const start = s.index;
              const end = s.index + swLow.length;
              chunks.push({
                start,
                end
              });
            }
          });

        });
      postMessage({chunks, words: uniqueItems});
    });
  };
  