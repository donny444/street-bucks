import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Search, Plus, Calendar, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { api } from '../../utils/api';

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  vendor: string;
}

const categories = ['Inventory', 'Utilities', 'Rent', 'Salary', 'Maintenance', 'Marketing', 'Other'];

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Inventory',
    description: '',
    amount: '',
    vendor: ''
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.expenses.getAll();
      const data = response.expenses || response.data || [];
      setExpenses(data);
    } catch (err: any) {
      console.error('Failed to fetch expenses:', err);
      setError('Failed to load expenses');
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    setIsProcessing(true);
    setError(null);
    try {
      await api.expenses.create({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      loadExpenses();
      setShowAddDialog(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: 'Inventory',
        description: '',
        amount: '',
        vendor: ''
      });
    } catch (err: any) {
      console.error('Failed to add expense:', err);
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyBudget = 80000;
  const budgetUsed = (totalExpenses / monthlyBudget) * 100;

  const categoryTotals = categories.map(category => {
    const total = expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
    return { category, total };
  }).filter(item => item.total > 0);

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Inventory': 'bg-blue-100 text-blue-700',
      'Utilities': 'bg-yellow-100 text-yellow-700',
      'Rent': 'bg-purple-100 text-purple-700',
      'Salary': 'bg-green-100 text-green-700',
      'Maintenance': 'bg-orange-100 text-orange-700',
      'Marketing': 'bg-pink-100 text-pink-700',
      'Other': 'bg-gray-100 text-gray-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-gray-800">Expenses</h1>
        <div className="text-center py-12 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800">Expenses</h1>
          <p className="text-gray-500">Track and manage business expenses</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Expense description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input
                  id="vendor"
                  placeholder="Vendor name"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isProcessing} className="bg-amber-600 hover:bg-amber-700">
                  {isProcessing ? 'Adding...' : 'Add Expense'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500">Total Expenses</p>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <h2 className="text-gray-900 mb-1">฿{totalExpenses.toLocaleString()}</h2>
            <p className="text-gray-500 text-sm">This month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500">Monthly Budget</p>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <h2 className="text-gray-900 mb-1">฿{monthlyBudget.toLocaleString()}</h2>
            <p className="text-gray-500 text-sm">Allocated budget</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500">Budget Used</p>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <h2 className="text-gray-900 mb-1">{budgetUsed.toFixed(1)}%</h2>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${budgetUsed}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500">Remaining</p>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h2 className="text-gray-900 mb-1">฿{(monthlyBudget - totalExpenses).toLocaleString()}</h2>
            <p className="text-gray-500 text-sm">Available budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-700">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryTotals.map((item) => (
              <div key={item.category} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">{item.category}</span>
                  <Badge variant="secondary" className={getCategoryColor(item.category)}>
                    {((item.total / totalExpenses) * 100).toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-gray-900 text-xl">฿{item.total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-700">Recent Expenses</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search expenses..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="text-gray-600">DATE</TableHead>
                <TableHead className="text-gray-600">CATEGORY</TableHead>
                <TableHead className="text-gray-600">DESCRIPTION</TableHead>
                <TableHead className="text-gray-600">VENDOR</TableHead>
                <TableHead className="text-right text-gray-600">AMOUNT</TableHead>
                <TableHead className="text-right text-gray-600">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id} className="border-gray-200">
                  <TableCell className="text-gray-700">
                    {new Date(expense.date).toLocaleDateString('th-TH', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getCategoryColor(expense.category)}>
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-900">{expense.description}</TableCell>
                  <TableCell className="text-gray-700">{expense.vendor}</TableCell>
                  <TableCell className="text-right text-gray-900">
                    ฿{expense.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
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
