import React, { Component } from 'react'

import { Pie } from 'react-chartjs-2';

import './ResultStatistics.css'

export default class ResultStatistics extends Component {
  constructor() {
    super();
    this.state = {
      little: 0,
      moderate: 0,
      heavy: 0,
      score: []

    };
  }

  componentDidMount() {
    const { output } = this.props;
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

  }

  render() {
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


    return (
      <div className="row">
        <div className="col-md-7">
          <Pie data={data} height={300} options={{ maintainAspectRatio: false }} />
        </div>
        <div className="col-md-5">
          <div className="overview">Statistics Overview</div>
          <div className="overviewContent mb-2">Number Of Candidate Document: {this.state.little + this.state.moderate + this.state.heavy}</div>
          <div className="overviewContent heavy-text">Heavy Plagiarism: {this.state.heavy}</div>
          <div className="overviewContent moderate-text">Moderate Plagiarism: {this.state.moderate}</div>
          <div className="overviewContent little-text">Little Plagiarism: {this.state.little}</div>
          <div className="note">Note: Little Plagiarism is less than 30% similarity score, 30 to 69% for Moderate and 70 to 100% for Heavy</div>
        </div>
      </div>
    )
  }
}
