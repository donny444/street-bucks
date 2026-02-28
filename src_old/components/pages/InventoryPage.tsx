import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Search, Plus, AlertTriangle, Edit, Package } from 'lucide-react';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { useBranch } from '../../contexts/BranchContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { Ingredient } from '../../types';

export function InventoryPage() {
  const { selectedBranch } = useBranch();
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState('');

  useEffect(() => {
    if (selectedBranch) {
      loadIngredients();
    }
  }, [selectedBranch]);

  const loadIngredients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.inventory.getAll();
      const items = response.inventory || response.data || [];
      setIngredients(items);
    } catch (err: any) {
      console.error('Failed to fetch inventory:', err);
      setError('Failed to load inventory');
      setIngredients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatus = (current: number, min: number): 'Good' | 'Low' | 'Critical' => {
    if (current <= min * 0.5) return 'Critical';
    if (current <= min) return 'Low';
    return 'Good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'bg-emerald-100 text-emerald-700';
      case 'Low': return 'bg-yellow-100 text-yellow-700';
      case 'Critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStockPercentage = (stock: number, minStock: number) => {
    return Math.min((stock / (minStock * 2)) * 100, 100);
  };

  const handleAdjustStock = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setAdjustmentAmount('');
    setShowAddDialog(true);
  };

  const handleSaveAdjustment = async () => {
    if (!selectedIngredient || !adjustmentAmount) return;

    try {
      const amount = parseFloat(adjustmentAmount);
      await api.inventory.updateStock(selectedIngredient.id, amount);
      
      loadIngredients();
      setShowAddDialog(false);
      setSelectedIngredient(null);
      setAdjustmentAmount('');
    } catch (err: any) {
      console.error('Failed to update stock:', err);
      setError('Failed to update stock');
    }
  };

  const filteredIngredients = ingredients.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = filteredIngredients.filter(
    item => getStatus(item.currentStock, item.minStock) !== 'Good'
  ).length;

  const totalValue = filteredIngredients.reduce(
    (sum, item) => sum + (item.currentStock * item.costPerUnit),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800">Inventory Management</h1>
          <p className="text-gray-500">
            Manage stock levels and supplies - {selectedBranch?.name}
          </p>
        </div>
        {user?.role !== 'staff' && (
          <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4" />
            Add Ingredient
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Items</p>
                <h2 className="mt-1 text-gray-900">{filteredIngredients.length}</h2>
                <p className="text-gray-500 mt-1">In inventory</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Low Stock Alert</p>
                <h2 className="mt-1 text-gray-900">{lowStockItems}</h2>
                <p className="text-red-600 mt-1">Need restocking</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Total Value</p>
            <h2 className="mt-1 text-gray-900">฿{totalValue.toLocaleString()}</h2>
            <p className="text-gray-500 mt-1">Current stock</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Categories</p>
            <h2 className="mt-1 text-gray-900">
              {new Set(filteredIngredients.map(i => i.unit)).size}
            </h2>
            <p className="text-gray-500 mt-1">Unit types</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="text-yellow-900">Low Stock Alert</h4>
                <p className="text-yellow-700">
                  {lowStockItems} items are running low and need to be restocked soon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-700">Stock Items</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-600">INGREDIENT</TableHead>
                  <TableHead className="text-gray-600">CURRENT STOCK</TableHead>
                  <TableHead className="text-gray-600">MIN STOCK</TableHead>
                  <TableHead className="text-gray-600">STOCK LEVEL</TableHead>
                  <TableHead className="text-gray-600">COST/UNIT</TableHead>
                  <TableHead className="text-gray-600">USED IN</TableHead>
                  <TableHead className="text-gray-600">STATUS</TableHead>
                  <TableHead className="text-right text-gray-600">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIngredients.map((item) => {
                  const status = getStatus(item.currentStock, item.minStock);
                  const usedIn = getRecipeInfo(item.id);
                  
                  return (
                    <TableRow key={item.id} className="border-gray-200">
                      <TableCell className="text-gray-900">{item.name}</TableCell>
                      <TableCell className="text-gray-700">
                        {item.currentStock} {item.unit}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {item.minStock} {item.unit}
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          <Progress
                            value={getStockPercentage(item.currentStock, item.minStock)}
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        ฿{item.costPerUnit.toFixed(2)}/{item.unit}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm max-w-[200px] truncate">
                        {usedIn || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(status)}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAdjustStock(item)}
                          disabled={user?.role === 'staff'}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredIngredients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No ingredients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Adjust Stock Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Stock - {selectedIngredient?.name}</DialogTitle>
          </DialogHeader>

          {selectedIngredient && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Stock:</span>
                  <span className="text-gray-900">
                    {selectedIngredient.currentStock} {selectedIngredient.unit}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Minimum Stock:</span>
                  <span className="text-gray-900">
                    {selectedIngredient.minStock} {selectedIngredient.unit}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adjustment">
                  Adjustment Amount (use + or - to add/remove)
                </Label>
                <Input
                  id="adjustment"
                  type="number"
                  placeholder="e.g., +100 or -50"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  New stock will be:{' '}
                  <span className="text-gray-900">
                    {(selectedIngredient.currentStock + (parseFloat(adjustmentAmount) || 0)).toFixed(2)}{' '}
                    {selectedIngredient.unit}
                  </span>
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAdjustment}
              disabled={!adjustmentAmount}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Save Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
