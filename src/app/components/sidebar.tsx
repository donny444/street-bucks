'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Nav, Row, Col } from 'react-bootstrap';
import { 
  LayoutDashboard, 
  Coffee, 
  Package, 
  ShoppingCart, 
  Users,
  Menu as MenuIcon
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}
function NavItem({ to, icon, label, collapsed }: NavItemProps): JSX.Element {
  const location = usePathname();
  const isActive = location.startsWith(to);
  
  return (
    <Nav.Item className="mb-1">
      <Link
        href={to}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-sidebar-accent text-sidebar-primary' 
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
          }
          ${collapsed ? 'justify-center' : ''}
        `}
      >
        {icon}
        {!collapsed && <span className="font-body text-lg">{label}</span>}
      </Link>
    </Nav.Item>
  );
};

export default function Sidebar(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: '/insights', icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
    { to: '/menus', icon: <Coffee size={22} />, label: 'Menus' },
    { to: '/orders', icon: <ShoppingCart size={22} />, label: 'Orders' },
    { to: '/stocks', icon: <Package size={22} />, label: 'Stocks' },
    { to: '/users', icon: <Users size={22} />, label: 'Users' },
  ];

  return (
    <Col
      xs={collapsed ? 1 : 3}
      className={`
        bg-sidebar h-screen fixed left-0 top-0 z-50 transition-all duration-300
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <Row>
          {!collapsed && (
            <h2 className="font-heading text-xl text-sidebar-foreground">
              ☕ CafeBucks
            </h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          >
            <MenuIcon size={20} />
          </button>
        </Row>
      </div>

      {/* Navigation */}
      <Nav className="flex-column p-3">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
      </Nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
        {!collapsed && (
          <p className="text-sidebar-foreground/60 text-sm text-center">
            v0.1.0
          </p>
        )}
      </div>
    </Col>
  );
};
