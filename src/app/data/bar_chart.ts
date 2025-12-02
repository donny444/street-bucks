import { ChartData, ChartOptions } from "chart.js";

export const barChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Annual Sales, Stacked by Menu Type",
      color: "black",
      font: { size: 18 },
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
      label: "Hot",
      data: [80, 60, 75, 70, 80, 95, 65, 70, 65, 90, 85, 75],
      backgroundColor: "red",
    },
    {
      label: "Iced",
      data: [30, 70, 55, 45, 35, 60, 60, 50, 40, 70, 35, 40],
      backgroundColor: "blue",
    },
    {
      label: "Bakery",
      data: [20, 40, 30, 50, 45, 55, 35, 30, 25, 40, 50, 60],
      backgroundColor: "orange",
    },
  ],
}