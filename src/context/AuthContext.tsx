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
  // Default to null on fresh visits so Intro and Role Selection display first
  const [user, setUser] = useState<User | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('agro_user_role');
        if (saved) {
          const match = INITIAL_USERS.find((u) => u.role === saved);
          if (match) return match;
        }
      }
    } catch (e) {
      // localStorage may fail in restricted sandboxes
    }
    return null;
  });
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  const setRole = (role: UserRole) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('agro_user_role', role);
      }
    } catch (e) {}
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
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('agro_user_role');
      }
    } catch (e) {}
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
