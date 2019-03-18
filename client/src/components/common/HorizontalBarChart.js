import React, { Component } from "react";
import { HorizontalBar } from "react-chartjs-2";

class HorizontalBarChart extends Component {
  render() {
    const { data } = this.props;
    const legend = {
      display: false
    };

    return (
      <div className="barChart">
        <HorizontalBar
          data={data}
          legend={legend}
          height={450}
          options={{
            maintainAspectRatio: false
          }}
        />
      </div>
    );
  }
}

export default HorizontalBarChart;
