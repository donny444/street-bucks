import { ChartData, ChartOptions } from "chart.js";

export const lineChartOptions: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "",
      color: "black",
    },
  },
}

export const lineChartData: ChartData<"line"> = {
  labels: [],
  datasets: [
    {
      data: [],
      fill: false,
      borderColor: "blue",
      tension: 0.1,
    },
  ],
};
