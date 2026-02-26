import { TopMenusPieChart } from '../TopMenusPieChart';
import { SalesByMonthChart } from '../SalesByMonthChart';
import { SalesWeekLineChart } from '../SalesWeekLineChart';
import { useBranch } from '../../contexts/BranchContext';
import { useAuth } from '../../contexts/AuthContext';

export function DashboardPage() {
  const { selectedBranch } = useBranch();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-800">Sales Dashboard</h1>
        <p className="text-gray-500">
          {selectedBranch 
            ? `Overview of Sales, Performance - ${selectedBranch.name}`
            : 'Overview of Sales, Performance (Selected Period)'}
        </p>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <TopMenusPieChart />
        <SalesByMonthChart />
        <SalesWeekLineChart />
      </div>
    </div>
  );
}