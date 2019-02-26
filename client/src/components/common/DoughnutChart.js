import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

class DoughnutChart extends Component {
  render() {
    const { data, chartTitle, display } = this.props;
    let legend;

    if (display) {
      legend = {
        display: false,
        position: "bottom",
        fullWidth: false
      };
    } else {
      legend = {
        position: "bottom",
        fullWidth: false
      };
    }

    return (
      <div className="doughnutChart">
        <h4 style={{ textAlign: "center" }}>{chartTitle}</h4>
        <Doughnut data={data} legend={legend} />
      </div>
    );
  }
}

export default DoughnutChart;
