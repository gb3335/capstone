import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";

import Highlighter from "react-highlight-words";

import { getTextPattern} from "../../actions/localPlagiarismActions";

import "./LocalResult_id.css"

import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
 class LocalResult_id extends Component {

  constructor() {
    super();
    this.state = {
      words: []
    };
    
  }

  componentWillMount(){
    if (this.props.match.params.id) {
      const input = {
        docuId : this.props.localPlagiarism.docuId,
        textId: this.props.match.params.id
      }
      this.props.getTextPattern(input);
    }
  }

  componentDidMount(){
    const {output , textId} = this.props.localPlagiarism;

    let Index = output.find(obj => obj.DocumentScore.Document_2.Name === textId);
    
    let words = [];
    
    Index.Index.forEach((index =>{
      let obj = JSON.parse(index);
      words.push(obj.Word)
    }))
    console.log(words)
    this.setState({words})
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
    const startSep = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    
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
        
       if (s.word === swLow) {
          const start = s.index;
          const end = s.index + swLow.length;
          chunks.push({
            start,
            end
          });
        }
      });

      // The complete word including whitespace should also be handled, e.g.
      // searchWord='Angela Mer' should be highlighted in 'Angela Merkel'
      if (textLow.startsWith(swLow)) {
        const start = 0;
        const end = swLow.length;
        chunks.push({
          start,
          end
        });
      }
    });

    return chunks;
  };

  render() {
    const { pattern, patternLoading } = this.props.localPlagiarism;

    let items;

    if (pattern === null || patternLoading) {
      items = (
        <div className="row">
          <div className="col-md-12">
            <Spinner />
          </div>
        </div>
      );
    } else{
      items = (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-9">
                <Highlighter
                  highlightClassName="hightlight"
                  searchWords={this.state.words}
                  autoEscape={true}
                  textToHighlight={pattern.data}
                  findChunks={this.findChunksAtBeginningOfWords}
                />
                </div>
                <div className="col-md-3">

                </div>
            </div>
        </div>
        
      )
    }

    return (
      <div>
        {items}
      </div>
    )
  }
}

LocalResult_id.propTypes = {
  localPlagiarism: PropTypes.object.isRequired,
  getTextPattern : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  localPlagiarism: state.localPlagiarism,
});

export default connect(mapStateToProps, {getTextPattern})(LocalResult_id)