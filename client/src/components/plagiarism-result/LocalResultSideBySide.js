import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";

import './LocalResultSideBySide.css'

import ResultPie from './ResultPie';

import { getSourcePattern, getTargetText,createLocalSideBySidePlagiarismReport,setPlagiarismGenerateReportLoading,clearLocalPlagiarismState } from "../../actions/localPlagiarismActions";

import Highlighter from "react-highlight-words";

class LocalResultSideBySide extends Component {
  constructor() {
    super();
    this.state = {
     level: 0,
      words: []
    };

    this.textItem = React.createRef();
    this.patternItem = React.createRef();
  }

  componentWillUnmount(){
    this.props.clearLocalPlagiarismState();
  }

  componentWillMount(){
    if (Object.entries(this.props.localPlagiarism.output).length === 0 && this.props.localPlagiarism.output.constructor === Object) {
      this.props.history.push("/dashboard");
    }else{
      const {output, docuId, abstract} = this.props.localPlagiarism;
      const {researches} = this.props.research
      
        let level=0;
  
        if(output[0].SimilarityScore>0 && output[0].SimilarityScore<30){
          level=1;
        }else if(output[0].SimilarityScore>=30 && output[0].SimilarityScore<=70){
          level=2;
        }
        else if(output[0].SimilarityScore>70){
          level=3;
        }
  
        this.setState({level})
  
        const input = {
          docuId : docuId,
          docuFile : this.props.research.research.document,
          textId: output[0].Document.Text.Id,
          abstract
        }
  
        this.props.getSourcePattern(input);
  
        let textdocument = researches.find(obj => obj._id === output[0].Document.Text.Id)
  
        const input2 = {
          docuId : output[0].Document.Text.Id,
          docuFile : textdocument.document,
          textId: output[0].Document.Text.Id,
          abstract
        }
  
        
        this.props.getTargetText(input2);
      
      let words = [];
        if(output[0].Index.length > 0){
          output[0].Index.forEach((index =>{
            let obj = JSON.parse(index);
      
            words.push.apply(words,obj.Pattern.split(' '))
          }))
        }
      
      
      this.setState({words})
      }
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

  onClickGenerateReport = () => {
    const {output, abstract} = this.props.localPlagiarism
    
    this.props.setPlagiarismGenerateReportLoading(true);

    // const node = ReactDOM.findDOMNode(this);

      // Get child nodes
      let pattern = this.patternItem.current.children[0].innerHTML.toString();
      let text = this.textItem.current.children[0].innerHTML.toString();
      // pattern = pattern.innerHTML.toString()
      // text = text.innerHTML.toString()

      const name =
          this.props.auth.user.name.firstName +
          " " +
          this.props.auth.user.name.middleName +
          " " +
          this.props.auth.user.name.lastName;

      let subTypeOfReport = "Side by Side Comparison";

      if(abstract){
        subTypeOfReport = "Side by Side Comparison (ABSTRACT)";
      }

      const input = {
        printedBy: name,
        pattern,
        text,
        typeOfReport: "Plagiarism Check Result",
        subTypeOfReport,
        output
      }
      this.props.createLocalSideBySidePlagiarismReport(input);
  }

  render() {

    const {output, patternLoading, textLoading, pattern, text} = this.props.localPlagiarism;

    let patternItem;
    let textItem;

    if(patternLoading || pattern===""){
      patternItem = (
        <div className="row">
            <div className="col-md-12">
              <Spinner />
            </div>
          </div>
      )
    }else{
      patternItem = (
        <div className="hightlightSpanDivSbS">
          <div className="highlightComponentDiv" ref={this.patternItem}>
            <Highlighter
              id="highlightPat"
              className="highlightSpan"
              highlightClassName="hightlight"
              searchWords={this.state.words}
              autoEscape={true}
              textToHighlight={pattern.data}
              findChunks={this.findChunksAtBeginningOfWords}
            />
          </div>
          
        </div>
      )
    }

    if(textLoading || text===""){
      textItem = (
        <div className="row">
            <div className="col-md-12">
              <Spinner />
            </div>
          </div>
      )
    }else{
      textItem = (
        <div className="hightlightSpanDivSbS">
          <div className="highlightComponentDiv" ref={this.textItem}>
            <Highlighter
              id="highlightText"
              className="highlightSpan"
              highlightClassName="hightlight"
              searchWords={this.state.words}
              autoEscape={true}
              textToHighlight={text.data}
              findChunks={this.findChunksAtBeginningOfWords}
            />
          </div>
          
        </div>
      )
    }

    const {generateReport} = this.props.localPlagiarism
    return (
      <div className="research">
        {Object.entries(this.props.localPlagiarism.output).length !== 0 && this.props.localPlagiarism.output.constructor !== Object ?
        <div className="container-fluid" style={{ padding: "1em" }}>
        <div className="row">
                    <div className="col-md-12">
                      
                        <Link
                            to={`/researches/${this.props.localPlagiarism.docuId}`}
                            className="btn btn-light mb-1"
                          >
                            <i className="fas fa-angle-left" /> Back
                        </Link>
                        {generateReport ? <button
                          className="btn btn-light mb-1 disabled float-right"
                        >
                          <i className="fas fa-flag text-danger" /> Generating Report...
                        </button>: 
                        textLoading || patternLoading ? <button
                        className="btn btn-light mb-1 disabled float-right"
                      >
                        <i className="fas fa-flag text-danger" /> Generating Report
                      </button>: 
                        <button
                          onClick={this.onClickGenerateReport}
                          className="btn btn-light mb-1 float-right"
                        >
                          <i className="fas fa-flag text-danger" /> Generate Report
                        </button>}
                    
                    </div>
                  </div>
        <div className="row">
            <div className="container-fluid">
                <div className="row">
                <div className="col-md-12">
                  <div className="sourceResearch">
                      <div className="sourceHeader">Side By Side Similarity Score</div>
                      <div className="sourceContent">
                        <div className="row">
                            <div className="col-md-4">
                             <ResultPie legend={true} height={200} similarity={parseFloat(output[0].SimilarityScore).toFixed(2)} />
                            </div>
                            <div className="col-md-8 overviewContent pt-2">
                                <p><b>Similarity Score: </b> {parseFloat(output[0].SimilarityScore).toFixed(2)}%</p>
                                <p className="pt-3"><b>Source Document: </b> {output[0].Document.Pattern.Name}</p>
                                <p><b>Target Document: </b> {output[0].Document.Text.Name}</p>
                                <p><b>Plagiarism Level: </b> {this.state.level===1 ? <span className="little-text">Little Plagiarism</span> : this.state.level===2 ? <span className="moderate-text">Moderate Plagiarism</span> : this.state.level===3 ? <span className="heavy-text">Heavy Plagiarism</span> : <span>Clean</span>} </p>
                            </div>
                        </div>
                        
                      </div>
                  </div>
                </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="sourceResearch">
                        <div className="sourceHeader">{output[0].Document.Pattern.Name}</div>
                        <div className="sourceContent">
                          {patternItem}
                        </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                  <div className="sourceResearch">
                        <div className="sourceHeader">{output[0].Document.Text.Name}</div>
                        <div className="sourceContent">
                          {textItem}
                        </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </div>
        
        : ""}
        
      </div>
    )
  }
}

LocalResultSideBySide.propTypes = {
  localPlagiarism: PropTypes.object.isRequired,
  research: PropTypes.object.isRequired,
  getSourcePattern: PropTypes.func.isRequired,
  createLocalSideBySidePlagiarismReport: PropTypes.func.isRequired,
  getTargetText: PropTypes.func.isRequired,
  setPlagiarismGenerateReportLoading: PropTypes.func.isRequired,
  clearLocalPlagiarismState: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  localPlagiarism: state.localPlagiarism,
  research: state.research,
  auth: state.auth
});

export default connect(mapStateToProps,{ getSourcePattern, getTargetText,createLocalSideBySidePlagiarismReport,setPlagiarismGenerateReportLoading,clearLocalPlagiarismState })(LocalResultSideBySide)
