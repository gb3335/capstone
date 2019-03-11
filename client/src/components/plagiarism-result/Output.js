import React, { Component } from 'react'
import { Link } from "react-router-dom";

import ResultPie from './ResultPie';

import './Output.css';

class Output extends Component {

  constructor() {
    super();
    this.state = {
      color: "" 
    };
  }

  componentDidMount(){


    
  }

  render() {

      let output;
      output = this.props.output.map(out => (
          <div key={out.DocumentScore.Document_2.Name}>
            {out.SimilarityScore < 30 ? 
            <div className="resultList little">
              <div className="row">
                  <div className="col-md-3">
                    <ResultPie similarity={parseFloat(out.SimilarityScore).toFixed(2)}/>
                  </div>
                  <div className="col-md-9">
                      <p><b>Title: </b>{out.DocumentScore.Document_2.Name}</p>
                      <p><b>Similarity Score: </b>{parseFloat(out.SimilarityScore).toFixed(2)}%</p>
                      <p><b>Plagiarism Level: </b>Little Plagiarism</p>
                      <Link to={`/localResult/${this.props.research.researches.find(x => x.title === out.DocumentScore.Document_2.Name)._id}`}>Show Details</Link>
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
                      <p><b>Title: </b>{out.DocumentScore.Document_2.Name}</p>
                      <p><b>Similarity Score: </b>{parseFloat(out.SimilarityScore).toFixed(2)}%</p>
                      <p><b>Plagiarism Level: </b>Moderate Plagiarism</p>
                      <Link to={`/localResult/${this.props.research.researches.find(x => x.title === out.DocumentScore.Document_2.Name)._id}`}>Show Details</Link>
                  </div>
              </div>
            </div> : 
            <div className="resultList heavy">
            <div className="row">
                <div className="col-md-3">
                  <ResultPie similarity={parseFloat(out.SimilarityScore).toFixed(2)}/>
                </div>
                <div className="col-md-9">
                    <p><b>Title: </b>{out.DocumentScore.Document_2.Name}</p>
                    <p><b>Similarity Score: </b>{parseFloat(out.SimilarityScore).toFixed(2)}%</p>
                    <p><b>Plagiarism Level: </b>Heavy Plagiarism</p>
                    <Link to={`/localResult/${this.props.research.researches.find(x => x.title === out.DocumentScore.Document_2.Name)._id}`}>Show Details</Link>
                </div>
            </div>
          </div>}
            
          </div>
        )
      )
    return (
      <div>
          {output}
      </div>
      
    )
  }
}



export default Output;
