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
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Beverage",
      data: [80, 60, 75, 70, 80, 95, 65, 70, 65, 90, 85, 75],
      backgroundColor: "blue",
    },
    {
      label: "Bakery",
      data: [30, 70, 55, 45, 35, 60, 60, 50, 40, 70, 35, 40],
      backgroundColor: "orange",
    },
  ],
}