import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-800">Settings</h1>
        <p className="text-gray-500">Manage your cafe settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-5">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-700">Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input id="store-name" placeholder="My Cafe" defaultValue="Bakery & Cafe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-phone">Phone Number</Label>
                  <Input id="store-phone" placeholder="081-234-5678" defaultValue="081-234-5678" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-address">Address</Label>
                <Input id="store-address" placeholder="123 Main Street..." defaultValue="123 Sukhumvit Road, Bangkok" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-email">Email</Label>
                  <Input id="store-email" type="email" placeholder="contact@cafe.com" defaultValue="contact@mycafe.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-tax">Tax ID</Label>
                  <Input id="store-tax" placeholder="0123456789012" defaultValue="0123456789012" />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-amber-600 hover:bg-amber-700">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-700">Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="open-time">Opening Time</Label>
                  <Input id="open-time" type="time" defaultValue="08:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="close-time">Closing Time</Label>
                  <Input id="close-time" type="time" defaultValue="20:00" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Open on Weekends</Label>
                  <p className="text-gray-500 text-sm">Allow operations on Saturday and Sunday</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-5">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-700">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Low Stock Alerts</Label>
                  <p className="text-gray-500 text-sm">Notify when inventory is running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Order Notifications</Label>
                  <p className="text-gray-500 text-sm">Receive alerts for new orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Daily Sales Report</Label>
                  <p className="text-gray-500 text-sm">Get end-of-day sales summary via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Customer Reviews</Label>
                  <p className="text-gray-500 text-sm">Notify when customers leave reviews</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-5">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-700">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-700">💵</span>
                  </div>
                  <div>
                    <Label>Cash</Label>
                    <p className="text-gray-500 text-sm">Accept cash payments</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-700">💳</span>
                  </div>
                  <div>
                    <Label>Credit/Debit Card</Label>
                    <p className="text-gray-500 text-sm">Accept card payments</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-700">📱</span>
                  </div>
                  <div>
                    <Label>QR Code Payment</Label>
                    <p className="text-gray-500 text-sm">PromptPay, TrueMoney, etc.</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-700">Tax Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tax-rate">VAT Rate (%)</Label>
                <Input id="tax-rate" type="number" placeholder="7" defaultValue="7" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Include VAT in Prices</Label>
                  <p className="text-gray-500 text-sm">Display prices inclusive of VAT</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-5">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-700">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" />
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button className="bg-amber-600 hover:bg-amber-700">Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-700">Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable 2FA</Label>
                  <p className="text-gray-500 text-sm">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
