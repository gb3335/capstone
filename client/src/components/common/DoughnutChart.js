import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

class DoughnutChart extends Component {
  render() {
    const { data } = this.props;

    const legend = {
      position: "bottom",
      fullWidth: false
    };

    return (
      <div className="doughnutChart">
        <Doughnut
          data={data}
          legend={legend}
          width={450}
          height={450}
          options={{
            maintainAspectRatio: false
          }}
        />
      </div>
    );
  }
}

export default DoughnutChart;
