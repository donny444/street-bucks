import { ChartData, ChartOptions } from "chart.js";

export const barChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Sales by Months",
      color: "black",
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      beginAtZero: true,
    },
  },
};

export const barChartData: ChartData<"bar"> = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Beverages",
      data: [],
      backgroundColor: "blue",
    },
    {
      label: "Bakeries",
      data: [],
      backgroundColor: "orange",
    },
  ],
}