export interface Stock {
  recipe: {
    name: string;
    unit: string;
    imagePath: string;
  };
  quantity: number;
}

export interface BranchStocksResponse {
  message?: string;
  branch_stocks?: Stock[];
  error?: string;
}

export interface EditStockRequest {
  recipeId: string;
  quantity: number;
}

export interface StockUpdateResponse {
  message?: string;
  error?: string;
}
