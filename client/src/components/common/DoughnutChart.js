import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

class DoughnutChart extends Component {
  render() {
    const { data, chartTitle } = this.props;

    return (
      <div className="doughnutChart">
        <h4 style={{ textAlign: "center" }}>{chartTitle}</h4>
        <Doughnut
          data={data}
          legend={{ display: true, position: "left", fullWidth: false }}
        />
      </div>
    );
  }
}

export default DoughnutChart;
