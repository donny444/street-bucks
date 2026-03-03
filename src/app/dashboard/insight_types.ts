export type ResponseForPieChart = {
  message: string;
  insight: SoldMenuByQuantity;
};

export type ResponseForLineChart = {
  message: string;
  insight: {
    labels: string[];
    data: number[];
  };
};

export type ResponseForBarChart = {
  message: string;
  insight: CategoricalSales[];
};

export type CategoricalSales = {
  label: string;
  data: number[];
};

export enum PeriodEnum {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  ANNUAL = "annual",
}

type SoldMenuByQuantity = {
  labels: string[];
  data: number[];
};
