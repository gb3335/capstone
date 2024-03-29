import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Spinner from "../common/Spinner";
import Highlighter from "react-highlight-words";
import parse from "html-react-parser";

//workers
import worker from "./workers/workerHide";
import WebWorker from "./workers/WorkerSetup";

import { Spring, Transition, animated } from "react-spring/renderprops";
// import { getJournalTextPattern, setPlagiarismLocalHideDetails, createLocalPlagiarismReport, setPlagiarismGenerateReportLoading, getJournalPattern } from "../../actions/localPlagiarismActions";
import {
  getJournalTextPattern,
  setPlagiarismLocalHideDetails,
  createLocalPlagiarismReport,
  setPlagiarismGenerateReportLoading,
  getJournalPattern,
  clearLocalPlagiarismState
} from "../../actions/localPlagiarismActions";

import LocalHighlightedResult from "./LocalHighlightedResult";
import ResultStatistics from "./ResultStatistics";

import "moment-timezone";

import Output from "./Output";

import "./LocalResults.css";

class LocalResult extends Component {
  constructor() {
    super();
    this.state = {
      little: 0,
      moderate: 0,
      heavy: 0,
      score: [],
      showDetails: false,
      words: [],
      report: true,
      chunks: [],
      patternHide: ""
    };

    this.forHide = React.createRef();
  }

  componentWillMount() {
    if (
      Object.entries(this.props.localPlagiarism.output).length === 0 &&
      this.props.localPlagiarism.output.constructor === Object
    ) {
      this.props.history.push("/dashboard");
    } else {
      this.props.setPlagiarismLocalHideDetails();
      const { docuId, output } = this.props.localPlagiarism;
      const { journal } = this.props.journal;
      let words = [];
      output.forEach(out => {
        out.Index.forEach(index => {
          words.push(index);
        });
      });
      // let words2= words.join(' ').split(' ');
      const uniqueItems = words.filter((v, i, a) => a.indexOf(v) === i);

      // let newob = journals.find(obj => obj._id === docuId);
      const input = {
        docuId: docuId,
        docuFile: journal.document,
        Indexes: uniqueItems,
        hide: true,
        abstract: this.props.localPlagiarism.abstract
      };
      this.props.getJournalPattern(input, e => {
        // this.callWhenPatternDone()
        this.setState({
          patternHide: this.props.localPlagiarism.patternHide.data,
          report: false
        });
      });
    }
  }

  callWhenPatternDone = () => {
    const { output } = this.props.localPlagiarism;
    this.worker.postMessage({
      args: { output, textToHighlight: this.props.localPlagiarism.pattern.data }
    });
    this.worker.addEventListener("message", event => {
      this.setState({
        chunks: event.data.chunks,
        words: event.data.words,
        report: false
      });
    });
    // let words = [];

    //     output[0].Index.forEach(index => {
    //       let obj = JSON.parse(index);
    //       words.push(obj.Pattern)
    //     })
    //     // output.forEach((out) => {
    //     //   out.Index.forEach((index) => {
    //     //     let obj = JSON.parse(index);
    //     //     words.push(obj.Pattern)
    //     //   })
    //     // })
    //     words = words.join(' ').split(' ');
    //     var uniqueItems = [...new Set(words)]

    //     //const word = uniqueItems.join(' ');

    //     //var splited = word.split(' ');
    //     this.setState({words: uniqueItems}, () => {
    //     })
  };

  componentDidMount() {
    this.worker = new WebWorker(worker);
    if (
      Object.entries(this.props.localPlagiarism.output).length === 0 &&
      this.props.localPlagiarism.output.constructor === Object
    ) {
      this.props.history.push("/dashboard");
    } else {
      const { output } = this.props.localPlagiarism;
      let little = 0,
        moderate = 0,
        heavy = 0;
      let score = [];
      output.forEach(out => {
        if (out.SimilarityScore > 0 && out.SimilarityScore < 30) {
          little++;
        } else if (out.SimilarityScore >= 30 && out.SimilarityScore <= 70) {
          moderate++;
        } else if (out.SimilarityScore > 70) {
          heavy++;
        }
      });

      score.push(little);
      score.push(moderate);
      score.push(heavy);

      this.setState({ little, moderate, heavy, score });
    }
  }

  componentWillUnmount() {
    this.props.clearLocalPlagiarismState();
  }

  onClickShowDetails = id => {
    const { output } = this.props.localPlagiarism;
    let newob = output.find(obj => obj.Document.Text.Id === id);
    let index = [];
    index = newob.Index.filter((v, i, a) => a.indexOf(v) === i);
    const input = {
      docuId: newob.Document.Pattern.Id,
      docuFile: this.props.journal.journal.document,
      textId: id,
      Indexes: index,
      abstract: this.props.localPlagiarism.abstract
    };
    this.props.getJournalTextPattern(input);
  };

  onClickHideDetails = () => {
    this.props.setPlagiarismLocalHideDetails();
  };

