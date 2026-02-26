import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { api } from '../utils/api';

interface WeeklyData {
  day: string;
  sales: number;
}

export function SalesWeekLineChart() {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeeklySales();
  }, []);

  const fetchWeeklySales = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.insights.getSalesThisWeek();
      // Adjust based on actual backend response structure
      const data = response.weeklySales || response.data || [];
      setWeeklyData(data);
    } catch (err: any) {
      console.error('Failed to fetch weekly sales:', err);
      setError('Failed to load sales data');
      setWeeklyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-700">3. Sales Trend by Day of the Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-gray-500">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || weeklyData.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-700">3. Sales Trend by Day of the Week</CardTitle>
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
        <CardTitle className="text-gray-700">3. Sales Trend by Day of the Week</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ value: 'Day of the Week', position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: '#6b7280' } }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ value: 'Sales (฿)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number) => [`฿${value.toLocaleString()}`, 'Daily Sales']}
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
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#10b981" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorSales)"
              name="Daily Sales (฿)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
