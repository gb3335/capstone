import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import { ChartModule } from "chartjs-plugin-labels";
import "chartjs-plugin-labels";

class DoughnutChart extends Component {
  render() {
    const { data } = this.props;

    const legend = {
      position: "right",
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
            plugins: {
              labels: {
                render: "percentage",
                precision: 2,
                fontSize: 12,
                fontColor: function(data) {
                  const c = data.dataset.backgroundColor[data.index].substring(
                    1
                  ); // strip #
                  const rgb = parseInt(c, 16); // convert rrggbb to decimal
                  const r = (rgb >> 16) & 0xff; // extract red
                  const g = (rgb >> 8) & 0xff; // extract green
                  const b = (rgb >> 0) & 0xff; // extract blue

                  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

                  if (luma > 140) {
                    return "black";
                  } else {
                    return "white";
                  }
                }
              }
            },
            maintainAspectRatio: false,
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  var dataset = data.datasets[tooltipItem.datasetIndex];
                  var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                  var total = meta.total;
                  var currentValue = dataset.data[tooltipItem.index];
                  var percentage = parseFloat(
                    ((currentValue / total) * 100).toFixed(2)
                  );
                  return currentValue + " (" + percentage + "%)";
                },
                title: function(tooltipItem, data) {
                  return data.labels[tooltipItem[0].index];
                }
              }
            }
          }}
        />
      </div>
    );
  }
}

export default DoughnutChart;
