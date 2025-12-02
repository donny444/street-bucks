import { ChartData, ChartOptions } from "chart.js";

export const pieChartOptions: ChartOptions<"pie"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: "Top 5 Sold Menus",
      color: "black",
      font: { size: 18 },
    },
  },
};

export const pieChartData: ChartData<"pie"> = {
  labels: [
    "",
    "",
    "",
    "",
    "",
  ],
  datasets: [
    {
      label: "Quantity sold",
      data: [],
      backgroundColor: [
        "blue",
        "orange",
        "green",
        "yellow",
        "purple",
      ],
    },
  ],
};