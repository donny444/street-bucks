import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (data?: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  // ✅ MOCK USER (แก้ role ตรงนี้ได้)
  const mockUser: User = {
    id: 1,
    email: 'admin@streetbucks.com',
    name: 'Admin User',
    role: 'ADMIN' as UserRole,
    branchId: 1,
    createdAt: new Date().toISOString(),
  };

  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const login = () => {
    // ไม่ต้องเรียก backend
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}