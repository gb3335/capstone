import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
import parse from 'html-react-parser';

import './LocalResultSideBySide.css'

import ResultPie from './ResultPie';

import { getJournalSourcePattern, getJournalTargetText, createLocalSideBySidePlagiarismReport, setPlagiarismGenerateReportLoading,clearLocalPlagiarismState } from "../../actions/localPlagiarismActions";

import Highlighter from "react-highlight-words";

class LocalResultSideBySide extends Component {
  constructor() {
    super();
    this.state = {
      level: 0,
      words: [],
      pattern: "",
      text: "",
      showPattern: true,
      showText: true
    };
    this.textItem = React.createRef();
    this.patternItem = React.createRef();
  }

  componentWillUnmount(){
    this.props.clearLocalPlagiarismState();
  }

  componentWillMount() {
    if (Object.entries(this.props.localPlagiarism.output).length === 0 && this.props.localPlagiarism.output.constructor === Object) {
      this.props.history.push("/dashboard");
    }else{
    const { output, docuId, abstract, pattern, text } = this.props.localPlagiarism;
    const { journals } = this.props.journal

    let level = 0;

    if (output[0].SimilarityScore > 0 && output[0].SimilarityScore < 30) {
      level = 1;
    } else if (output[0].SimilarityScore >= 30 && output[0].SimilarityScore <= 70) {
      level = 2;
    }
    else if (output[0].SimilarityScore > 70) {
      level = 3;
    }

    this.setState({ level })
    let words = output[0].Index.patternIndex;
    const uniqueItems = words.filter((v, i, a) => a.indexOf(v) === i); 

    const input = {
      docuId: docuId,
      docuFile: this.props.journal.journal.document,
      textId: output[0].Document.Text.Id,
      Indexes: uniqueItems
    }

    this.props.getJournalSourcePattern(input, (e) =>{
      this.setState({pattern: pattern.data, showPattern: false})
    });

    let words2 = output[0].Index.textIndex;
    const uniqueItems2 = words2.filter((v, i, a) => a.indexOf(v) === i); 

    let textdocument = journals.find(obj => obj._id === output[0].Document.Text.Id)

    const input2 = {
      docuId: output[0].Document.Text.Id,
      docuFile: textdocument.document,
      textId: output[0].Document.Text.Id,
      Indexes: uniqueItems2
    }


    this.props.getJournalTargetText(input2, (e) =>{
      this.setState({text: text.data, showText:false})
    });
    // let words = [];
    // if (output[0].Index.length > 0) {
    //   output[0].Index.forEach((index => {
    //     let obj = JSON.parse(index);

    //     words.push.apply(words, obj.Pattern.split(' '))
    //   }))
    // }


    // this.setState({ words })

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
    const { output, textId } = this.props.localPlagiarism

    this.props.setPlagiarismGenerateReportLoading(true);

    // const node = ReactDOM.findDOMNode(this);

    // Get child nodes
    const { journals } = this.props.journal;

    let comparedJournal;
    journals.map(journal => {
      if (textId === journal._id) {
        comparedJournal = journal;

      }
    })
    console.log(comparedJournal)

    let pattern = this.patternItem.current.innerHTML.toString();
    let text = this.textItem.current.innerHTML.toString();
    // pattern = pattern.innerHTML.toString()
    // text = text.innerHTML.toString()

    const name =
      this.props.auth.user.name.firstName +
      " " +
      this.props.auth.user.name.middleName +
      " " +
      this.props.auth.user.name.lastName;


    const input = {
      printedBy: name,
      pattern,
      text,
      typeOfReport: "Plagiarism Check Result",
      subTypeOfReport: "Side by Side Comparison",
      output,
      journal: this.props.journal.journal,
      comparedJournal,
      reportFor: "Journal"
    }
    this.props.createLocalSideBySidePlagiarismReport(input);
  }

  render() {

    const { output, patternLoading, textLoading, pattern, text, textId } = this.props.localPlagiarism;

    let patternItem;
    let textItem;

    if (patternLoading || pattern === "" || this.state.showPattern) {
      patternItem = (
        <div className="row">
          <div className="col-md-12">
            <Spinner />
          </div>
        </div>
      )
    } else {
      patternItem = (
        <div className="hightlightSpanDiv">
          <div className="highlightComponentDiv" ref={this.patternItem}>
            {/* <Highlighter
              id="highlightPat"
              className="highlightSpan"
              highlightClassName="hightlight"
              searchWords={this.state.words}
              autoEscape={true}
              textToHighlight={pattern.data}
              findChunks={this.findChunksAtBeginningOfWords}
            /> */}
            {parse(pattern.data)}
          </div>

        </div>
      )
    }

    if (textLoading || text === "" || this.state.showText) {
      textItem = (
        <div className="row">
          <div className="col-md-12">
            <Spinner />
          </div>
        </div>
      )
    } else {
      textItem = (
        <div className="hightlightSpanDiv">
          <div className="highlightComponentDiv" ref={this.textItem}>
            {/* <Highlighter
              id="highlightText"
              className="highlightSpan"
              highlightClassName="hightlight"
              searchWords={this.state.words}
              autoEscape={true}
              textToHighlight={text.data}
              findChunks={this.findChunksAtBeginningOfWords}
            /> */}
            {parse(text.data)}
          </div>

        </div>
      )
    }

    const { generateReport } = this.props.localPlagiarism
    return (
      <div className="research">
      {Object.entries(this.props.localPlagiarism.output).length !== 0 && this.props.localPlagiarism.output.constructor !== Object ?
        <div className="container-fluid" style={{ padding: "1em" }}>
        <div className="row">
                    <div className="col-md-12">
                      
                        <Link
                            to={`/journals/${this.props.localPlagiarism.docuId}`}
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
                          <p><b>Plagiarism Level: </b> {this.state.level === 1 ? <span className="little-text">Little Plagiarism</span> : this.state.level === 2 ? <span className="moderate-text">Moderate Plagiarism</span> : this.state.level === 3 ? <span className="heavy-text">Heavy Plagiarism</span> : <span>Clean</span>} </p>
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
                    <div className="sourceHeader forRelative">{output[0].Document.Text.Name}</div>
                    

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
  journal: PropTypes.object.isRequired,
  getJournalSourcePattern: PropTypes.func.isRequired,
  createLocalSideBySidePlagiarismReport: PropTypes.func.isRequired,
  getJournalTargetText: PropTypes.func.isRequired,
  setPlagiarismGenerateReportLoading: PropTypes.func.isRequired,
  clearLocalPlagiarismState: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  localPlagiarism: state.localPlagiarism,
  journal: state.journal,
  auth: state.auth
});

export default connect(mapStateToProps, { getJournalSourcePattern, getJournalTargetText, createLocalSideBySidePlagiarismReport, setPlagiarismGenerateReportLoading,clearLocalPlagiarismState })(LocalResultSideBySide)
