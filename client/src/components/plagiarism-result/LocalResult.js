import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Spinner from "../common/Spinner";
import ReactDOM from 'react-dom'

import {Spring, Transition, animated} from 'react-spring/renderprops';

import { getTextPattern, setPlagiarismLocalHideDetails, createLocalPlagiarismReport, setPlagiarismGenerateReportLoading,getPattern } from "../../actions/localPlagiarismActions";

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
      
    };
  }

  componentWillMount(){
    this.props.setPlagiarismLocalHideDetails();
    const {docuId} = this.props.localPlagiarism;
    const {researches} = this.props.research;
   
    let newob = researches.find(obj => obj._id === docuId);
    const input = {
      docuId : docuId,
      docuFile : newob.document
    }
    this.props.getPattern(input);
  }

  componentDidMount(){
    const {output} = this.props.localPlagiarism; 
    let little= 0, moderate= 0, heavy=0;
    let score=[]
    output.forEach(out =>{
      if(out.SimilarityScore>0 && out.SimilarityScore<30){
        little++;
      }else if(out.SimilarityScore>=30 && out.SimilarityScore<=70){
        moderate++;
      }
      else if(out.SimilarityScore>70){
        heavy++;
      }
    })

    score.push(little);
    score.push(moderate);
    score.push(heavy);

    this.setState({little, moderate,heavy,score})
    
  }

  onClickShowDetails = (id) =>{
    const {output} = this.props.localPlagiarism;
    let newob = output.find(obj => obj.Document.Text.Id === id);
    const input = {
        docuId : newob.Document.Pattern.Id,
        docuFile : this.props.research.research.document,
        textId: id
      }
      this.props.getTextPattern(input);
    }

    onClickHideDetails = () =>{
      this.props.setPlagiarismLocalHideDetails();
    }

    onClickGenerateReport = () => {
      const {output, pattern} = this.props.localPlagiarism;
      this.props.setPlagiarismGenerateReportLoading(true);
      const words = [];

      output.forEach((out) => {
        out.Index.forEach((index) => {
          let obj = JSON.parse(index);
          words.push(obj.Pattern)
        })
      })
      var uniqueItems = [...new Set(words)]

      const word = uniqueItems.join(' ');

      const name =
          this.props.auth.user.firstName +
          " " +
          this.props.auth.user.middleName +
          " " +
          this.props.auth.user.lastName;

      const input = {
        printedBy: name,
        pattern : pattern.data,
        word,
        typeOfReport: "Check Plagiarism Report",
        subTypeOfReport: "Checked in the System Database",
        output
      }
      this.props.createLocalPlagiarismReport(input);
      
      
    }


  render() {

    const {output, patternLoading, pattern, showDetails} = this.props.localPlagiarism;
    const {research} = this.props.research;
    let outputItems;


    if (Object.keys(output).length > 0) {
      outputItems = <Output onClickShowDetails={this.onClickShowDetails} output={output} plagType="local"/>;
    } else {
      outputItems = <span>No output</span>;
    }

    let items;

    if(showDetails){
      if(patternLoading || pattern===""){
        items = (
          <div className="spinnerMainDiv">
            <div className="spinner">
              <Spinner />
            </div>
          </div>
        )
      }else{
        items = (
          
            <Transition
                items={showDetails}
                from={{opacity:0}}
                enter={{opacity:1}}
                leave={{opacity:0}}
            >
            {show => show && (props =>(
              <animated.div style={props}>
                <Spring from={{ opacity: 0}}
                        to={{ opacity: 1}}
                        config={{delay:100, duration:800}}
                        >{props => (
                            <div style={props}>
                                    <div className="sourceHeader">{research.title}
                                <div className="spacer"/>
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
    }else{
      items = (
        <Transition items={!showDetails}
                    from={{opacity:0}}
                    enter={{opacity:1}}
                    leave={{opacity:0}}>
                    {show => show && (props => (
                      <Spring from={{ opacity: 0}}
                              to={{ opacity: 1}}
                              config={{delay:100, duration:800}}>
                              {props => (
                                <div style={props}>
                                    <div className="sourceResearch">
                                      <div className="sourceHeader">Local Result Statistics</div>
                                      <div className="sourceContent">
                                        <ResultStatistics output={output}/>
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
                                              {research.type==="thesis" ? <span className="badge badge-success">{research.type}</span> : <span className="badge badge-info">{research.type}</span>}
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


    const {generateReport} = this.props.localPlagiarism;

    return (
      <div className="research">
        <div className="container-fluid" style={{ padding: "1em" }}>
        <div className="row">
              <div className="col-md-8">
                <Link
                  to={`/researches/${this.props.localPlagiarism.docuId}`}
                  className="btn btn-light mb-3 float-left"
                >
                  <i className="fas fa-angle-left" /> Back
                </Link>
                { generateReport ? <button
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
                        <div className="sourceHeader">Result List ({this.state.little+this.state.moderate+this.state.heavy})</div>
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
  setPlagiarismLocalHideDetails : PropTypes.func.isRequired,
  setPlagiarismGenerateReportLoading : PropTypes.func.isRequired,
  getTextPattern : PropTypes.func.isRequired,
  getPattern : PropTypes.func.isRequired,
  createLocalPlagiarismReport : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  localPlagiarism: state.localPlagiarism,
  research: state.research,
  auth: state.auth
});

export default connect(mapStateToProps,{getTextPattern,setPlagiarismLocalHideDetails,createLocalPlagiarismReport,setPlagiarismGenerateReportLoading,getPattern})(LocalResult);
