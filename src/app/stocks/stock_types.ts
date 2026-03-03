export interface Stock {
  name: string;
  quantity: number;
  imagePath: string;
}

export interface StockResponse {
  message: string;
  branch_stocks: Stock[];
}
