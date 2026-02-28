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

// localStorage keys
const KEYS = {
  USERS: 'cafe_pos_users',
  BRANCHES: 'cafe_pos_branches',
  INGREDIENTS: 'cafe_pos_ingredients',
  RECIPES: 'cafe_pos_recipes',
  MENU_ITEMS: 'cafe_pos_menu_items',
  ATTENDANCE: 'cafe_pos_attendance',
  ORDERS: 'cafe_pos_orders',
  CUSTOMERS: 'cafe_pos_customers',
  EXPENSES: 'cafe_pos_expenses',
  CURRENT_USER: 'cafe_pos_current_user',
};

// Generic localStorage helpers
export const db = {
  get<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  
  set<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  },
  
  clear(key: string): void {
    localStorage.removeItem(key);
  },
  
  clearAll(): void {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  }
};

// Users
export const userDB = {
  getAll: (): User[] => db.get<User>(KEYS.USERS),
  getById: (id: string): User | undefined => userDB.getAll().find(u => u.id === id),
  getByEmail: (email: string): User | undefined => userDB.getAll().find(u => u.email === email),
  create: (user: User): void => {
    const users = userDB.getAll();
    users.push(user);
    db.set(KEYS.USERS, users);
  },
  update: (id: string, updates: Partial<User>): void => {
    const users = userDB.getAll();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      db.set(KEYS.USERS, users);
    }
  },
  delete: (id: string): void => {
    const users = userDB.getAll().filter(u => u.id !== id);
    db.set(KEYS.USERS, users);
  },
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem(KEYS.CURRENT_USER);
    return userData ? JSON.parse(userData) : null;
  },
  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  }
};

// Branches
export const branchDB = {
  getAll: (): Branch[] => db.get<Branch>(KEYS.BRANCHES),
  getById: (id: string): Branch | undefined => branchDB.getAll().find(b => b.id === id),
  create: (branch: Branch): void => {
    const branches = branchDB.getAll();
    branches.push(branch);
    db.set(KEYS.BRANCHES, branches);
  },
  update: (id: string, updates: Partial<Branch>): void => {
    const branches = branchDB.getAll();
    const index = branches.findIndex(b => b.id === id);
    if (index !== -1) {
      branches[index] = { ...branches[index], ...updates };
      db.set(KEYS.BRANCHES, branches);
    }
  }
};

// Ingredients
export const ingredientDB = {
  getAll: (): Ingredient[] => db.get<Ingredient>(KEYS.INGREDIENTS),
  getByBranch: (branchId: string): Ingredient[] => 
    ingredientDB.getAll().filter(i => i.branchId === branchId),
  getById: (id: string): Ingredient | undefined => 
    ingredientDB.getAll().find(i => i.id === id),
  create: (ingredient: Ingredient): void => {
    const ingredients = ingredientDB.getAll();
    ingredients.push(ingredient);
    db.set(KEYS.INGREDIENTS, ingredients);
  },
  update: (id: string, updates: Partial<Ingredient>): void => {
    const ingredients = ingredientDB.getAll();
    const index = ingredients.findIndex(i => i.id === id);
    if (index !== -1) {
      ingredients[index] = { ...ingredients[index], ...updates };
      db.set(KEYS.INGREDIENTS, ingredients);
    }
  },
  updateStock: (id: string, quantity: number): void => {
    const ingredient = ingredientDB.getById(id);
    if (ingredient) {
      ingredientDB.update(id, { 
        currentStock: ingredient.currentStock + quantity,
        lastUpdated: new Date().toISOString()
      });
    }
  }
};

