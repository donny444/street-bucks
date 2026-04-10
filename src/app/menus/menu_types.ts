export interface Menu {
  name: string;
  price: number;
  imagePath: string;
}

export interface OrderedMenu {
  menuId: string;
  quantity: number;
}

export enum MenuCategory {
  HOT = "hot",
  ICED = "iced",
  BAKERY = "bakery",
}

export interface MenuResponse {
  message?: string;
  menus?: Menu[];
  error?: string;
}

export interface SpecificMenuResponse {
  message?: string;
  menu?: Menu;
  error?: string;
}

export interface MakeOrderResponse {
  message?: string;
  order_id?: string;
  error?: string;
}
