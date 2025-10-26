import { ChartData, ChartOptions } from "chart.js";

export const pieChartOptions: ChartOptions<"pie"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Top 5 Sold Menus",
      color: "black",
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
      label: "Sales",
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