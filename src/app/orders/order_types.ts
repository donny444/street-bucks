export interface Order {
  uuid: string;
  timestamp: number;
  totalPrice: number;
}

export interface TodayOrdersResponse {
  message: string;
  today_orders: Order[];
}
