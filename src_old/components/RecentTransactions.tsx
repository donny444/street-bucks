import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { api } from '../utils/api';

interface Transaction {
  id: string;
  time: string;
  menu: string;
  amount: string | number;
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await api.orders.getTodayOrders();
      const orders = response.today_orders || response.orders || [];
      
      // Transform orders to transaction format
      const transformedTransactions = orders.slice(0, 6).map((order: any) => ({
        id: order.id,
        time: new Date(order.createdAt).toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        menu: order.items?.map((item: any) => item.menuItemName).join(', ') || 'N/A',
        amount: `฿${order.total.toFixed(0)}`
      }));
      
      setTransactions(transformedTransactions);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-700">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-700">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="text-gray-600">TIME</TableHead>
              <TableHead className="text-gray-600">MENU</TableHead>
              <TableHead className="text-right text-gray-600">AMOUNT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-gray-200">
                  <TableCell className="text-gray-700">{transaction.time}</TableCell>
                  <TableCell className="text-gray-700 truncate">{transaction.menu}</TableCell>
                  <TableCell className="text-right text-gray-900">{transaction.amount}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
