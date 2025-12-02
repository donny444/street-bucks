import { ChartData, ChartOptions } from "chart.js";
import { rgba } from "polished";

export const lineChartOptions: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Sales in This Week/Month",
      color: "black",
      font: { size: 18 },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Days of week/month",
      },
    },
    y: {
      beginAtZero: true,
    },
  },
};

export const lineChartData: ChartData<"line"> = {
  labels: ["26/10", "27/10", "28/10", "29/10", "30/10", "31/10", "1/11"],
  datasets: [
    {
      data: [7, 4, 4, 7, 8, 3, 2],
      fill: true,
      borderColor: "blue",
      backgroundColor: rgba("blue", 0.5),
      tension: 0.4,
      label: "Number of Sales",
    },
  ],
};
