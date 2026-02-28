import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Download, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { api } from '../../utils/api';

interface SalesReport {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  dailyData?: Array<any>;
  monthlyData?: Array<any>;
}

interface ExpenseReport {
  totalExpenses: number;
  byCategory?: Array<any>;
}

export function ReportsPage() {
  const [timeRange, setTimeRange] = useState('7days');
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [expenseReport, setExpenseReport] = useState<ExpenseReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyRevenueData, setDailyRevenueData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    loadReports();
  }, [timeRange]);

  const loadReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const endDate = new Date();
      let startDate = new Date();
      
      if (timeRange === '7days') startDate.setDate(endDate.getDate() - 7);
      else if (timeRange === '30days') startDate.setDate(endDate.getDate() - 30);
      else if (timeRange === '3months') startDate.setMonth(endDate.getMonth() - 3);
      else startDate.setFullYear(endDate.getFullYear() - 1);

      const [salesRes, expenseRes] = await Promise.all([
        api.reports.getSales(startDate.toISOString(), endDate.toISOString()),
        api.reports.getExpenses(startDate.toISOString(), endDate.toISOString())
      ]);

      const salesData = salesRes.data || salesRes;
      const expenseData = expenseRes.data || expenseRes;

      setSalesReport(salesData);
      setExpenseReport(expenseData);

      // Format data for charts
      setDailyRevenueData(salesData.dailyData || []);
      setMonthlyData(salesData.monthlyData || []);
      setCategoryData(expenseData.byCategory || []);
    } catch (err: any) {
      console.error('Failed to fetch reports:', err);
      setError('Failed to load reports');
      // Fallback to mock data
      setDailyRevenueData([
        { date: 'Mon 20', revenue: 12500, expenses: 4200, profit: 8300 },
        { date: 'Tue 21', revenue: 15200, expenses: 4500, profit: 10700 },
        { date: 'Wed 22', revenue: 18400, expenses: 5100, profit: 13300 },
        { date: 'Thu 23', revenue: 21500, expenses: 5800, profit: 15700 },
        { date: 'Fri 24', revenue: 24800, expenses: 6200, profit: 18600 },
        { date: 'Sat 25', revenue: 28900, expenses: 6800, profit: 22100 },
        { date: 'Sun 26', revenue: 25600, expenses: 6400, profit: 19200 },
      ]);
      setMonthlyData([
        { month: 'Jan', revenue: 185500, expenses: 78200, profit: 107300 },
        { month: 'Feb', revenue: 192300, expenses: 82100, profit: 110200 },
        { month: 'Mar', revenue: 208400, expenses: 85600, profit: 122800 },
        { month: 'Apr', revenue: 195700, expenses: 80400, profit: 115300 },
        { month: 'May', revenue: 218900, expenses: 89200, profit: 129700 },
        { month: 'Jun', revenue: 232400, expenses: 92800, profit: 139600 },
      ]);
      setCategoryData([
        { category: 'Coffee', revenue: 85400, percentage: 38 },
        { category: 'Bakery', revenue: 52300, percentage: 23 },
        { category: 'Dessert', revenue: 38200, percentage: 17 },
        { category: 'Tea', revenue: 28900, percentage: 13 },
        { category: 'Food', revenue: 20700, percentage: 9 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getMetricLabel = () => {
    switch (timeRange) {
      case '7days': return 'Last 7 Days';
      case '30days': return 'Last 30 Days';
      case '3months': return 'Last 3 Months';
      case 'year': return 'This Year';
      default: return '';
    }
  };

  const topProductsData = [
    { name: 'Latte', sold: 856, revenue: 68480 },
    { name: 'Cappuccino', sold: 742, revenue: 55650 },
    { name: 'Croissant', sold: 698, revenue: 31410 },
    { name: 'Americano', sold: 624, revenue: 40560 },
    { name: 'Chocolate Cake', sold: 487, revenue: 41395 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-gray-800">Reports & Analytics</h1>
        <div className="text-center py-12 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-500">Track your business performance</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-5">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500">Total Revenue</p>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h2 className="text-gray-900 mb-1">฿{(salesReport?.totalRevenue || 0).toLocaleString()}</h2>
            <div className="flex items-center gap-1 text-emerald-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{getMetricLabel()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500">Total Expenses</p>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <h2 className="text-gray-900 mb-1">฿{(salesReport?.totalExpenses || 0).toLocaleString()}</h2>
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Tracked expenses</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500">Net Profit</p>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <h2 className="text-gray-900 mb-1">฿{(salesReport?.netProfit || 0).toLocaleString()}</h2>
            <div className="flex items-center gap-1 text-emerald-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>From operations</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500">Profit Margin</p>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h2 className="text-gray-900 mb-1">{((salesReport?.profitMargin || 0) * 100).toFixed(1)}%</h2>
            <div className="flex items-center gap-1 text-emerald-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Healthy margin</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">Revenue & Profit</TabsTrigger>
          <TabsTrigger value="comparison">Monthly Comparison</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>

        {/* Revenue & Profit Tab */}
        <TabsContent value="revenue" className="space-y-5">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-700">Daily Revenue & Profit (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={dailyRevenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                    }}
                    formatter={(value: number) => `฿${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue (฿)"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                    name="Profit (฿)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Comparison Tab */}
        <TabsContent value="comparison" className="space-y-5">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-700">Monthly Revenue vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                    }}
                    formatter={(value: number) => `฿${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue (฿)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses (฿)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" fill="#6366f1" name="Profit (฿)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Tab */}
        <TabsContent value="category" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-700">Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">{item.category}</span>
                        <div className="text-right">
                          <span className="text-gray-900">฿{item.revenue.toLocaleString()}</span>
                          <span className="text-gray-500 text-sm ml-2">({item.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-700">Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis type="category" dataKey="category" tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                      }}
                      formatter={(value: number) => `฿${value.toLocaleString()}`}
                    />
                    <Bar dataKey="revenue" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Top Products Tab */}
        <TabsContent value="products" className="space-y-5">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-700">Top 5 Best Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProductsData.map((product, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-amber-700">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900">{product.name}</h4>
                      <p className="text-gray-500 text-sm">{product.sold} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">฿{product.revenue.toLocaleString()}</p>
                      <p className="text-gray-500 text-sm">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
