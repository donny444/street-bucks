import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Search, UserPlus, Star } from 'lucide-react';
import { Input } from '../ui/input';
import { api } from '../../utils/api';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  visits: number;
  spent: number;
  tier: string;
  joined: string;
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.customers.getAll();
      const data = response.customers || response.data || [];
      setCustomers(data);
    } catch (err: any) {
      console.error('Failed to fetch customers:', err);
      setError('Failed to load customers');
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return 'bg-yellow-100 text-yellow-700';
      case 'Silver': return 'bg-gray-100 text-gray-700';
      case 'Bronze': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: customers.length,
    goldMembers: customers.filter(c => c.tier === 'Gold').length,
    avgSpend: customers.length > 0 
      ? (customers.reduce((sum, c) => sum + c.spent, 0) / customers.length).toFixed(0)
      : '0',
    retentionRate: '87%'
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-gray-800">Customers</h1>
        <div className="text-center py-12 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800">Customers</h1>
          <p className="text-gray-500">Manage customer relationships and loyalty</p>
        </div>
        <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
          <UserPlus className="w-4 h-4" />
          Add Customer
        </Button>
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
            <p className="text-gray-500">Total Customers</p>
            <h2 className="mt-1 text-gray-900">{stats.total}</h2>
            <p className="text-emerald-600 mt-1">+23 this month</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Gold Members</p>
            <h2 className="mt-1 text-gray-900">{stats.goldMembers}</h2>
            <p className="text-gray-500 mt-1">Top tier customers</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Avg. Spend</p>
            <h2 className="mt-1 text-gray-900">฿{stats.avgSpend}</h2>
            <p className="text-emerald-600 mt-1">Per customer</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Retention Rate</p>
            <h2 className="mt-1 text-gray-900">{stats.retentionRate}</h2>
            <p className="text-emerald-600 mt-1">Excellent!</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-700">Top Spenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.slice(0, 5).sort((a, b) => parseInt(b.spent.replace(/[฿,]/g, '')) - parseInt(a.spent.replace(/[฿,]/g, ''))).map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-700 text-sm">{customer.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm">{customer.name}</p>
                      <p className="text-gray-500 text-xs">{customer.visits} visits</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">{customer.spent}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-500">{customer.tier}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-700">Membership Tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <h4 className="text-yellow-900">Gold</h4>
                  <p className="text-yellow-700 text-sm">฿10,000+ spent</p>
                </div>
                <div className="text-right">
                  <h3 className="text-yellow-900">2</h3>
                  <p className="text-yellow-600 text-sm">members</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <h4 className="text-gray-900">Silver</h4>
                  <p className="text-gray-700 text-sm">฿5,000 - ฿9,999</p>
                </div>
                <div className="text-right">
                  <h3 className="text-gray-900">2</h3>
                  <p className="text-gray-600 text-sm">members</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <h4 className="text-orange-900">Bronze</h4>
                  <p className="text-orange-700 text-sm">Under ฿5,000</p>
                </div>
                <div className="text-right">
                  <h3 className="text-orange-900">2</h3>
                  <p className="text-orange-600 text-sm">members</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-700">All Customers</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search customers..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="text-gray-600">NAME</TableHead>
                <TableHead className="text-gray-600">CONTACT</TableHead>
                <TableHead className="text-gray-600">VISITS</TableHead>
                <TableHead className="text-gray-600">TOTAL SPENT</TableHead>
                <TableHead className="text-gray-600">TIER</TableHead>
                <TableHead className="text-gray-600">JOINED</TableHead>
                <TableHead className="text-right text-gray-600">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="border-gray-200">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-amber-700 text-sm">{customer.name.charAt(0)}</span>
                      </div>
                      <span className="text-gray-900">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-gray-700 text-sm">{customer.email}</p>
                      <p className="text-gray-500 text-xs">{customer.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{customer.visits}</TableCell>
                  <TableCell className="text-gray-900">{customer.spent}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getTierColor(customer.tier)}>
                      {customer.tier}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">{customer.joined}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
