import axios from 'axios';

// API base URL - connects to backend running on port 8085
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    },
    logout: async () => {
      return await apiClient.post('/auth/logout');
    },
  },

  // Branches endpoints
  branches: {
    getAll: async () => {
      const response = await apiClient.get('/branches');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/branches/${id}`);
      return response.data;
    },
  },

  // Menus endpoints
  menus: {
    getHot: async () => {
      const response = await apiClient.get('/menus/hot');
      return response.data;
    },
    getIced: async () => {
      const response = await apiClient.get('/menus/iced');
      return response.data;
    },
    getCake: async () => {
      const response = await apiClient.get('/menus/cake');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/menus/${id}`);
      return response.data;
    },
  },

  // Orders endpoints
  orders: {
    create: async (orderData: any) => {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    },
    getTodayOrders: async () => {
      const response = await apiClient.get('/orders');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    },
  },

  // Staffs endpoints
  staffs: {
    create: async (staffData: any) => {
      const response = await apiClient.post('/staffs', staffData);
      return response.data;
    },
    update: async (id: string, staffData: any) => {
      const response = await apiClient.post(`/staffs/${id}`, staffData);
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/staffs/${id}`);
      return response.data;
    },
  },

  // Insights endpoints
  insights: {
    getSalesToday: async () => {
      const response = await apiClient.get('/insights/sales-today');
      return response.data;
    },
    getSalesThisWeek: async () => {
      const response = await apiClient.get('/insights/sales-this-week');
      return response.data;
    },
    getSalesThisMonth: async () => {
      const response = await apiClient.get('/insights/sales-this-month');
      return response.data;
    },
  },

  // Inventory endpoints
  inventory: {
    getAll: async () => {
      const response = await apiClient.get('/inventory');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/inventory/${id}`);
      return response.data;
    },
    updateStock: async (id: string, adjustment: number) => {
      const response = await apiClient.patch(`/inventory/${id}`, { adjustment });
      return response.data;
    },
  },

  // Customers endpoints
  customers: {
    getAll: async () => {
      const response = await apiClient.get('/customers');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/customers/${id}`);
      return response.data;
    },
    create: async (customerData: any) => {
      const response = await apiClient.post('/customers', customerData);
      return response.data;
    },
  },

  // Attendance endpoints
  attendance: {
    getToday: async () => {
      const response = await apiClient.get('/attendance/today');
      return response.data;
    },
    getRecent: async (limit: number = 10) => {
      const response = await apiClient.get(`/attendance/recent?limit=${limit}`);
      return response.data;
    },
    checkIn: async (employeeId: string) => {
      const response = await apiClient.post('/attendance/check-in', { employeeId });
      return response.data;
    },
    checkOut: async (attendanceId: string) => {
      const response = await apiClient.post(`/attendance/${attendanceId}/check-out`, {});
      return response.data;
    },
  },

  // Expenses endpoints
  expenses: {
    getAll: async () => {
      const response = await apiClient.get('/expenses');
      return response.data;
    },
    create: async (expenseData: any) => {
      const response = await apiClient.post('/expenses', expenseData);
      return response.data;
    },
    getByBranch: async (branchId: string) => {
      const response = await apiClient.get(`/expenses/branch/${branchId}`);
      return response.data;
    },
  },

  // Recipes endpoints
  recipes: {
    getAll: async () => {
      const response = await apiClient.get('/recipes');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/recipes/${id}`);
      return response.data;
    },
    create: async (recipeData: any) => {
      const response = await apiClient.post('/recipes', recipeData);
      return response.data;
    },
    update: async (id: string, recipeData: any) => {
      const response = await apiClient.put(`/recipes/${id}`, recipeData);
      return response.data;
    },
  },

  // Reports endpoints
  reports: {
    getSales: async (startDate: string, endDate: string) => {
      const response = await apiClient.get(`/reports/sales?start=${startDate}&end=${endDate}`);
      return response.data;
    },
    getInventory: async () => {
      const response = await apiClient.get('/reports/inventory');
      return response.data;
    },
    getAttendance: async (startDate: string, endDate: string) => {
      const response = await apiClient.get(`/reports/attendance?start=${startDate}&end=${endDate}`);
      return response.data;
    },
    getExpenses: async (startDate: string, endDate: string) => {
      const response = await apiClient.get(`/reports/expenses?start=${startDate}&end=${endDate}`);
      return response.data;
    },
  },
};

export default api;