// Recipes
export const recipeDB = {
  getAll: (): Recipe[] => db.get<Recipe>(KEYS.RECIPES),
  getByMenuItem: (menuItemId: string): Recipe | undefined => 
    recipeDB.getAll().find(r => r.menuItemId === menuItemId),
  create: (recipe: Recipe): void => {
    const recipes = recipeDB.getAll();
    recipes.push(recipe);
    db.set(KEYS.RECIPES, recipes);
  },
  update: (menuItemId: string, updates: Partial<Recipe>): void => {
    const recipes = recipeDB.getAll();
    const index = recipes.findIndex(r => r.menuItemId === menuItemId);
    if (index !== -1) {
      recipes[index] = { ...recipes[index], ...updates };
      db.set(KEYS.RECIPES, recipes);
    }
  }
};

// Menu Items
export const menuItemDB = {
  getAll: (): MenuItem[] => db.get<MenuItem>(KEYS.MENU_ITEMS),
  getById: (id: string): MenuItem | undefined => 
    menuItemDB.getAll().find(m => m.id === id),
  getByBranch: (branchId: string): MenuItem[] => 
    menuItemDB.getAll().filter(m => m.branchId === branchId || m.branchId === 'all'),
  create: (menuItem: MenuItem): void => {
    const items = menuItemDB.getAll();
    items.push(menuItem);
    db.set(KEYS.MENU_ITEMS, items);
  },
  update: (id: string, updates: Partial<MenuItem>): void => {
    const items = menuItemDB.getAll();
    const index = items.findIndex(m => m.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      db.set(KEYS.MENU_ITEMS, items);
    }
  }
};

// Attendance
export const attendanceDB = {
  getAll: (): AttendanceRecord[] => db.get<AttendanceRecord>(KEYS.ATTENDANCE),
  getByBranch: (branchId: string): AttendanceRecord[] => 
    attendanceDB.getAll().filter(a => a.branchId === branchId),
  getByEmployee: (employeeId: string): AttendanceRecord[] => 
    attendanceDB.getAll().filter(a => a.employeeId === employeeId),
  getTodayByEmployee: (employeeId: string): AttendanceRecord | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceDB.getAll().find(a => 
      a.employeeId === employeeId && a.date === today
    );
  },
  create: (attendance: AttendanceRecord): void => {
    const records = attendanceDB.getAll();
    records.push(attendance);
    db.set(KEYS.ATTENDANCE, records);
  },
  update: (id: string, updates: Partial<AttendanceRecord>): void => {
    const records = attendanceDB.getAll();
    const index = records.findIndex(a => a.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      db.set(KEYS.ATTENDANCE, records);
    }
  }
};

// Orders
export const orderDB = {
  getAll: (): Order[] => db.get<Order>(KEYS.ORDERS),
  getByBranch: (branchId: string): Order[] => 
    orderDB.getAll().filter(o => o.branchId === branchId),
  getById: (id: string): Order | undefined => 
    orderDB.getAll().find(o => o.id === id),
  create: (order: Order): void => {
    const orders = orderDB.getAll();
    orders.push(order);
    db.set(KEYS.ORDERS, orders);
  },
  update: (id: string, updates: Partial<Order>): void => {
    const orders = orderDB.getAll();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      db.set(KEYS.ORDERS, orders);
    }
  }
};

// Customers
export const customerDB = {
  getAll: (): Customer[] => db.get<Customer>(KEYS.CUSTOMERS),
  getById: (id: string): Customer | undefined => 
    customerDB.getAll().find(c => c.id === id),
  create: (customer: Customer): void => {
    const customers = customerDB.getAll();
    customers.push(customer);
    db.set(KEYS.CUSTOMERS, customers);
  },
  update: (id: string, updates: Partial<Customer>): void => {
    const customers = customerDB.getAll();
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      db.set(KEYS.CUSTOMERS, customers);
    }
  }
};

// Expenses
export const expenseDB = {
  getAll: (): Expense[] => db.get<Expense>(KEYS.EXPENSES),
  getByBranch: (branchId: string): Expense[] => 
    expenseDB.getAll().filter(e => e.branchId === branchId),
  create: (expense: Expense): void => {
    const expenses = expenseDB.getAll();
    expenses.push(expense);
    db.set(KEYS.EXPENSES, expenses);
  }
};
