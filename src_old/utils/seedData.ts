import { 
  User, 
  Branch, 
  Ingredient, 
  Recipe, 
  MenuItem, 
  AttendanceRecord, 
  Order,
  Customer,
  Expense
} from '../types';
import { 
  userDB, 
  branchDB, 
  ingredientDB, 
  recipeDB, 
  menuItemDB, 
  attendanceDB, 
  orderDB,
  customerDB,
  expenseDB,
  db 
} from './database';

export function initializeData() {
  // Check if data already exists
  if (userDB.getAll().length > 0) {
    return; // Data already seeded
  }

  // Seed Branches
  const branches: Branch[] = [
    {
      id: 'branch-1',
      name: 'สาขาสยามพารากอน',
      code: 'SPG',
      address: '991 ถ.พระราม 1 ปทุมวัน กรุงเทพ 10330',
      phone: '02-123-4567',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'branch-2',
      name: 'สาขาเซ็นทรัลเวิลด์',
      code: 'CTW',
      address: '4, 4/1-4/2, 4/4 ถ.ราชดำริ ปทุมวัน กรุงเทพ 10330',
      phone: '02-234-5678',
      isActive: true,
      createdAt: '2025-01-15T00:00:00Z'
    },
    {
      id: 'branch-3',
      name: 'สาขาเอ็มควอเทียร์',
      code: 'EMQ',
      address: '693, 695 ถ.สุขุมวิท วัฒนา กรุงเทพ 10110',
      phone: '02-345-6789',
      isActive: true,
      createdAt: '2025-02-01T00:00:00Z'
    }
  ];
  branches.forEach(b => branchDB.create(b));

  // Seed Users
  const users: User[] = [
    {
      id: 'user-1',
      email: 'admin@cafe.com',
      password: 'admin123',
      name: 'Admin Master',
      role: 'admin',
      branchId: null, // Can access all branches
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'user-2',
      email: 'manager.spg@cafe.com',
      password: 'manager123',
      name: 'ผู้จัดการสยาม',
      role: 'manager',
      branchId: 'branch-1',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'user-3',
      email: 'manager.ctw@cafe.com',
      password: 'manager123',
      name: 'ผู้จัดการเซ็นทรัล',
      role: 'manager',
      branchId: 'branch-2',
      createdAt: '2025-01-15T00:00:00Z'
    },
    {
      id: 'user-4',
      email: 'staff.spg@cafe.com',
      password: 'staff123',
      name: 'พนักงานสยาม A',
      role: 'staff',
      branchId: 'branch-1',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'user-5',
      email: 'staff.ctw@cafe.com',
      password: 'staff123',
      name: 'พนักงานเซ็นทรัล B',
      role: 'staff',
      branchId: 'branch-2',
      createdAt: '2025-01-15T00:00:00Z'
    }
  ];
  users.forEach(u => userDB.create(u));

  // Seed Menu Items
  const menuItems: MenuItem[] = [
    {
      id: 'menu-1',
      name: 'Espresso',
      category: 'Coffee',
      price: 65,
      isAvailable: true,
      branchId: 'all',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'menu-2',
      name: 'Cappuccino',
      category: 'Coffee',
      price: 85,
      isAvailable: true,
      branchId: 'all',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'menu-3',
      name: 'Latte',
      category: 'Coffee',
      price: 90,
      isAvailable: true,
      branchId: 'all',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'menu-4',
      name: 'Americano',
      category: 'Coffee',
      price: 75,
      isAvailable: true,
      branchId: 'all',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'menu-5',
      name: 'Mocha',
      category: 'Coffee',
      price: 95,
      isAvailable: true,
      branchId: 'all',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'menu-6',
      name: 'Croissant',
      category: 'Bakery',
      price: 55,
      isAvailable: true,
      branchId: 'all',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'menu-7',
      name: 'Chocolate Cake',
      category: 'Dessert',
      price: 120,
      isAvailable: true,
      branchId: 'all',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'menu-8',
      name: 'Green Tea Latte',
      category: 'Tea',
      price: 85,
      isAvailable: true,
      branchId: 'all',
      createdAt: '2025-01-01T00:00:00Z'
    }
  ];
  menuItems.forEach(m => menuItemDB.create(m));

  // Seed Ingredients for Branch 1
  const ingredientsBranch1: Ingredient[] = [
    {
      id: 'ing-1-1',
      name: 'Coffee Beans',
      unit: 'g',
      currentStock: 5000,
      minStock: 1000,
      costPerUnit: 0.8,
      branchId: 'branch-1',
      lastUpdated: '2025-10-31T00:00:00Z'
    },
    {
      id: 'ing-1-2',
      name: 'Milk',
      unit: 'ml',
      currentStock: 10000,
      minStock: 2000,
      costPerUnit: 0.05,
      branchId: 'branch-1',
      lastUpdated: '2025-10-31T00:00:00Z'
    },
    {
      id: 'ing-1-3',
      name: 'Sugar',
      unit: 'g',
      currentStock: 3000,
      minStock: 500,
      costPerUnit: 0.02,
      branchId: 'branch-1',
      lastUpdated: '2025-10-31T00:00:00Z'
    },
    {
      id: 'ing-1-4',
      name: 'Chocolate Powder',
      unit: 'g',
      currentStock: 2000,
      minStock: 300,
      costPerUnit: 0.15,
      branchId: 'branch-1',
      lastUpdated: '2025-10-31T00:00:00Z'
    },
    {
      id: 'ing-1-5',
      name: 'Flour',
      unit: 'g',
      currentStock: 8000,
      minStock: 1500,
      costPerUnit: 0.03,
      branchId: 'branch-1',
      lastUpdated: '2025-10-31T00:00:00Z'
    }
  ];
  ingredientsBranch1.forEach(i => ingredientDB.create(i));

  // Seed Ingredients for Branch 2
  const ingredientsBranch2: Ingredient[] = [
    {
      id: 'ing-2-1',
      name: 'Coffee Beans',
      unit: 'g',
      currentStock: 4500,
      minStock: 1000,
      costPerUnit: 0.8,
      branchId: 'branch-2',
      lastUpdated: '2025-10-31T00:00:00Z'
    },
    {
      id: 'ing-2-2',
      name: 'Milk',
      unit: 'ml',
      currentStock: 9000,
      minStock: 2000,
      costPerUnit: 0.05,
      branchId: 'branch-2',
      lastUpdated: '2025-10-31T00:00:00Z'
    },
    {
      id: 'ing-2-3',
      name: 'Sugar',
      unit: 'g',
      currentStock: 2800,
      minStock: 500,
      costPerUnit: 0.02,
      branchId: 'branch-2',
      lastUpdated: '2025-10-31T00:00:00Z'
    }
  ];
  ingredientsBranch2.forEach(i => ingredientDB.create(i));

  // Seed Recipes
  const recipes: Recipe[] = [
    {
      id: 'recipe-1',
      menuItemId: 'menu-1', // Espresso
      ingredients: [
        { ingredientId: 'ing-1-1', quantity: 18 } // 18g coffee beans
      ],
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'recipe-2',
      menuItemId: 'menu-2', // Cappuccino
      ingredients: [
        { ingredientId: 'ing-1-1', quantity: 18 },
        { ingredientId: 'ing-1-2', quantity: 150 } // 150ml milk
      ],
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'recipe-3',
      menuItemId: 'menu-3', // Latte
      ingredients: [
        { ingredientId: 'ing-1-1', quantity: 18 },
        { ingredientId: 'ing-1-2', quantity: 200 }
      ],
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'recipe-4',
      menuItemId: 'menu-5', // Mocha
      ingredients: [
        { ingredientId: 'ing-1-1', quantity: 18 },
        { ingredientId: 'ing-1-2', quantity: 150 },
        { ingredientId: 'ing-1-4', quantity: 20 } // chocolate powder
      ],
      createdAt: '2025-01-01T00:00:00Z'
    }
  ];
  recipes.forEach(r => recipeDB.create(r));

  // Seed Sample Orders
  const sampleOrders: Order[] = [
    {
      id: 'order-1',
      orderNumber: 'SPG-001',
      branchId: 'branch-1',
      employeeId: 'user-4',
      employeeName: 'พนักงานสยาม A',
      items: [
        { menuItemId: 'menu-3', menuItemName: 'Latte', quantity: 2, price: 90, subtotal: 180 },
        { menuItemId: 'menu-6', menuItemName: 'Croissant', quantity: 1, price: 55, subtotal: 55 }
      ],
      subtotal: 235,
      tax: 16.45,
      discount: 0,
      total: 251.45,
      paymentMethod: 'cash',
      status: 'completed',
      createdAt: '2025-10-31T08:30:00Z',
      completedAt: '2025-10-31T08:31:00Z'
    },
    {
      id: 'order-2',
      orderNumber: 'SPG-002',
      branchId: 'branch-1',
      employeeId: 'user-4',
      employeeName: 'พนักงานสยาม A',
      items: [
        { menuItemId: 'menu-2', menuItemName: 'Cappuccino', quantity: 1, price: 85, subtotal: 85 }
      ],
      subtotal: 85,
      tax: 5.95,
      discount: 0,
      total: 90.95,
      paymentMethod: 'card',
      status: 'completed',
      createdAt: '2025-10-31T09:15:00Z',
      completedAt: '2025-10-31T09:16:00Z'
    },
    {
      id: 'order-3',
      orderNumber: 'CTW-001',
      branchId: 'branch-2',
      employeeId: 'user-5',
      employeeName: 'พนักงานเซ็นทรัล B',
      items: [
        { menuItemId: 'menu-5', menuItemName: 'Mocha', quantity: 1, price: 95, subtotal: 95 },
        { menuItemId: 'menu-7', menuItemName: 'Chocolate Cake', quantity: 1, price: 120, subtotal: 120 }
      ],
      subtotal: 215,
      tax: 15.05,
      discount: 0,
      total: 230.05,
      paymentMethod: 'qr',
      status: 'completed',
      createdAt: '2025-10-31T10:00:00Z',
      completedAt: '2025-10-31T10:02:00Z'
    }
  ];
  sampleOrders.forEach(o => orderDB.create(o));

  // Seed Customers
  const customers: Customer[] = [
    {
      id: 'cust-1',
      name: 'สมชาย ใจดี',
      email: 'somchai@email.com',
      phone: '081-234-5678',
      points: 250,
      totalSpent: 5000,
      visitCount: 25,
      createdAt: '2025-01-15T00:00:00Z'
    },
    {
      id: 'cust-2',
      name: 'สมหญิง รักสวย',
      phone: '082-345-6789',
      points: 180,
      totalSpent: 3600,
      visitCount: 18,
      createdAt: '2025-02-01T00:00:00Z'
    }
  ];
  customers.forEach(c => customerDB.create(c));

  // Seed Expenses
  const expenses: Expense[] = [
    {
      id: 'exp-1',
      branchId: 'branch-1',
      category: 'Utilities',
      description: 'ค่าไฟฟ้าประจำเดือน',
      amount: 8500,
      date: '2025-10-01',
      createdBy: 'user-2',
      createdByName: 'ผู้จัดการสยาม',
      createdAt: '2025-10-01T10:00:00Z'
    },
    {
      id: 'exp-2',
      branchId: 'branch-1',
      category: 'Supplies',
      description: 'ซื้อแก้วกระดาษและหลอดเพิ่มเติม',
      amount: 3200,
      date: '2025-10-15',
      createdBy: 'user-2',
      createdByName: 'ผู้จัดการสยาม',
      createdAt: '2025-10-15T14:30:00Z'
    },
    {
      id: 'exp-3',
      branchId: 'branch-2',
      category: 'Utilities',
      description: 'ค่าไฟฟ้าประจำเดือน',
      amount: 7800,
      date: '2025-10-01',
      createdBy: 'user-3',
      createdByName: 'ผู้จัดการเซ็นทรัล',
      createdAt: '2025-10-01T10:00:00Z'
    }
  ];
  expenses.forEach(e => expenseDB.create(e));

  console.log('✅ Sample data initialized successfully!');
}