  onClickGenerateReport = () => {
    this.props.setPlagiarismGenerateReportLoading(true);

    const { output, abstract } = this.props.localPlagiarism;
    // const node = ReactDOM.findDOMNode(this);

    // // Get child nodes
    // let child = "";
    // child = node.querySelector('.forhidehighlightSpan');

    let word = this.forHide.current.innerHTML.toString();
    let name = "Guest";

    if (this.props.auth.isAuthenticated) {
      name =
        this.props.auth.user.name.firstName +
        " " +
        this.props.auth.user.name.middleName +
        " " +
        this.props.auth.user.name.lastName;
    }

    let subTypeOfReport = "Checked in the System Database";
    if (abstract) {
      subTypeOfReport = "Checked in the System Database (ABSTRACT)";
    }
    const input = {
      reportFor: "Journal",
      printedBy: name,
      word,
      typeOfReport: "Plagiarism Check Result",
      subTypeOfReport,
      output,
      journal: this.props.journal.journal
    };
    this.props.createLocalPlagiarismReport(input);
  };

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
    const singleTextWordsWithPos = singleTextWords.map(s => {
      //Compound

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
    const {
      output,
      patternLoading,
      pattern,
      showDetails,
      patternHide
    } = this.props.localPlagiarism;
    const { journal } = this.props.journal;
    let outputItems;

    if (Object.keys(output).length > 0) {
      outputItems = (
        <Output
          onClickShowDetails={this.onClickShowDetails}
          output={output}
          plagType="local"
        />
      );
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
        );
      } else {
        items = (
          <Transition
            items={showDetails}
            from={{ opacity: 0 }}
            enter={{ opacity: 1 }}
            leave={{ opacity: 0 }}
          >
            {show =>
              show &&
              (props => (
                <animated.div style={props}>
                  <Spring
                    from={{ opacity: 0 }}
                    to={{ opacity: 1 }}
                    config={{ delay: 100, duration: 800 }}
                  >
                    {props => (
                      <div style={props}>
                        <div className="sourceHeader">
                          {journal.title}
                          <div className="spacer" />
                          <button
                            onClick={this.onClickHideDetails}
                            className="close"
                          >
                            x
                          </button>
                        </div>
                        <div className="sourceContent">
                          <LocalHighlightedResult />
                        </div>
                      </div>
                    )}
                  </Spring>
                </animated.div>
              ))
            }
          </Transition>
        );
      }
    } else {
      items = (
        <Transition
          items={!showDetails}
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {show =>
            show &&
            (props => (
              <Spring
                from={{ opacity: 0 }}
                to={{ opacity: 1 }}
                config={{ delay: 100, duration: 800 }}
              >
                {props => (
                  <div style={props}>
                    <div className="sourceResearch">
                      <div className="sourceHeader">
                        Local Result Statistics
                      </div>
                      <div className="sourceContent">
                        <ResultStatistics height={300} output={output} />
                      </div>
                      <div className="sourceHeader">Journal Title</div>
                      <div className="sourceContent">{journal.title}</div>
                      <div className="sourceHeader">Journal Details</div>
                      <div className="sourceContent researchDetails">
                        <div>
                          <span>College: </span>
                          {journal.college}
                        </div>
                        <div>
                          <span>Course: </span>
                          {journal.course}
                        </div>
                        <div>
                          <span>Volume #: </span>
                          {journal.volume}
                        </div>
                        <div>
                          <span>ISSN: </span>
                          {journal.issn}
                        </div>
                        <div>
                          <span>Year Published: </span>
                          {journal.yearPublished}
                        </div>
                        <div>
                          <span>Last Update: </span>
                          <Moment format="MMM. DD, YYYY">
                            {journal.lastUpdate}
                          </Moment>
                          {" at "}
                          <Moment format="h:mm A">{journal.lastUpdate}</Moment>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Spring>
            ))
          }
        </Transition>
      );
    }

    let forhide;

    if (patternLoading || patternHide === "" || this.state.report) {
      forhide = (
        <div className="spinnerMainDiv">
          <div className="spinner">
            <Spinner />
          </div>
        </div>
      );
    } else {
      // forhide = (
      //   <Highlighter
      //     className="forhidehighlightSpan"
      //     highlightClassName="hightlight"
      //     searchWords={this.state.words}
      //     autoEscape={true}
      //     textToHighlight={pattern.data}
      //     findChunks={() => this.state.chunks}
      //   />
      // )
      forhide = parse(this.state.patternHide);
    }

    const { generateReport } = this.props.localPlagiarism;

    return (
      <div className="journal">
        <div className="forHide" ref={this.forHide}>
          {forhide};
        </div>
        <div className="container-fluid" style={{ padding: "1em" }}>
          <div className="row">
            <div className="col-md-8">
              <Link
                to={`/journals/${this.props.localPlagiarism.docuId}`}
                className="btn btn-light mb-3 float-left"
              >
                <i className="fas fa-angle-left" /> Back
              </Link>
              {generateReport ? (
                <button className="btn btn-light mb-3 float-right disabled">
                  <i className="fas fa-flag text-danger" /> Generating Report...
                </button>
              ) : this.state.report ? (
                <button className="btn btn-light mb-3 float-right disabled">
                  <i className="fas fa-flag text-danger" /> Generate Report
                </button>
              ) : (
                <button
                  onClick={this.onClickGenerateReport}
                  className="btn btn-light mb-3 float-right"
                >
                  <i className="fas fa-flag text-danger" /> Generate Report
                </button>
              )}
            </div>
          </div>
          <div className="row">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-8">{items}</div>
                <div className="col-md-4">
                  <div className="container-fluid">
                    <div className="sourceHeader">
                      Result List (
                      {this.state.little +
                        this.state.moderate +
                        this.state.heavy}
                      )
                    </div>
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
  journal: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  setPlagiarismLocalHideDetails: PropTypes.func.isRequired,
  setPlagiarismGenerateReportLoading: PropTypes.func.isRequired,
  getJournalTextPattern: PropTypes.func.isRequired,
  getJournalPattern: PropTypes.func.isRequired,
  createLocalPlagiarismReport: PropTypes.func.isRequired,
  clearLocalPlagiarismState: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  localPlagiarism: state.localPlagiarism,
  journal: state.journal,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getJournalTextPattern,
    setPlagiarismLocalHideDetails,
    createLocalPlagiarismReport,
    setPlagiarismGenerateReportLoading,
    getJournalPattern,
    clearLocalPlagiarismState
  }
)(LocalResult);
