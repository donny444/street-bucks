import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const hourlyData = [
  { hour: '6-8', transactions: 8 },
  { hour: '8-10', transactions: 18 },
  { hour: '10-12', transactions: 28 },
  { hour: '12-14', transactions: 35 },
  { hour: '14-16', transactions: 32 },
  { hour: '16-18', transactions: 28 },
  { hour: '18-20', transactions: 24 },
  { hour: '20-22', transactions: 12 },
];

export function PeakSalesHoursChart() {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-700">Peak Sales Hours Analysis (Transactions per Hour)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="hour" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip 
              formatter={(value: number) => [value, 'Transactions']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <Bar dataKey="transactions" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
