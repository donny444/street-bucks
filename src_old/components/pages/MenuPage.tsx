import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Search, Plus, Grid, List } from 'lucide-react';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { api } from '../../utils/api';

interface MenuItem {
  id: string | number;
  name: string;
  category: string;
  price: number | string;
  cost: number | string;
  status: string;
  sales?: number;
  image?: string;
}

export function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [hotItems, setHotItems] = useState<MenuItem[]>([]);
  const [icedItems, setIcedItems] = useState<MenuItem[]>([]);
  const [cakeItems, setCakeItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Hot', 'Iced', 'Cake'];

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [hotRes, icedRes, cakeRes] = await Promise.all([
        api.menus.getHot(),
        api.menus.getIced(),
        api.menus.getCake(),
      ]);

      const hot = hotRes.menus || hotRes.data || [];
      const iced = icedRes.menus || icedRes.data || [];
      const cake = cakeRes.menus || cakeRes.data || [];

      setHotItems(hot);
      setIcedItems(iced);
      setCakeItems(cake);
      setMenuItems([...hot, ...iced, ...cake]);
    } catch (err: any) {
      console.error('Failed to fetch menus:', err);
      setError('Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredItems = (category: string) => {
    let items = menuItems;
    
    if (category === 'Hot') items = hotItems;
    else if (category === 'Iced') items = icedItems;
    else if (category === 'Cake') items = cakeItems;

    return items.filter((item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredItems = getFilteredItems('All');
  const avgPrice =
    menuItems.length > 0
      ? (menuItems.reduce((sum, item) => {
          const price = typeof item.price === 'string'
            ? parseFloat(item.price.replace('฿', ''))
            : item.price;
          return sum + price;
        }, 0) / menuItems.length).toFixed(2)
      : '0';
  const topSeller = menuItems.reduce(
    (max, item) => (item.sales && item.sales > (max.sales || 0) ? item : max),
    {} as MenuItem
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-96 text-gray-500">
          Loading menu items...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800">Menu</h1>
          <p className="text-gray-500">Manage your cafe menu items</p>
        </div>
        <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4" />
          Add Menu Item
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
            <p className="text-gray-500">Total Items</p>
            <h2 className="mt-1 text-gray-900">{menuItems.length}</h2>
            <p className="text-gray-500 mt-1">Active menu items</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Categories</p>
            <h2 className="mt-1 text-gray-900">{categories.length - 1}</h2>
            <p className="text-gray-500 mt-1">Product categories</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Avg. Price</p>
            <h2 className="mt-1 text-gray-900">฿{avgPrice}</h2>
            <p className="text-emerald-600 mt-1">Good margin</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Top Seller</p>
            <h2 className="mt-1 text-gray-900">{topSeller.name || 'N/A'}</h2>
            <p className="text-gray-500 mt-1">
              {topSeller.sales ? `${topSeller.sales} sold this month` : 'No sales data'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-700">Menu Items</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search menu..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 border border-gray-200 rounded-lg p-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Grid className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="mb-6">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredItems(category).map((item) => (
                    <Card key={item.id} className="border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-2xl">
                            {item.image || '☕'}
                          </div>
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                            {item.status || 'Active'}
                          </Badge>
                        </div>
                        <h4 className="text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-gray-500 text-sm mb-3">{item.category}</p>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-gray-500 text-xs">Price</p>
                            <p className="text-gray-900">
                              {typeof item.price === 'string' ? item.price : `฿${item.price}`}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Cost</p>
                            <p className="text-gray-700">
                              {typeof item.cost === 'string' ? item.cost : `฿${item.cost}`}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Sales</p>
                            <p className="text-gray-700">{item.sales || 0}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1">
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {getFilteredItems(category).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No menu items found</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
