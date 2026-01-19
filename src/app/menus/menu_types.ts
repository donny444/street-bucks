export interface Menu {
  name: string;
  price: number;
  imagePath: string;
}

export enum MenuCategory {
  HOT = "hot",
  ICED = "iced",
  BAKERY = "bakery",
}

export interface MenuResponse {
  message: string;
  menus: Menu[];
}

export interface SpecificMenuResponse {
  message: string;
  menu: Menu;
}
