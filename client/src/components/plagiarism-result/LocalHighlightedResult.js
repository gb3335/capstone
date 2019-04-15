import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Highlighter from "react-highlight-words";
import parse from 'html-react-parser';


//workers
import worker from "./workers/workerHighlight";
import WebWorker from "./workers/WorkerSetup";

import Spinner from "../common/Spinner";
import "./LocalHighlightedResult.css"

 class LocalHighlightedResult extends Component {

  constructor() {
    super();
    this.state = {
      words: [],
      chunks: [],
      show: false,
      pattern: ""
    };
    
  }

  componentDidMount(){
    this.worker = new WebWorker(worker);
    const {output , textId, pattern} = this.props.localPlagiarism;

    this.setState({pattern: pattern.data, show: true})

    // this.worker.postMessage({"args": {output, textId, textToHighlight: this.props.localPlagiarism.pattern.data}});

    // this.worker.addEventListener("message", event => {
    //   this.setState({
    //     words: event.data.words,
    //     show: true
    //   });
    // });
    // let Index = output.find(obj => obj.Document.Text.Id === textId);
    
    // let words = [];
    // if(Index.Index.length > 0){
    //   Index.Index.forEach((index =>{
    //     let obj = JSON.parse(index);
  
    //     words.push.apply(words,obj.Pattern.split(' '))
    //   }))
    // }
    
    
    // this.setState({words},()=>{
    //   this.findHighlight()
    // })
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
    const {pattern} = this.props.localPlagiarism;

    return (
      <div>
        {this.state.show ?
        <div className="hightlightSpanDiv">
          
          {/* <Highlighter
              className="highlightSpan"
              highlightClassName="hightlight"
              searchWords={this.state.words}
              autoEscape={true}
              textToHighlight={pattern.data}
              //findChunks={() => this.state.chunks}
            /> */}
            {parse(this.state.pattern)}
          
         
        
        </div> : <Spinner/>}
      </div>
      
    )
  }
}

LocalHighlightedResult.propTypes = {
  localPlagiarism: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  localPlagiarism: state.localPlagiarism,
});

export default connect(mapStateToProps)(LocalHighlightedResult)