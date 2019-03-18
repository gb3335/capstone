import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Spinner from "../common/Spinner";

import { getTextPattern, setPlagiarismLocalHideDetails } from "../../actions/localPlagiarismActions";

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
        textId: id
      }
      this.props.getTextPattern(input);
    }

    onClickHideDetails = () =>{
      this.props.setPlagiarismLocalHideDetails();
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

    const data = {
      labels: [
        'Little Plagiarism',
        'Moderate Plagiarism',
        'Heavy Plagiarism'
      ],
      datasets: [{
        data: this.state.score,
        backgroundColor: [
        '#36A2EB',
        '#f49e61',
        '#FF6384'
        ],
        hoverBackgroundColor: [
          '#36A2EB',
          '#f49e61',
          '#FF6384'
        ]
      }]
    };

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
          <div>
            <div className="sourceHeader">{research.title}
              <div className="spacer"/>
              <button onClick={this.onClickHideDetails} className="close">x</button>
            </div>
            <div className="sourceContent">
              <LocalHighlightedResult />
            </div>
          </div>
          
        )
      }
    }else{
      items = (
        <div className="sourceResearch">
            <div className="sourceHeader">Result Statistics</div>
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
      )
    }


    

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
                <Link
                  to={`/researches/${this.props.localPlagiarism.docuId}`}
                  className="btn btn-light mb-3 float-right"
                >
                  <i className="fas fa-flag text-danger" /> Generate Report
                </Link>
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
  setPlagiarismLocalHideDetails : PropTypes.func.isRequired,
  getTextPattern : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  localPlagiarism: state.localPlagiarism,
  research: state.research
});

export default connect(mapStateToProps,{getTextPattern,setPlagiarismLocalHideDetails})(LocalResult);
