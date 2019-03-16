import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ResultPie from './ResultPie';

import './Output.css';

class Output extends Component {

  constructor() {
    super();
    this.state = {
      color: "" 
    };
    
  }

  render() {


      let output2;

      const {output} = this.props.localPlagiarism
      output2 = output.map(out => (
          <div key={out.Document.Text.Name}>
            {out.SimilarityScore < 30 ? 
            <div className="resultList little">
              <div className="row">
                  <div className="col-md-3">
                    <ResultPie similarity={parseFloat(out.SimilarityScore).toFixed(2)}/>
                  </div>
                  <div className="col-md-9">
                      <p><b>Title: </b>{out.Document.Text.Name}</p>
                      <p><b>Similarity Score: </b>{parseFloat(out.SimilarityScore).toFixed(2)}%</p>
                      <p><b>Plagiarism Level: </b>Little Plagiarism</p>
                      {/* <Link to={`/localResult/${out.Document.Text.Id}`}>Show Details</Link> */}
                      <button onClick={()=> this.props.onClickShowDetails(out.Document.Text.Id)} className="btn btn-info">Show Details</button>
                  </div>
              </div>
            </div> : 
            out.SimilarityScore >=30 && out.SimilarityScore<70 ? 
            <div className="resultList moderate">
              <div className="row">
                  <div className="col-md-3">
                    <ResultPie similarity={parseFloat(out.SimilarityScore).toFixed(2)}/>
                  </div>
                  <div className="col-md-9">
                      <p><b>Title: </b>{out.Document.Text.Name}</p>
                      <p><b>Similarity Score: </b>{parseFloat(out.SimilarityScore).toFixed(2)}%</p>
                      <p><b>Plagiarism Level: </b>Moderate Plagiarism</p>
                      {/* <Link to={`/localResult/${out.Document.Text.Id}`}>Show Details</Link> */}
                      <button onClick={()=> this.props.onClickShowDetails(out.Document.Text.Id)} className="btn btn-info">Show Details</button>
                  </div>
              </div>
            </div> : 
            <div className="resultList heavy">
            <div className="row">
                <div className="col-md-3">
                  <ResultPie similarity={parseFloat(out.SimilarityScore).toFixed(2)}/>
                </div>
                <div className="col-md-9">
                    <p><b>Title: </b>{out.Document.Text.Name}</p>
                    <p><b>Similarity Score: </b>{parseFloat(out.SimilarityScore).toFixed(2)}%</p>
                    <p><b>Plagiarism Level: </b>Heavy Plagiarism</p>
                    {/* <Link to={`/localResult/${out.Document.Text.Id}`}>Show Details</Link> */}
                    <button onClick={()=> this.props.onClickShowDetails(out.Document.Text.Id)} className="btn btn-info">Show Details</button>
                </div>
            </div>
          </div>}
            
          </div>
        )
      )
    return (
      <div>
          {output2}
      </div>
      
    )
  }
}

Output.propTypes = {
  research: PropTypes.object.isRequired,
  localPlagiarism: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research,
  localPlagiarism: state.localPlagiarism
});


export default connect(mapStateToProps)(Output);