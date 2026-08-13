import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthLoading: boolean;
  setRole: (role: UserRole) => void;
  updateUser: (updates: Partial<User>) => void;
  loginRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Farmer, can switch anytime
  const [user, setUser] = useState<User | null>(INITIAL_USERS[0]);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  const setRole = (role: UserRole) => {
    const match = INITIAL_USERS.find((u) => u.role === role);
    if (match) {
      setUser(match);
    } else {
      setUser((prev) => (prev ? { ...prev, role } : { ...INITIAL_USERS[0], role }));
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const loginRole = (role: UserRole) => {
    setRole(role);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'farmer',
        isAuthLoading,
        setRole,
        updateUser,
        loginRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
