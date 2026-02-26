import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useBranch } from '../../contexts/BranchContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { Order } from '../../types';
import { Receipt } from '../Receipt';

export function OrdersPage() {
  const { selectedBranch } = useBranch();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);

  useEffect(() => {
    if (selectedBranch) {
      loadOrders();
    }
  }, [selectedBranch]);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.orders.getTodayOrders();
      const todayOrders = response.today_orders || response.orders || response.data || [];
      
      // Sort by date descending
      const sorted = todayOrders.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setOrders(sorted);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewReceipt = (order: Order) => {
    setSelectedOrder(order);
    setShowReceiptDialog(true);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const filteredOrders = orders.filter(order =>
    (order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (order.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
  );

  const stats = {
    total: filteredOrders.length,
    completed: filteredOrders.filter(o => o.status === 'completed').length,
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    totalRevenue: filteredOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800">Orders</h1>
          <p className="text-gray-500">
            Manage and track all customer orders - {selectedBranch?.name}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="mt-1 text-gray-900">{stats.total}</h2>
            <p className="text-gray-500 mt-1">Today</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Completed</p>
            <h2 className="mt-1 text-gray-900">{stats.completed}</h2>
            <p className="text-emerald-600 mt-1">Orders done</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">In Progress</p>
            <h2 className="mt-1 text-gray-900">{stats.pending}</h2>
            <p className="text-blue-600 mt-1">Active orders</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Total Revenue</p>
            <h2 className="mt-1 text-gray-900">฿{stats.totalRevenue.toFixed(0)}</h2>
            <p className="text-gray-500 mt-1">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-700">All Orders</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading orders...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-gray-600">ORDER ID</TableHead>
                    <TableHead className="text-gray-600">DATE & TIME</TableHead>
                    <TableHead className="text-gray-600">CASHIER</TableHead>
                    <TableHead className="text-gray-600">ITEMS</TableHead>
                    <TableHead className="text-gray-600">PAYMENT</TableHead>
                    <TableHead className="text-gray-600">TOTAL</TableHead>
                    <TableHead className="text-gray-600">STATUS</TableHead>
                    <TableHead className="text-right text-gray-600">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-gray-200">
                      <TableCell className="text-gray-900">{order.orderNumber}</TableCell>
                      <TableCell className="text-gray-700">
                        <div>
                          <p>{formatDate(order.createdAt)}</p>
                          <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">{order.employeeName}</TableCell>
                      <TableCell className="text-gray-700">
                        <div>
                          <p>{order.items?.[0]?.menuItemName || 'N/A'}</p>
                          {order.items && order.items.length > 1 && (
                            <p className="text-xs text-gray-500">
                              +{order.items.length - 1} more
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 uppercase text-sm">
                        {order.paymentMethod}
                      </TableCell>
                      <TableCell className="text-gray-900">฿{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewReceipt(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Receipt</DialogTitle>
          </DialogHeader>

          {selectedOrder && selectedBranch && (
            <Receipt
              order={selectedOrder}
              branchName={selectedBranch.name}
              branchAddress={selectedBranch.address}
              branchPhone={selectedBranch.phone}
            />
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowReceiptDialog(false)} className="flex-1">
              Close
            </Button>
            <Button onClick={handlePrintReceipt} className="flex-1 bg-amber-600 hover:bg-amber-700">
              <Download className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
