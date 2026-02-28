import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { api } from '../utils/api';

interface MonthlyData {
  month: string;
  beverage: number;
  bakery: number;
}

export function SalesByMonthChart() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMonthlySales();
  }, []);

  const fetchMonthlySales = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.insights.getSalesThisMonth();
      // Adjust based on actual backend response structure
      const data = response.monthlySales || response.data || [];
      setMonthlyData(data);
    } catch (err: any) {
      console.error('Failed to fetch monthly sales:', err);
      setError('Failed to load sales data');
      setMonthlyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-700">2. Sales by Months (Bakery vs Beverage)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-gray-500">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || monthlyData.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-700">2. Sales by Months (Bakery vs Beverage)</CardTitle>
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
        <CardTitle className="text-gray-700">2. Sales by Months (Bakery vs Beverage)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ value: 'Sales (k)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
            />
            <Tooltip 
              formatter={(value: number) => `฿${value}k`}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '13px' }}
              iconType="circle"
            />
            <Bar dataKey="bakery" stackId="a" fill="#f59e0b" name="Bakery (฿)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="beverage" stackId="a" fill="#6366f1" name="Beverage (฿)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}