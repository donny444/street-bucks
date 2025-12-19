import React from 'react';
import { UserRole } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, ShoppingCart, Package, Users } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { mockSalesData, mockTopSoldMenus, mockMonthlySales, mockBranches } from '../data/mockData';

interface DashboardProps {
  userRole: UserRole;
  branchId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userRole, branchId }) => {
  // Calculate today's sales
  const todaySales = mockSalesData
    .filter((s) => {
      const isToday = s.date === '2024-12-12';
      return userRole === 'admin' ? isToday : isToday && s.branchId === branchId;
    })
    .reduce((sum, s) => sum + s.amount, 0);

  const todayOrders = mockSalesData
    .filter((s) => {
      const isToday = s.date === '2024-12-12';
      return userRole === 'admin' ? isToday : isToday && s.branchId === branchId;
    })
    .reduce((sum, s) => sum + s.orders, 0);

  // Get daily sales for line chart (last 12 days)
  const dailySalesData = mockSalesData
    .filter((s) => userRole === 'admin' ? true : s.branchId === branchId)
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.date === curr.date);
      if (existing) {
        existing.amount += curr.amount;
        existing.orders += curr.orders;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, [] as typeof mockSalesData)
    .slice(-12)
    .map((s) => ({
      date: new Date(s.date).getDate() + ' ' + ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'][new Date(s.date).getMonth()],
      ยอดขาย: s.amount,
    }));

  const summaryCards = [
    {
      title: 'ยอดขายวันนี้',
      value: `฿${todaySales.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    {
      title: 'จำนวนออเดอร์',
      value: todayOrders.toString(),
      icon: ShoppingCart,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
    {
      title: 'สินค้าขายดี',
      value: 'Latte',
      icon: Package,
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
    },
    {
      title: 'พนักงานออนไลน์',
      value: '5 คน',
      icon: Users,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">แดชบอร์ด</h1>
        <p className="text-gray-600">
          {userRole === 'admin' ? 'ภาพรวมทุกสาขา' : `สาขา: ${mockBranches.find((b) => b.id === branchId)?.name}`}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className={`${card.color} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <p className="text-white/80 text-sm mb-1">{card.title}</p>
                      <p className="text-white text-2xl">{card.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart - Top 5 Sold Menus */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Top 5 เมนูขายดี</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockTopSoldMenus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockTopSoldMenus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {mockTopSoldMenus.map((menu, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: menu.color }} />
                  <span className="text-sm text-gray-600">{menu.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Monthly Sales */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">ยอดขายรายเดือน (ปี 2024)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockMonthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `฿${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="branch1" stackId="a" fill="#8b5cf6" name="สยามพารากอน" />
                <Bar dataKey="branch2" stackId="a" fill="#06b6d4" name="เซ็นทรัลเวิลด์" />
                <Bar dataKey="branch3" stackId="a" fill="#f59e0b" name="เอ็มโพเรียม" />
                <Bar dataKey="branch4" stackId="a" fill="#10b981" name="เมกา บางนา" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart - Daily Sales */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">ยอดขายรายวัน (12 วันล่าสุด)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `฿${Number(value).toLocaleString()}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="ยอดขาย"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

