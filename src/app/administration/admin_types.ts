export interface AdminSignInParams {
  email?: string;
  password?: string;
}

export interface AdminSignInResponse {
  message?: string;
  token?: string;
  error?: string;
}

export interface BranchResponse {
  message?: string;
  branch_ids?: number[];
  error?: string;
}

export enum MenuCategory {
  HOT = "HOT",
  ICED = "ICED",
  BAKERY = "BAKERY",
}

export interface Menu {
  name: string;
  price: number;
  category: MenuCategory;
  imagePath: string;
}

export interface MenuResponse {
  message?: string;
  menus?: Menu[];
  error?: string;
}

export interface MenuForm {
  name: string;
  price: number;
  category: MenuCategory;
  file: File | null;
}

export interface MenuFormResponse {
  message?: string;
  menu_form?: MenuForm;
  error?: string;
}

export interface MenuIngredient {
  recipeId: string;
  amount: number;
}

export interface MenuIngredientsResponse {
  message?: string;
  menu_ingredients?: MenuIngredient[];
  error?: string;
}

export type IngredientEntry = string;

export interface IngredientListResponse {
  message?: string;
  ingredient_list?: IngredientEntry[];
  error?: string;
}

export interface Recipe {
  name: string;
  unit: string;
  imagePath: string;
}

export interface RecipeResponse {
  message?: string;
  recipes?: Recipe[];
  error?: string;
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  branchId?: number;
}

export interface UserResponse {
  message?: string;
  found_users?: User[];
  error?: string;
}

export interface Order {
  uuid: string;
  branchId: number;
  timestamp: number;
  totalPrice: number;
}

export interface OrderResponse {
  message?: string;
  found_order?: Order;
  error?: string;
}
