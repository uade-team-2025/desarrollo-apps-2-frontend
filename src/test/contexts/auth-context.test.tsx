import { act, render, screen } from '@testing-library/react';
import {
  AuthProvider,
  useAuth,
  UserRole,
} from '../../core/contexts/auth-context';

// Mock useLocalStorage
jest.mock('../../core/hooks/useLocalStorage', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    value: null,
    setValue: jest.fn(),
    removeValue: jest.fn(),
    error: null,
  })),
}));

import useLocalStorage from '../../core/hooks/useLocalStorage';

const mockUseLocalStorage = useLocalStorage as jest.MockedFunction<
  typeof useLocalStorage
>;

const TestComponent = () => {
  const auth = useAuth();

  return (
    <div>
      <div data-testid="isLogged">{auth.isLogged.toString()}</div>
      <div data-testid="role">{auth.role || 'null'}</div>
      <div data-testid="isAdmin">{auth.isAdmin.toString()}</div>
      <div data-testid="isSupervisor">{auth.isSupervisor.toString()}</div>
      <div data-testid="isUser">{auth.isUser.toString()}</div>
      <div data-testid="userName">{auth.user?.name || 'null'}</div>
      <button
        onClick={() =>
          auth.login(
            {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              role: UserRole.USER,
            },
            'test-token-123'
          )
        }
      >
        Login
      </button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
};

const Wrapper = ({ children }: { children: any }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalStorage.mockReturnValue({
      value: null,
      setValue: jest.fn(),
      removeValue: jest.fn(),
      error: null,
    });
  });

  describe('initialization', () => {
    it('should initialize with stored values when localStorage has data', () => {
      const storedUser = {
        id: '1',
        name: 'Stored User',
        email: 'stored@example.com',
        role: UserRole.ADMIN,
      };

      mockUseLocalStorage.mockImplementation((key) => {
        if (key === 'auth_user') {
          return {
            value: storedUser,
            setValue: jest.fn(),
            removeValue: jest.fn(),
            error: null,
          };
        }
        if (key === 'auth_isLogged') {
          return {
            value: true,
            setValue: jest.fn(),
            removeValue: jest.fn(),
            error: null,
          };
        }
        return {
          value: null,
          setValue: jest.fn(),
          removeValue: jest.fn(),
          error: null,
        };
      });

      render(<TestComponent />, { wrapper: Wrapper });

      expect(screen.getByTestId('isLogged')).toHaveTextContent('true');
      expect(screen.getByTestId('role')).toHaveTextContent('admin');
      expect(screen.getByTestId('isAdmin')).toHaveTextContent('true');
      expect(screen.getByTestId('isSupervisor')).toHaveTextContent('false');
      expect(screen.getByTestId('isUser')).toHaveTextContent('false');
      expect(screen.getByTestId('userName')).toHaveTextContent('Stored User');
    });
  });

  describe('login', () => {
    it('should login user and update state', () => {
      const setStoredUser = jest.fn();
      const setStoredIsLogged = jest.fn();

      mockUseLocalStorage.mockImplementation((key) => {
        if (key === 'auth_user') {
          return {
            value: null,
            setValue: setStoredUser,
            removeValue: jest.fn(),
            error: null,
          };
        }
        if (key === 'auth_isLogged') {
          return {
            value: false,
            setValue: setStoredIsLogged,
            removeValue: jest.fn(),
            error: null,
          };
        }
        return {
          value: null,
          setValue: jest.fn(),
          removeValue: jest.fn(),
          error: null,
        };
      });

      render(<TestComponent />, { wrapper: Wrapper });

      act(() => {
        screen.getByText('Login').click();
      });

      expect(screen.getByTestId('isLogged')).toHaveTextContent('true');
      expect(screen.getByTestId('role')).toHaveTextContent('user');
      expect(screen.getByTestId('isUser')).toHaveTextContent('true');
      expect(screen.getByTestId('userName')).toHaveTextContent('Test User');
      expect(setStoredUser).toHaveBeenCalledWith({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.USER,
      });
      expect(setStoredIsLogged).toHaveBeenCalledWith(true);
    });
  });

  describe('logout', () => {
    it('should logout user and clear state', () => {
      const removeStoredUser = jest.fn();
      const setStoredIsLogged = jest.fn();

      mockUseLocalStorage.mockImplementation((key) => {
        if (key === 'auth_user') {
          return {
            value: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              role: UserRole.USER,
            },
            setValue: jest.fn(),
            removeValue: removeStoredUser,
            error: null,
          };
        }
        if (key === 'auth_isLogged') {
          return {
            value: true,
            setValue: setStoredIsLogged,
            removeValue: jest.fn(),
            error: null,
          };
        }
        return {
          value: null,
          setValue: jest.fn(),
          removeValue: jest.fn(),
          error: null,
        };
      });

      render(<TestComponent />, { wrapper: Wrapper });

      act(() => {
        screen.getByText('Logout').click();
      });

      expect(screen.getByTestId('isLogged')).toHaveTextContent('false');
      expect(screen.getByTestId('role')).toHaveTextContent('null');
      expect(screen.getByTestId('userName')).toHaveTextContent('null');
      expect(removeStoredUser).toHaveBeenCalled();
      expect(setStoredIsLogged).toHaveBeenCalledWith(false);
    });
  });
});
