import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";

import { Tesseract } from "tesseract.ts";

import { Spring, Transition, animated } from "react-spring/renderprops";

import ResultStatistics from "../plagiarism-result/ResultStatistics";

import OnlineHighlightedResult from "./OnlineHighlightedResult";

import Output from "../plagiarism-result/Output";
import "./OnlineCheck.css";

import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";

import {
  checkPlagiarismOnline,
  setPlagiarismOnlineShowDetails,
  setPlagiarismOnlineHideDetails,
  createOnlinePlagiarismReport,
  setPlagiarismGenerateReportLoading
} from "../../actions/onlinePlagiarismAction";

class OnlineCheck extends Component {
  constructor() {
    super();
    this.state = {
      q: "",
      output: "",
      disableClassname: "btn btn-primary btn-block btn-flat disabled",
      index: 0,
      words: [],
      errors: {},
      pattern: "",
      ocrProgress: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClickShowDetails = this.onClickShowDetails.bind(this);
    this.onClickHideDetails = this.onClickHideDetails.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    if (!this.props.onlinePlagiarism.buttonDisable) {
      let old = this.state.q.toString();
      // let q = old.join(' ');
      // q = q.replace(/\s+/g," ");
      const input = {
        q: old,
        original: this.state.q
      };
      // console.log(input)

      this.props.checkPlagiarismOnline(input);
    }
  }

  onClickShowDetails(index) {
    const { output, original } = this.props.onlinePlagiarism;
    let words = [];
    words = output[index].Index;
    let text = original;
    let text2 = text
      .replace(/(\r\n|\n|\r)/gm, " ")
      .replace(/\s+/g, " ")
      .replace(/[.]{2,}/g, ".");
    // text2 = text2.replace(/[^A-Za-z0-9`~!@#$%^&*()_|+\-=?;:'",. \{\}\[\]\\\/]/g, "");
    // text2 = text2.replace(/[^A-Za-z0-9. ]/g, "");
    text2 = text2.replace(/[<>]/g, "");
    text2 = text2.replace(/\s+/g, " ");

    text2 = text2.split(".");
    text2 = text2.filter(el => {
      return el !== "";
    });
    let newtext = [];
    text2.forEach(t => {
      t = t.replace(/^\s+/g, "").replace(/\s+$/, "");
      let fortest = t.replace(/[^A-Za-z0-9]/g, "");

      if (fortest !== "") {
        t = t + ".";
        newtext.push(t);
      }
    });
    text2 = newtext;
    // console.log(text2.length)
    // // console.log(Index.length)
    // function sortNumber(a,b) {
    //   return a - b;
    // }
    // Index = Index.sort(sortNumber)

    words.forEach(index => {
      // console.log(index)
      text2[index] = `<mark>${text2[index]}</mark>`;
    });

    text2 = text2.join(" ");

    this.setState({ index, words, pattern: text2 });
    this.props.setPlagiarismOnlineShowDetails();
  }

  onClickHideDetails = () => {
    this.props.setPlagiarismOnlineHideDetails();
  };

  componentDidMount() {
    if (this.props.onlinePlagiarism.original) {
      this.setState({ q: this.props.onlinePlagiarism.original });
    }
  }

  onClickGenerateReport = () => {
    const { output, original } = this.props.onlinePlagiarism;
    this.props.setPlagiarismGenerateReportLoading(true);
    const words = [];

    output.forEach(out => {
      words.push.apply(words, out.Index);
    });
    var uniqueItems = [...new Set(words)];
    let word = [];
    if (uniqueItems.length > 0) {
      word = uniqueItems;
    }

    let name = "Guest";
    if (this.props.auth.isAuthenticated) {
      name =
        this.props.auth.user.name.firstName +
        " " +
        this.props.auth.user.name.middleName +
        " " +
        this.props.auth.user.name.lastName;
    }

    const input = {
      printedBy: name,
      pattern: original,
      word,
      from: "online",
      typeOfReport: "Plagiarism Check Result",
      subTypeOfReport: "Checked in the World Wide Web",
      output: this.props.onlinePlagiarism.output
    };
    this.props.createOnlinePlagiarismReport(input);
  };

  onOCR = e => {
    let files = e.target.files;

    Tesseract.recognize(files[0])
      .progress(data => {
        let dataProg = data.progress * 100;
        dataProg = dataProg.toString();
        dataProg = dataProg.substring(0, 5);

        this.setState({
          ocrProgress: data.status + " at " + dataProg + "%"
        });
      })
      .then(data => {
        this.setState({ q: data.text, ocrProgress: "" });
      })
      .catch(console.error);
  };

  render() {
    const { errors } = this.props;
    const { output, loading, showDetails } = this.props.onlinePlagiarism;

    let outputItems;
    let resultItems;
    let highlightItems;

    if (loading) {
      outputItems = (
        <div className="spinnerMainDiv">
          <p>{this.props.onlinePlagiarism.axiosProgress.tag}</p>
          <Progress
            type="circle"
            percent={this.props.onlinePlagiarism.axiosProgress.axiosProgress}
          />
          {/* <Spinner /> */}
        </div>
      );
    } else {
      if (Object.keys(output).length > 0) {
        outputItems = (
          <div className="outputdiv results">
            <Output
              onClickShowDetails={this.onClickShowDetails}
              output={output}
              plagType="online"
            />
          </div>
        );
      } else {
        outputItems = <span>Nothing to Show</span>;
      }
    }

    if (showDetails) {
      highlightItems = (
        <Transition
          native
          items={!loading}
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
                      <div className="sourceResearch">
                        <div className="sourceHeader">
                          Results
                          <div className="spacer" />
                          <button
                            onClick={this.onClickHideDetails}
                            className="close"
                          >
                            x
                          </button>
                        </div>
                        <div className="sourceContent" ref={this.highlightRef}>
                          <OnlineHighlightedResult
                            words={this.state.words}
                            pattern={this.state.pattern}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Spring>
              </animated.div>
            ))
          }
        </Transition>
      );
    } else {
      highlightItems = (
        <div className="sourceResearch">
          {Object.entries(this.props.onlinePlagiarism.output).length !== 0 &&
          this.props.onlinePlagiarism.output.constructor !== Object ? (
            <Transition
              native
              items={!loading}
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
                            Online Result Statistics
                          </div>
                          <div className="sourceContent">
                            <Spring
                              from={{ opacity: 0 }}
                              to={{ opacity: 1 }}
                              config={{ delay: 500, duration: 800 }}
                            >
                              {props2 => (
                                <div style={props2}>
                                  <ResultStatistics
                                    height={280}
                                    output={output}
                                  />
                                </div>
                              )}
                            </Spring>
                          </div>
                        </div>
                      )}
                    </Spring>
                  </animated.div>
                ))
              }
            </Transition>
          ) : (
            ""
          )}
          <Spring
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            config={{ delay: 100, duration: 800 }}
          >
            {props => (
              <div style={props}>
                <div className="sourceHeader">Check Plagiarism Online</div>
                <form onSubmit={this.onSubmit}>
                  <TextAreaFieldGroup
                    placeholder="Search Something here"
                    name="q"
                    onChange={this.onChange}
                    rows="10"
                    value={this.state.q}
                    maxLength="2000"
                    minLength="50"
                    error={errors.q}
                    extraClass="onlineTextarea"
                  />
                  {/* <textarea onChange={this.onChange} classname="form-control" name="q"></textarea> */}
                  {this.props.localPlagiarism.globalLoading.loading &&
                  this.props.localPlagiarism.globalLoading.number !== 5 ? (
                    <p>
                      Plagiarism scan is currently in progress, please wait...
                    </p>
                  ) : (
                    <button
                      type="submit"
                      className={
                        this.props.onlinePlagiarism.buttonDisable
                          ? this.state.disableClassname
                          : "btn btn-primary btn-block btn-flat"
                      }
                    >
                      {this.props.onlinePlagiarism.buttonDisable
                        ? "Checking for plagiarism..."
                        : "Check"}
                    </button>
                  )}
                </form>
              </div>
            )}
          </Spring>
        </div>
      );
    }

    const { generateReport, original } = this.props.onlinePlagiarism;
    const { ocrProgress } = this.state;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">
            {ocrProgress !== "" ? (
              <div className="float-left">
                <button
                  className="btn btn-light disabled mb-2"
                  title="Use Image to Text"
                >
                  <i className="fas fa-file-image mr-1" />
                  Image to Text
                </button>{" "}
                <span className="pl-3" style={{ fontSize: "12px" }}>
                  {ocrProgress}
                </span>
              </div>
            ) : (
              <div className="float-left">
                <label
                  to="#"
                  htmlFor="ocr"
                  className="btn btn-light"
                  title="Use Image to Text"
                >
                  <i className="fas fa-file-image mr-1" />
                  Image to Text
                </label>
                <input
                  type="file"
                  style={{
                    border: 0,
                    opacity: 0,
                    position: "absolute",
                    pointerEvents: "none"
                  }}
                  onChange={this.onOCR}
                  name="name"
                  id="ocr"
                  accept=".png, .jpg, .jpeg"
                />
              </div>
            )}
            {generateReport ? (
              <button className="btn btn-light mb-3 float-right disabled">
                <i className="fas fa-flag text-danger" /> Generating Report...
              </button>
            ) : loading ||
              original === "" ||
              (Object.entries(output).length === 0 &&
                output.constructor === Object) ? (
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
          <div className="col-md-8">{highlightItems}</div>
          <div className="col-md-4">
            <div className="container-fluid">
              <div className="sourceHeader">Result List</div>
              <Spring
                from={{ opacity: 0 }}
                to={{ opacity: 1 }}
                config={{ delay: 1000, duration: 1000 }}
              >
                {props => <div style={props}>{outputItems}</div>}
              </Spring>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

OnlineCheck.propTypes = {
  checkPlagiarismOnline: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  onlinePlagiarism: PropTypes.object.isRequired,
  localPlagiarism: PropTypes.object.isRequired,
  setPlagiarismOnlineShowDetails: PropTypes.func.isRequired,
  setPlagiarismOnlineHideDetails: PropTypes.func.isRequired,
  setPlagiarismGenerateReportLoading: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  onlinePlagiarism: state.onlinePlagiarism,
  localPlagiarism: state.localPlagiarism,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    checkPlagiarismOnline,
    setPlagiarismOnlineShowDetails,
    setPlagiarismOnlineHideDetails,
    createOnlinePlagiarismReport,
    setPlagiarismGenerateReportLoading
  }
)(OnlineCheck);
