import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { api } from '../utils/api';

interface MenuData {
  name: string;
  sales: number;
  revenue: number;
}

const COLORS = ['#8b5cf6', '#10b981', '#6366f1', '#f59e0b', '#22c55e'];

export function TopMenusPieChart() {
  const [menuData, setMenuData] = useState<MenuData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopMenus();
  }, []);

  const fetchTopMenus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.insights.getSalesToday();
      // Adjust based on actual backend response structure
      const data = response.topMenus || response.data || [];
      setMenuData(data);
    } catch (err: any) {
      console.error('Failed to fetch top menus:', err);
      setError('Failed to load menu data');
      // Fallback to empty data
      setMenuData([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-700">1. Top 5 Sold Menus (Revenue Share)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-gray-500">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || menuData.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-700">1. Top 5 Sold Menus (Revenue Share)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-red-500">
            {error || 'No data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-700">1. Top 5 Sold Menus (Revenue Share)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={menuData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              innerRadius={60}
              fill="#8884d8"
              dataKey="revenue"
              paddingAngle={2}
            >
              {menuData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name, props) => [
                `฿${value.toLocaleString()}`,
                props.payload.name
              ]}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-gray-600" style={{ fontSize: '13px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}