import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  registerables,
} from "chart.js";

ChartJs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ...registerables
);

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },

  elements: {
    point: {
      radius: 0,
    },
  },

  scales: {
    yAxes: {
      grid: {
        display: false,
      },
      ticks: {
        callback: function (value, index, values) {
          return numeral(value).format("'0a");
        },
      },
    },
  },
};

function LineGraph({ casesType = "cases" }) {
  const [data, setData] = useState({});

  const buildChartData = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
      .then((response) => response.json())

      .then((data) => {
        const chartData = buildChartData(data, casesType);
        setData(chartData);
      });
  }, [casesType]);

  return (
    <div>
      <Line
        data={{
          datasets: [
            {
              data: data,
              borderColor: "#CC1034",

              backgroundColor: "rgba(204,16,52,0.5)",
              fill: true,
            },
          ],
        }}
        options={options}
      />
    </div>
  );
}

export default LineGraph;
