import React from "react";
import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { ArcElement } from "chart.js";

Chart.register(ArcElement);

const MetricChart = (props) => {
  const data = {
    labels: ["Win", "Loss"],
    datasets: [
      {
        data: [props.win, props.loss],
        backgroundColor: ["#27374D", "#526D82"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutoutPercentage: 70,
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 10,
        fontSize: 12,
        fontColor: "#fff",
        padding: 20,
      },
    },
  };
  return <Doughnut data={data} options={options} />;
};

export default MetricChart;
