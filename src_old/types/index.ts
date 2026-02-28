// User & Auth Types
export type UserRole = 'staff' | 'manager' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  branchId: string | null; // null for admin (can access all branches)
  avatar?: string;
  createdAt: string;
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

// Ingredient Types
export interface Ingredient {
  id: string;
  name: string;
  unit: string; // 'g', 'ml', 'pcs', etc.
  currentStock: number;
  minStock: number;
  costPerUnit: number;
  branchId: string;
  lastUpdated: string;
}

// Recipe Types
export interface RecipeIngredient {
  ingredientId: string;
  quantity: number; // amount needed for 1 serving
}

export interface Recipe {
  id: string;
  menuItemId: string;
  ingredients: RecipeIngredient[];
  createdAt: string;
}

// Menu Item Types
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  description?: string;
  isAvailable: boolean;
  branchId: string | 'all'; // 'all' means available in all branches
  createdAt: string;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  branchId: string;
  checkIn: string; // ISO datetime
  checkOut?: string; // ISO datetime
  date: string; // YYYY-MM-DD
  totalHours?: number;
}

// Order Types
export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  branchId: string;
  employeeId: string;
  employeeName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'qr';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string; // ISO datetime
  completedAt?: string;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  points: number;
  totalSpent: number;
  visitCount: number;
  createdAt: string;
}

// Expense Types
export interface Expense {
  id: string;
  branchId: string;
  category: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  createdBy: string;
  createdByName: string;
  createdAt: string;
}
