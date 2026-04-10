export interface Order {
  uuid: string;
  timestamp: number;
  totalPrice: number;
}

export interface Entry {
  quantity: number;
  menu: {
    name: string;
    price: number;
  };
}

export interface SpecificOrder {
  uuid: Order["uuid"];
  timestamp: Order["timestamp"];
  totalPrice: Order["totalPrice"];
  entry: Entry[];
}

export interface TodayOrdersResponse {
  message: string;
  error: string;
  today_orders: Order[];
}

export interface SpecificOrderResponse {
  message: string;
  error: string;
  order: SpecificOrder;
}
