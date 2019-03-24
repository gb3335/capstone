import React, { Component } from 'react'
import {Pie} from 'react-chartjs-2';
// import { defaults } from 'react-chartjs-2'


// defaults.global.defaultFontSize = 10;

export default class ResultPie extends Component {

    constructor() {
        super();
        this.state = {
          similarity: 0,
          data: []
        };
      }

    componentDidMount(){

        let similarity = this.props.similarity;
        let notsimilar = 100 - similarity;
        notsimilar = parseFloat(notsimilar).toFixed(2);
        let data=[notsimilar,similarity]
        this.setState({similarity:this.props.similarity,data})
    }

  render() {

    const {legend} = this.props;

    let data;

    if(legend){
      data = {
        labels: [
          'Clean',
          'Plagiarised'
        ],
        datasets: [{
          data: this.state.data,
          backgroundColor: [
          '#36A2EB',
          '#FF6384'
          ],
          hoverBackgroundColor: [
            '#36A2EB',
            '#FF6384'
          ]
        }]
      };
    }else{
      data = {
        labels: [
          ' ',
          ' '
        ],
        datasets: [{
          data: this.state.data,
          backgroundColor: [
          '#36A2EB',
          '#FF6384'
          ],
          hoverBackgroundColor: [
            '#36A2EB',
            '#FF6384'
          ]
        }]
      };
    }
    


    return (
      <div>
        <Pie data={data} height={this.props.height} options={{ maintainAspectRatio: false, legend: {display: legend}}}/>
      </div>
    )
  }
}
