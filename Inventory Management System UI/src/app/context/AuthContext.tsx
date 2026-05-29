import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from '../../api/services';
import ApiClient from '../../api/client';

export type UserRole = 'admin' | 'staff' | 'manager';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore user from token on mount
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const profile = await authService.getProfile();
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role || 'staff',
            avatar: profile.avatar,
          });
        }
      } catch (err) {
        console.log('Could not restore user session');
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      ApiClient.clearAuthToken();
      localStorage.removeItem('auth_token');
    }
  };

  const setRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    setRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
