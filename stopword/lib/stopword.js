var defaultStopwords = require('./stopwords_en.js').words
var defaultStopwordsWithDot = require('./stopwords_en.js').wordsWithDot

exports.removeStopwords = function(tokens, stopwords) {
  stopwords = defaultStopwords
  stopwordsWithDot = defaultStopwordsWithDot
  if (typeof tokens !== 'object' || typeof stopwords != 'object'){
    throw new Error ('expected Arrays try: removeStopwords(Array[, Array])')
  }
  return tokens.filter(function (value) {
    if(value.substr(value.length - 1) =='.' ){
      return stopwordsWithDot.indexOf(value.toLowerCase()) === -1
    }else{
      return stopwords.indexOf(value.toLowerCase()) === -1
    }
    
  })
}

exports.en = require('./stopwords_en.js').words

