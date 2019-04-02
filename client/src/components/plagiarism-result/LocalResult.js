import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Spinner from "../common/Spinner";
import Highlighter from "react-highlight-words";

import { Spring, Transition, animated } from 'react-spring/renderprops';

import { getTextPattern, setPlagiarismLocalHideDetails, createLocalPlagiarismReport, setPlagiarismGenerateReportLoading, getPattern, clearLocalPlagiarismState } from "../../actions/localPlagiarismActions";

import LocalHighlightedResult from './LocalHighlightedResult';
import ResultStatistics from './ResultStatistics';


import "moment-timezone";

import Output from './Output';

import './LocalResults.css'

class LocalResult extends Component {
  constructor() {
    super();
    this.state = {
      little: 0,
      moderate: 0,
      heavy: 0,
      score: [],
      showDetails: false,
      words: []
    };
  }

  componentWillMount() {
    if (Object.entries(this.props.localPlagiarism.output).length === 0 && this.props.localPlagiarism.output.constructor === Object) {
      this.props.history.push("/dashboard");
    }else{
      this.props.setPlagiarismLocalHideDetails();
      const { docuId } = this.props.localPlagiarism;
      const { researches, research } = this.props.research;
  
      // let newob = researches.find(obj => obj._id === docuId);
      const input = {
        docuId: docuId,
        docuFile: research.document,
        abstract: this.props.localPlagiarism.abstract
      }
      this.props.getPattern(input);
    }
    
  }

  componentDidMount() {
    if (Object.entries(this.props.localPlagiarism.output).length === 0 && this.props.localPlagiarism.output.constructor === Object) {
      this.props.history.push("/dashboard");
    }else{
      const { output } = this.props.localPlagiarism;
      let little = 0, moderate = 0, heavy = 0;
      let score = []
      output.forEach(out => {
        if (out.SimilarityScore > 0 && out.SimilarityScore < 30) {
          little++;
        } else if (out.SimilarityScore >= 30 && out.SimilarityScore <= 70) {
          moderate++;
        }
        else if (out.SimilarityScore > 70) {
          heavy++;
        }
      })

      score.push(little);
      score.push(moderate);
      score.push(heavy);

      this.setState({ little, moderate, heavy, score })

      const words = [];

      output.forEach((out) => {
        out.Index.forEach((index) => {
          let obj = JSON.parse(index);
          words.push(obj.Pattern)
        })
      })
      var uniqueItems = [...new Set(words)]


      const word = uniqueItems.join(' ');

      var splited = word.split(' ');
      this.setState({ words: splited });
    }
    

  }

  componentWillUnmount(){
    this.props.clearLocalPlagiarismState();
  }

  onClickShowDetails = (id) => {
    const { output } = this.props.localPlagiarism;
    let newob = output.find(obj => obj.Document.Text.Id === id);
    const input = {
      docuId: newob.Document.Pattern.Id,
      docuFile: this.props.research.research.document,
      textId: id,
      abstract: this.props.localPlagiarism.abstract
    }
    this.props.getTextPattern(input);
  }

  onClickHideDetails = () => {
    this.props.setPlagiarismLocalHideDetails();
  }

