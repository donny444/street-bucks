import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { mockBranches, mockSalesData, mockEmployees } from '../data/mockData';
import { Building2, TrendingUp, Users, ShoppingCart, MapPin, Phone } from 'lucide-react';

export const BranchPage: React.FC = () => {
  // Calculate statistics for each branch
  const branchStats = mockBranches.map((branch) => {
    const branchSales = mockSalesData
      .filter((s) => s.branchId === branch.id)
      .reduce((sum, s) => sum + s.amount, 0);

    const branchOrders = mockSalesData  
      .filter((s) => s.branchId === branch.id)
      .reduce((sum, s) => sum + s.orders, 0);

    const branchEmployees = mockEmployees.filter((e) => e.branchId === branch.id).length;

    return {
      ...branch,
      totalSales: branchSales,
      totalOrders: branchOrders,
      employeeCount: branchEmployees,
    };
  });

  const totalSales = branchStats.reduce((sum, b) => sum + b.totalSales, 0);
  const totalOrders = branchStats.reduce((sum, b) => sum + b.totalOrders, 0);
  const totalEmployees = branchStats.reduce((sum, b) => sum + b.employeeCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">จัดการสาขา</h1>
        <p className="text-gray-600">ภาพรวมและจัดการสาขาทั้งหมด</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">สาขาทั้งหมด</p>
                <p className="text-gray-900 text-2xl">{mockBranches.length}</p>
              </div>
              <Building2 className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">ยอดขายรวม</p>
                <p className="text-gray-900 text-xl">฿{totalSales.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">ออเดอร์รวม</p>
                <p className="text-gray-900 text-2xl">{totalOrders}</p>
              </div>
              <ShoppingCart className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">พนักงานรวม</p>
                <p className="text-gray-900 text-2xl">{totalEmployees}</p>
              </div>
              <Users className="w-10 h-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {branchStats.map((branch) => (
          <Card key={branch.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white mb-2">{branch.name}</CardTitle>
                  <Badge
                    variant={branch.status === 'active' ? 'default' : 'secondary'}
                    className="bg-white/20 text-white border-white/30"
                  >
                    {branch.status === 'active' ? 'เปิดให้บริการ' : 'ปิดให้บริการ'}
                  </Badge>
                </div>
                <Building2 className="w-8 h-8 text-white/80" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Location Info */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-600 text-sm">ที่อยู่</p>
                    <p className="text-gray-900">{branch.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-600 text-sm">เบอร์โทร</p>
                    <p className="text-gray-900">{branch.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-600 text-sm">ผู้จัดการสาขา</p>
                    <p className="text-gray-900">{branch.managerName}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-gray-600 text-xs mb-1">ยอดขาย</p>
                  <p className="text-emerald-600">
                    ฿{(branch.totalSales / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-xs mb-1">ออเดอร์</p>
                  <p className="text-blue-600">{branch.totalOrders}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-xs mb-1">พนักงาน</p>
                  <p className="text-orange-600">{branch.employeeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">รายละเอียดสาขาทั้งหมด</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อสาขา</TableHead>
                <TableHead>ที่อยู่</TableHead>
                <TableHead>ผู้จัดการ</TableHead>
                <TableHead>เบอร์โทร</TableHead>
                <TableHead>ยอดขาย</TableHead>
                <TableHead>ออเดอร์</TableHead>
                <TableHead>พนักงาน</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branchStats.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="text-gray-900">{branch.name}</TableCell>
                  <TableCell className="text-gray-600 max-w-xs truncate">
                    {branch.location}
                  </TableCell>
                  <TableCell className="text-gray-600">{branch.managerName}</TableCell>
                  <TableCell className="text-gray-600">{branch.phone}</TableCell>
                  <TableCell className="text-emerald-600">
                    ฿{branch.totalSales.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-blue-600">{branch.totalOrders}</TableCell>
                  <TableCell className="text-orange-600">{branch.employeeCount}</TableCell>
                  <TableCell>
                    <Badge variant={branch.status === 'active' ? 'default' : 'secondary'}>
                      {branch.status === 'active' ? 'เปิดบริการ' : 'ปิดบริการ'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};