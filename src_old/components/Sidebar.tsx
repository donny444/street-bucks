import {
  Home,
  ShoppingCart,
  Package,
  BookOpen,
  Users,
  Settings,
  ChefHat,
  CreditCard,
  FileText,
  Receipt,
  LogOut,
  Clock,
  Building2,
  Info
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useBranch } from '../contexts/BranchContext';
import { UserRole } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  roles: UserRole[];
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { user, logout, hasRole } = useAuth();
  const { selectedBranch, availableBranches, selectBranch } = useBranch();

  if (!user) return null;

  const normalizedRole = user.role?.toLowerCase() as UserRole;

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'manager', 'staff'] },
    { id: 'pos', label: 'POS', icon: CreditCard, roles: ['admin', 'manager', 'staff'] },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, roles: ['admin', 'manager', 'staff'] },
    { id: 'attendance', label: 'Attendance', icon: Clock, roles: ['admin', 'manager', 'staff'] },
    { id: 'inventory', label: 'Inventory', icon: Package, roles: ['admin', 'manager'] },
    { id: 'menu', label: 'Menu', icon: BookOpen, roles: ['admin', 'manager'] },
    { id: 'recipes', label: 'Recipes', icon: ChefHat, roles: ['admin', 'manager'] },
    { id: 'customers', label: 'Customers', icon: Users, roles: ['admin', 'manager'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['admin', 'manager'] },
    { id: 'expenses', label: 'Expenses', icon: Receipt, roles: ['admin', 'manager'] },
    { id: 'system-info', label: 'System Info', icon: Info, roles: ['admin', 'manager', 'staff'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'manager', 'staff'] },
  ];

  // ✅ แก้ให้รองรับ role ตัวเล็ก/ใหญ่
  const visibleMenuItems = menuItems.filter(item =>
    item.roles.includes(normalizedRole)
  );

  const getRoleLabel = (role: UserRole) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Branch Manager';
      case 'staff':
        return 'Staff';
      default:
        return role;
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">☕</span>
        </div>
        <div>
          <h3 className="text-gray-900 font-semibold">Cafe POS</h3>
          <p className="text-gray-500 text-xs">Management System</p>
        </div>
      </div>

      {/* Branch Selector (Admin Only) */}
      {normalizedRole === 'admin' && availableBranches?.length > 1 && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-amber-700" />
            <p className="text-amber-900 text-sm font-medium">Current Branch</p>
          </div>
          <select
            value={selectedBranch?.id || ''}
            onChange={(e) => selectBranch(e.target.value)}
            className="w-full p-2 text-sm border border-amber-300 rounded bg-white text-gray-900"
          >
            {availableBranches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Branch Info */}
      {normalizedRole !== 'admin' && selectedBranch && (
        <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-gray-900 text-sm">{selectedBranch.name}</p>
              <p className="text-gray-500 text-xs">{selectedBranch.code}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">
              {getUserInitials(user.name)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-gray-900 text-sm font-medium">{user.name}</p>
            <p className="text-gray-500 text-xs">
              {getRoleLabel(user.role)}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}