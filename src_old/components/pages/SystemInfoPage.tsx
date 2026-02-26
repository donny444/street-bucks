import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Coffee, 
  Users, 
  Building2, 
  Lock, 
  Package, 
  Clock, 
  Receipt, 
  CheckCircle,
  ShieldCheck,
  BarChart3,
  Code2,
  Database,
  Zap,
  Star,
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react';

export function SystemInfoPage() {
  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <Coffee className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-white mb-1">Cafe Franchise POS System</h1>
              <p className="text-white/90">ระบบจัดการร้านกาแฟแฟรนไชส์แบบครบวงจร</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5" />
                <p className="text-white/90 text-sm">Branches</p>
              </div>
              <p className="text-white text-2xl">3</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5" />
                <p className="text-white/90 text-sm">User Roles</p>
              </div>
              <p className="text-white text-2xl">3</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5" />
                <p className="text-white/90 text-sm">Features</p>
              </div>
              <p className="text-white text-2xl">10+</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5" />
                <p className="text-white/90 text-sm">Status</p>
              </div>
              <p className="text-white text-2xl">Ready</p>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="features" className="gap-2">
            <Zap className="w-4 h-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="accounts" className="gap-2">
            <Users className="w-4 h-4" />
            Demo Accounts
          </TabsTrigger>
          <TabsTrigger value="technical" className="gap-2">
            <Code2 className="w-4 h-4" />
            Technical Info
          </TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features" className="mt-6 space-y-6">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Feature 1: Role-Based Access */}
            <Card className="border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-gray-800">Role-Based Access</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">👑</span>
                      </div>
                      <p className="text-red-900 text-sm">Admin</p>
                    </div>
                    <p className="text-red-700 text-xs ml-8">Full system access, view all branches</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">👨‍💼</span>
                      </div>
                      <p className="text-blue-900 text-sm">Manager</p>
                    </div>
                    <p className="text-blue-700 text-xs ml-8">Branch management, reports, inventory</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">👤</span>
                      </div>
                      <p className="text-green-900 text-sm">Staff</p>
                    </div>
                    <p className="text-green-700 text-xs ml-8">POS operations, check-in/out</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2: Multi-Branch */}
            <Card className="border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-gray-800">Multi-Branch System</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">3 Active Branches</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Centralized Data Management</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Branch-Specific Inventory</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Real-time Sync</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  {[
                    { name: 'Siam Paragon', color: 'bg-blue-500' },
                    { name: 'Central World', color: 'bg-purple-500' },
                    { name: 'EmQuartier', color: 'bg-pink-500' }
                  ].map((branch) => (
                    <div key={branch.name} className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${branch.color} rounded-full`}></div>
                      <p className="text-gray-700 text-sm">{branch.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feature 3: Inventory & Recipes */}
            <Card className="border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-gray-800">Smart Inventory</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Recipe-Based Tracking</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Auto Stock Deduction</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Low Stock Alerts</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Cost Calculation</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                  <p className="text-orange-900 text-xs">
                    <strong>Example:</strong> Selling a Latte automatically deducts 18g coffee beans and 200ml milk
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4: Attendance */}
            <Card className="border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-gray-800">Employee Attendance</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Check-In / Check-Out</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Work Hours Tracking</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Attendance History</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Branch-Based Records</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 5: Receipt System */}
            <Card className="border-amber-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-gray-800">Receipt & Orders</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Printable Receipts</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Order History Storage</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Multiple Payment Methods</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Tax Calculation (7% VAT)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 6: Analytics & Reports */}
            <Card className="border-indigo-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-gray-800">Analytics & Reports</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Sales Dashboard</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Revenue Charts</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Top Selling Items</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-gray-700 text-sm">Branch Performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-gray-800">How The System Works</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    step: 1,
                    title: 'Login with Role',
                    desc: 'Each user type sees different menu options and permissions',
                    color: 'from-purple-500 to-purple-600'
                  },
                  {
                    step: 2,
                    title: 'Select Branch',
                    desc: 'Admins can switch branches, others locked to assigned branch',
                    color: 'from-blue-500 to-blue-600'
                  },
                  {
                    step: 3,
                    title: 'Process Orders',
                    desc: 'Add items, select payment, print receipt, auto-update inventory',
                    color: 'from-green-500 to-green-600'
                  },
                  {
                    step: 4,
                    title: 'Track Attendance',
                    desc: 'Staff check-in/out daily, managers view records',
                    color: 'from-orange-500 to-orange-600'
                  },
                  {
                    step: 5,
                    title: 'Manage Inventory',
                    desc: 'View stock levels, adjust quantities, recipe tracking',
                    color: 'from-pink-500 to-pink-600'
                  },
                  {
                    step: 6,
                    title: 'View Analytics',
                    desc: 'Dashboard shows sales trends and performance metrics',
                    color: 'from-indigo-500 to-indigo-600'
                  }
                ].map((item) => (
                  <div key={item.step} className="relative group">
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                      <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        {item.step}
                      </div>
                      <p className="text-gray-900 mb-1">{item.title}</p>
                      <p className="text-gray-600 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demo Accounts Tab */}
        <TabsContent value="accounts" className="mt-6">
          <Card className="border-2 border-blue-300 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-blue-900">Demo Accounts - Ready to Use</CardTitle>
              </div>
              <p className="text-blue-700 text-sm mt-2">ใช้บัญชีเหล่านี้เพื่อทดสอบระบบตามระดับสิทธิ์ที่แตกต่างกัน</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Admin Account */}
                <div className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative p-5 bg-white rounded-xl border-2 border-red-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-gradient-to-r from-red-600 to-red-700">Admin</Badge>
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                          admin@cafe.com
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Password</p>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                          admin123
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600">
                        Full system access, can view all branches and manage everything
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manager Account */}
                <div className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative p-5 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-gradient-to-r from-blue-600 to-blue-700">Manager</Badge>
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                          manager.spg@cafe.com
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Password</p>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                          manager123
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600">
                        Can manage Siam Paragon branch only
                      </p>
                    </div>
                  </div>
                </div>

                {/* Staff Account */}
                <div className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative p-5 bg-white rounded-xl border-2 border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-gradient-to-r from-green-600 to-green-700">Staff</Badge>
                      <Coffee className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                          staff.spg@cafe.com
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Password</p>
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                          staff123
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600">
                        Can use POS and check attendance only
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 mb-1">ทดสอบระบบได้ทันที</p>
                    <p className="text-xs text-gray-600">
                      คัดลอกข้อมูลบัญชีข้างต้นแล้วเข้าสู่ระบบเพื่อทดสอบฟีเจอร์ต่างๆ ตามสิทธิ์การเข้าถึง
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Info Tab */}
        <TabsContent value="technical" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Frontend Technologies */}
            <Card className="border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-gray-800">Frontend Technologies</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'React + TypeScript', desc: 'Modern UI framework with type safety' },
                    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework' },
                    { name: 'Recharts', desc: 'Data visualization library' },
                    { name: 'Shadcn/ui', desc: 'Beautiful component library' },
                    { name: 'Lucide React', desc: 'Icon library' }
                  ].map((tech, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg hover:from-blue-100 transition-colors duration-300">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="text-gray-900 text-sm">{tech.name}</p>
                        <p className="text-gray-600 text-xs">{tech.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="border-2 border-green-200 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-gray-800">Data Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'LocalStorage', desc: 'Browser-based data persistence' },
                    { name: 'Context API', desc: 'React state management' },
                    { name: 'TypeScript Interfaces', desc: 'Type-safe data structures' },
                    { name: 'Mock Database', desc: 'Simulated centralized system' }
                  ].map((tech, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-transparent rounded-lg hover:from-green-100 transition-colors duration-300">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="text-gray-900 text-sm">{tech.name}</p>
                        <p className="text-gray-600 text-xs">{tech.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Architecture */}
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-gray-800">System Architecture</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-gray-900 mb-2">Authentication</h4>
                  <p className="text-xs text-gray-600">
                    Role-based access control with AuthContext managing user sessions and permissions
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-gray-900 mb-2">Multi-Branch</h4>
                  <p className="text-xs text-gray-600">
                    BranchContext handles branch selection and data filtering for multi-location support
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                    <Database className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-gray-900 mb-2">Data Layer</h4>
                  <p className="text-xs text-gray-600">
                    LocalStorage simulates centralized database with utility functions for CRUD operations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}