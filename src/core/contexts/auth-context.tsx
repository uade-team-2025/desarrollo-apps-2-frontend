import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import useLocalStorage from '../../core/hooks/useLocalStorage';
import type { User } from '../login/login.api';

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  SUPERVISOR: 'supervisor',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

interface AuthContextType {
  isLogged: boolean;
  user: User | null;
  token: string | null;
  role: UserRoleType | null;
  isAdmin: boolean;
  isSupervisor: boolean;
  isUser: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    value: storedUser,
    setValue: setStoredUser,
    removeValue: removeStoredUser,
  } = useLocalStorage<User | null>('auth_user', null);
  const { value: storedIsLogged, setValue: setStoredIsLogged } =
    useLocalStorage<boolean>('auth_isLogged', false);
  const { value: storedToken, setValue: setStoredToken } = useLocalStorage<
    string | null
  >('auth_token', '');

  const [user, setUser] = useState<User | null>(storedUser);
  const [isLogged, setIsLogged] = useState<boolean>(storedIsLogged);
  const [token, setToken] = useState<string | null>(storedToken || null);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setIsLogged(true);
    setStoredUser(userData);
    setStoredIsLogged(true);
    setToken(token);
    setStoredToken(token);
  };

  const logout = () => {
    setUser(null);
    setIsLogged(false);
    setToken(null);
    removeStoredUser();
    setStoredIsLogged(false);
    setStoredToken(null);
  };

  const value: AuthContextType = {
    isLogged,
    user,
    token,
    role: user?.role || null,
    isAdmin: user?.role === UserRole.ADMIN,
    isSupervisor: user?.role === UserRole.SUPERVISOR,
    isUser: user?.role === UserRole.USER,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
