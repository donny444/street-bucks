export type UserRole = 'staff' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId: string;
  phone?: string;
  position?: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  managerName: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Coffee' | 'Non-Coffee' | 'Tea' | 'Bakery';
  price: number;
  image: string;
  ingredients: { ingredientId: string; quantity: number }[];
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  branchId?: string;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  branchId: string;
  staffName: string;
  items: OrderItem[];
  total: number;
  timestamp: Date;
  status: 'completed' | 'cancelled';
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  branchId: string;
  checkIn: Date;
  checkOut?: Date;
  date: string;
}

export interface SalesData {
  date: string;
  amount: number;
  orders: number;
  branchId?: string;
}