  onClickGenerateReport = () => {
    const { output, abstract } = this.props.localPlagiarism;
    this.props.setPlagiarismGenerateReportLoading(true);

    const node = ReactDOM.findDOMNode(this);

    // Get child nodes
    let child = "";
    child = node.querySelector('.forhidehighlightSpan');

    let word = child.innerHTML.toString()

    const name =
      this.props.auth.user.name.firstName +
      " " +
      this.props.auth.user.name.middleName +
      " " +
      this.props.auth.user.name.lastName;

    let subTypeOfReport = "Checked in the System Database";
    if (abstract) {
      subTypeOfReport = "Checked in the System Database (ABSTRACT)"
    }
    const input = {
      reportFor: "Research",
      printedBy: name,
      word,
      typeOfReport: "Plagiarism Check Result",
      subTypeOfReport,
      output
    }
    this.props.createLocalPlagiarismReport(input);


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

    const { output, patternLoading, pattern, showDetails } = this.props.localPlagiarism;
    const { research } = this.props.research;
    let outputItems;


    if (Object.keys(output).length > 0) {
      outputItems = <Output onClickShowDetails={this.onClickShowDetails} output={output} plagType="local" />;
    } else {
      outputItems = <span>No output</span>;
    }

    let items;

    if (showDetails) {
      if (patternLoading || pattern === "") {
        items = (
          <div className="spinnerMainDiv">
            <div className="spinner">
              <Spinner />
            </div>
          </div>
        )
      } else {
        items = (

          <Transition
            items={showDetails}
            from={{ opacity: 0 }}
            enter={{ opacity: 1 }}
            leave={{ opacity: 0 }}
          >
            {show => show && (props => (
              <animated.div style={props}>
                <Spring from={{ opacity: 0 }}
                  to={{ opacity: 1 }}
                  config={{ delay: 100, duration: 800 }}
                >{props => (
                  <div style={props}>
                    <div className="sourceHeader">{research.title}
                      <div className="spacer" />
                      <button onClick={this.onClickHideDetails} className="close">x</button>
                    </div>
                    <div className="sourceContent">
                      <LocalHighlightedResult />
                    </div>
                  </div>
                )}
                </Spring>

              </animated.div>
            ))}

          </Transition>


        )
      }
    } else {
      items = (
        <Transition items={!showDetails}
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}>
          {show => show && (props => (
            <Spring from={{ opacity: 0 }}
              to={{ opacity: 1 }}
              config={{ delay: 100, duration: 800 }}>
              {props => (
                <div style={props}>
                  <div className="sourceResearch">
                    <div className="sourceHeader">Local Result Statistics</div>
                    <div className="sourceContent">
                      <ResultStatistics output={output} />
                    </div>
                    <div className="sourceHeader">Research Title</div>
                    <div className="sourceContent">{research.title}</div>
                    <div className="sourceHeader">Research Details</div>
                    <div className="sourceContent researchDetails">
                      <div>
                        <span>College: </span>
                        {research.college}
                      </div>
                      <div>
                        <span>Course: </span>
                        {research.course}
                      </div>
                      <div>
                        <span>Research Type: </span>
                        {research.type === "thesis" ? <span className="badge badge-success">{research.type}</span> : <span className="badge badge-info">{research.type}</span>}
                      </div>
                      <div>
                        <span>Pages: </span>
                        {research.pages}
                      </div>
                      <div>
                        <span>School Year: </span>
                        {research.schoolYear}
                      </div>
                      <div>
                        <span>Last Update: </span>
                        <Moment format="MMM. DD, YYYY">{research.lastUpdate}</Moment>
                        {" at "}
                        <Moment format="h:mm A">{research.lastUpdate}</Moment>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Spring>
          ))}
        </Transition>

      )
    }

    let forhide;

    if (patternLoading || pattern === "") {
      forhide = (
        <div className="spinnerMainDiv">
          <div className="spinner">
            <Spinner />
          </div>
        </div>
      )
    } else {
      forhide = (
        <Highlighter
          className="forhidehighlightSpan"
          highlightClassName="hightlight"
          searchWords={this.state.words}
          autoEscape={true}
          textToHighlight={pattern.data}
          findChunks={this.findChunksAtBeginningOfWords}
        />
      )
    }


    const { generateReport } = this.props.localPlagiarism;

    return (
      <div className="research">
        <div className="forHide">
          {forhide};
        </div>
        <div className="container-fluid" style={{ padding: "1em" }}>
          <div className="row">
            <div className="col-md-8">
              <Link
                to={`/researches/${this.props.localPlagiarism.docuId}`}
                className="btn btn-light mb-3 float-left"
              >
                <i className="fas fa-angle-left" /> Back
                </Link>
              {generateReport ? <button
                className="btn btn-light mb-3 float-right disabled"
              >
                <i className="fas fa-flag text-danger" /> Generating Report...
                </button>

                : <button
                  onClick={this.onClickGenerateReport}
                  className="btn btn-light mb-3 float-right"
                >
                  <i className="fas fa-flag text-danger" /> Generate Report
                </button>}
            </div>
          </div>
          <div className="row">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-8">
                  {items}
                </div>
                <div className="col-md-4">
                  <div className="container-fluid">
                    <div className="sourceHeader">Result List ({this.state.little + this.state.moderate + this.state.heavy})</div>
                    <div className="results">{outputItems}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LocalResult.propTypes = {
  localPlagiarism: PropTypes.object.isRequired,
  research: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  setPlagiarismLocalHideDetails: PropTypes.func.isRequired,
  setPlagiarismGenerateReportLoading: PropTypes.func.isRequired,
  getTextPattern: PropTypes.func.isRequired,
  getPattern: PropTypes.func.isRequired,
  createLocalPlagiarismReport: PropTypes.func.isRequired,
  clearLocalPlagiarismState: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  localPlagiarism: state.localPlagiarism,
  research: state.research,
  auth: state.auth
});

export default connect(mapStateToProps, { getTextPattern, setPlagiarismLocalHideDetails, createLocalPlagiarismReport, setPlagiarismGenerateReportLoading, getPattern,clearLocalPlagiarismState })(LocalResult);
