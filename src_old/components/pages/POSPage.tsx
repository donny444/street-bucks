import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, X, Printer } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { useBranch } from '../../contexts/BranchContext';
import { api } from '../../utils/api';
import { MenuItem, Order, OrderItem } from '../../types';
import { Receipt } from '../Receipt';

interface CartItem extends OrderItem {
  menuItemId: string;
}

export function POSPage() {
  const { user } = useAuth();
  const { selectedBranch } = useBranch();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qr' | null>(null);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['All', 'Hot', 'Iced', 'Cake'];

  useEffect(() => {
    if (selectedBranch) {
      loadMenuItems();
    }
  }, [selectedBranch]);

  const loadMenuItems = async () => {
    try {
      const [hotRes, icedRes, cakeRes] = await Promise.all([
        api.menus.getHot(),
        api.menus.getIced(),
        api.menus.getCake(),
      ]);

      const hot = (hotRes.menus || hotRes.data || []).map((item: any) => ({
        ...item,
        isAvailable: true
      }));
      const iced = (icedRes.menus || icedRes.data || []).map((item: any) => ({
        ...item,
        isAvailable: true
      }));
      const cake = (cakeRes.menus || cakeRes.data || []).map((item: any) => ({
        ...item,
        isAvailable: true
      }));

      setMenuItems([...hot, ...iced, ...cake]);
    } catch (err: any) {
      console.error('Failed to load menu items:', err);
      setError('Failed to load menu items');
    }
  };

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.menuItemId === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.menuItemId === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1, subtotal: (cartItem.quantity + 1) * cartItem.price }
          : cartItem
      ));
    } else {
      const newItem: CartItem = {
        menuItemId: item.id,
        menuItemName: item.name,
        quantity: 1,
        price: item.price,
        subtotal: item.price
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (menuItemId: string, change: number) => {
    setCart(cart.map(item => {
      if (item.menuItemId === menuItemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity, subtotal: newQuantity * item.price };
      }
      return item;
    }));
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(cart.filter(item => item.menuItemId !== menuItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.07; // 7% VAT
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowPaymentDialog(true);
  };

  const deductInventory = () => {
    // Inventory management is now handled by the backend
    // This function is kept for reference but no longer needed for local DB
  };

  const handlePayment = async () => {
    if (!paymentMethod || !user || !selectedBranch || cart.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      // Prepare order data for backend
      const orderData = {
        branchId: selectedBranch.id,
        employeeId: user.id,
        employeeName: user.name,
        items: cart,
        subtotal,
        tax,
        discount: 0,
        total,
        paymentMethod,
        status: 'completed'
      };

      // Send order to backend
      const response = await api.orders.create(orderData);
      
      const newOrder: Order = {
        id: response.order_id || `order-${Date.now()}`,
        orderNumber: response.order_number || `${selectedBranch.code}-${Date.now()}`,
        branchId: selectedBranch.id,
        employeeId: user.id,
        employeeName: user.name,
        items: cart,
        subtotal,
        tax,
        discount: 0,
        total,
        paymentMethod,
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      // Show receipt
      setCurrentOrder(newOrder);
      setShowPaymentDialog(false);
      setShowReceiptDialog(true);

      // Reset
      setCart([]);
      setPaymentMethod(null);
      setReceivedAmount('');
    } catch (err: any) {
      console.error('Failed to create order:', err);
      setError(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const change = receivedAmount ? parseFloat(receivedAmount) - total : 0;

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMenuIcon = (category: string) => {
    switch (category) {
      case 'Hot': return '☕';
      case 'Iced': return '🥤';
      case 'Cake': return '🍰';
      default: return '🍽️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-800">Point of Sale</h1>
        <p className="text-gray-500">Process customer orders and payments</p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-5">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items - Left Side */}
        <div className="lg:col-span-2">
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-700">Menu</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search menu..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="All" className="w-full">
                <TabsList className="mb-4">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent key={category} value={category}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filteredItems
                        .filter(item => category === 'All' || item.category === category)
                        .map((item) => (
                          <button
                            key={item.id}
                            onClick={() => addToCart(item)}
                            className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-amber-500 hover:shadow-md transition-all text-left"
                          >
                            <div className="text-3xl mb-2">{getMenuIcon(item.category)}</div>
                            <h4 className="text-gray-900 text-sm mb-1">{item.name}</h4>
                            <p className="text-amber-600">฿{item.price}</p>
                          </button>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Cart - Right Side */}
        <div className="lg:col-span-1">
          <Card className="border-gray-200 sticky top-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-700">Current Order</CardTitle>
                {cart.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>No items in cart</p>
                  <p className="text-sm mt-2">Select items from menu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.menuItemId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="text-gray-900 text-sm">{item.menuItemName}</h4>
                          <p className="text-gray-600 text-xs">฿{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => updateQuantity(item.menuItemId, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-gray-900">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => updateQuantity(item.menuItemId, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 w-16 text-right">
                            ฿{item.subtotal.toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromCart(item.menuItemId)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>฿{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>VAT (7%)</span>
                      <span>฿{tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-gray-900">
                      <span>Total</span>
                      <span className="text-xl">฿{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Total Display */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">Total Amount</p>
              <h2 className="text-4xl text-gray-900">฿{total.toFixed(2)}</h2>
            </div>

            {/* Payment Methods */}
            <div>
              <p className="text-gray-700 mb-3">Select Payment Method</p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Banknote className="w-8 h-8 text-gray-600" />
                  <span className="text-sm text-gray-900">Cash</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-8 h-8 text-gray-600" />
                  <span className="text-sm text-gray-900">Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('qr')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'qr'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="w-8 h-8 text-gray-600" />
                  <span className="text-sm text-gray-900">QR Code</span>
                </button>
              </div>
            </div>

            {/* Cash Payment - Received Amount */}
            {paymentMethod === 'cash' && (
              <div className="space-y-3">
                <div>
                  <label className="text-gray-700 text-sm mb-2 block">Amount Received</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                    className="text-xl"
                  />
                </div>
                {receivedAmount && (
                  <div className="flex justify-between text-gray-900 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span>Change</span>
                    <span className="text-xl">฿{change.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!paymentMethod || (paymentMethod === 'cash' && (!receivedAmount || change < 0))}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Complete Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>

          {currentOrder && selectedBranch && (
            <Receipt
              order={currentOrder}
              branchName={selectedBranch.name}
              branchAddress={selectedBranch.address}
              branchPhone={selectedBranch.phone}
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>
              Close
            </Button>
            <Button onClick={handlePrintReceipt} className="bg-amber-600 hover:bg-amber-700">
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
