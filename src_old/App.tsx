import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BranchProvider } from './contexts/BranchContext';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/pages/LoginPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { POSPage } from './components/pages/POSPage';
import { OrdersPage } from './components/pages/OrdersPage';
import { InventoryPage } from './components/pages/InventoryPage';
import { MenuPage } from './components/pages/MenuPage';
import { RecipesPage } from './components/pages/RecipesPage';
import { CustomersPage } from './components/pages/CustomersPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { ExpensesPage } from './components/pages/ExpensesPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { AttendancePage } from './components/pages/AttendancePage';
import { SystemInfoPage } from './components/pages/SystemInfoPage';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'pos':
        return <POSPage />;
      case 'orders':
        return <OrdersPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'menu':
        return <MenuPage />;
      case 'recipes':
        return <RecipesPage />;
      case 'customers':
        return <CustomersPage />;
      case 'reports':
        return <ReportsPage />;
      case 'expenses':
        return <ExpensesPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'system-info':
        return <SystemInfoPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BranchProvider>
        <AppContent />
      </BranchProvider>
    </AuthProvider>
  );
}
