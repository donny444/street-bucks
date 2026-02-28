import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Branch } from '../types';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

interface BranchContextType {
  selectedBranch: Branch | null;
  availableBranches: Branch[];
  selectBranch: (branchId: string) => void;
  canAccessBranch: (branchId: string) => boolean;
  isLoading: boolean;
  error: string | null;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBranches();
    } else {
      setAvailableBranches([]);
      setSelectedBranch(null);
    }
  }, [user]);

  const fetchBranches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.branches.getAll();
      const branches = response.branches || response.data || [];

      // Admin can see all branches
      if (user?.role === 'admin') {
        setAvailableBranches(branches);
        // Default to first branch for admin
        if (branches.length > 0) {
          setSelectedBranch(branches[0]);
        }
      } else if (user?.branchId) {
        // Staff and manager can only see their own branch
        const userBranch = branches.find((b: Branch) => b.id === user.branchId);
        if (userBranch) {
          setAvailableBranches([userBranch]);
          setSelectedBranch(userBranch);
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch branches';
      setError(errorMessage);
      console.error('Failed to fetch branches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectBranch = (branchId: string) => {
    const branch = availableBranches.find(b => b.id === branchId);
    if (branch && canAccessBranch(branchId)) {
      setSelectedBranch(branch);
    }
  };

  const canAccessBranch = (branchId: string): boolean => {
    if (!user) return false;
    
    // Admin can access all branches
    if (user.role === 'admin') return true;
    
    // Staff and manager can only access their assigned branch
    return user.branchId === branchId;
  };

  return (
    <BranchContext.Provider value={{
      selectedBranch,
      availableBranches,
      selectBranch,
      canAccessBranch,
      isLoading,
      error
    }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within BranchProvider');
  }
  return context;
}
