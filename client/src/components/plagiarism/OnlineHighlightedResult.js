import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Highlighter from "react-highlight-words";


import "./OnlineHighlightedResult.css"

 class OnlineHighlightedResult extends Component {

  constructor() {
    super();
    this.state = {
      words: [],
      pattern: ""
    };

  }

  componentWillReceiveProps(nextProps){
    this.setState({words: nextProps.words, pattern: nextProps.pattern})
  }

  componentDidMount(){
    
    this.setState({words: this.props.words, pattern: this.props.pattern})
  }

  // Complex example
  findChunksAtBeginningOfWords = ({
    autoEscape,
    caseSensitive,
    sanitize,
    searchWords,
    textToHighlight
  }) => {
    const chunks = [];
    const textLow = textToHighlight.toLowerCase();
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
    searchWords.forEach(sw => {
      
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

    return chunks;
  };

  render() {
    

    return (
     
        <div className="hightlightSpanDivs">
          <div className="highlightComponentDivs" ref={this.highlightRef}>
          <p>
            <Highlighter
              className="highlightSpan"
              highlightClassName="hightlight"
              searchWords={this.state.words}
              autoEscape={true}
              textToHighlight={this.state.pattern}
              findChunks={this.findChunksAtBeginningOfWords}
            />
            </p>
          </div>
          
        </div>
      
    )
  }
}

OnlineHighlightedResult.propTypes = {
  onlinePlagiarism: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  onlinePlagiarism: state.onlinePlagiarism,
});

export default connect(mapStateToProps)(OnlineHighlightedResult)