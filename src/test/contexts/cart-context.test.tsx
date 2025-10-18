import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider } from '../../core/contexts/auth-context';
import {
  CartProvider,
  useCart,
  type CartItem,
} from '../../core/contexts/cart-context';

// Mock useLocalStorage
jest.mock('../../core/hooks/useLocalStorage', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    value: [],
    setValue: jest.fn(),
    removeValue: jest.fn(),
    error: null,
  })),
}));

// Mock toaster directly
const mockToasterCreate = jest.fn();
jest.mock('../../core/components/ui/toaster', () => ({
  toaster: {
    create: mockToasterCreate,
  },
  Toaster: () => null,
}));

// Mock useAuth
jest.mock('../../core/contexts/auth-context', () => ({
  ...jest.requireActual('../../core/contexts/auth-context'),
  useAuth: jest.fn(),
}));

import { useAuth } from '../../core/contexts/auth-context';
import useLocalStorage from '../../core/hooks/useLocalStorage';

const mockUseLocalStorage = useLocalStorage as jest.MockedFunction<
  typeof useLocalStorage
>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockCartItem: Omit<CartItem, 'tempId' | 'quantity'> = {
  eventId: 'event-1',
  eventName: 'Test Event',
  eventDate: '2024-01-15',
  eventTime: '19:00',
  culturalPlaceName: 'Test Venue',
  ticketType: 'General',
  price: 50,
};

const TestComponent = () => {
  const cart = useCart();

  return (
    <div>
      <div data-testid="totalItems">{cart.totalItems}</div>
      <div data-testid="totalPrice">{cart.totalPrice}</div>
      <div data-testid="itemsCount">{cart.items.length}</div>
      <div data-testid="isInCart">
        {cart.isInCart('event-1', 'General').toString()}
      </div>
      <div data-testid="itemQuantity">
        {cart.getItemQuantity('event-1', 'General')}
      </div>
      <button onClick={() => cart.addToCart(mockCartItem)}>Add to Cart</button>
      <button onClick={() => cart.removeFromCart('temp-id-1')}>Remove</button>
      <button onClick={() => cart.updateQuantity('temp-id-1', 5)}>
        Update Quantity
      </button>
      <button onClick={() => cart.clearCart()}>Clear Cart</button>
    </div>
  );
};

const Wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <CartProvider>{children}</CartProvider>
  </AuthProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mocks after clearAllMocks
    mockUseLocalStorage.mockReturnValue({
      value: [],
      setValue: jest.fn(),
      removeValue: jest.fn(),
      error: null,
    });
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      },
      isLogged: true,
      token: 'mock-token-123',
      role: 'user',
      isAdmin: false,
      isSupervisor: false,
      isUser: true,
      login: jest.fn(),
      logout: jest.fn(),
    });

    // Clear the mock calls
    mockToasterCreate.mockClear();
  });

  describe('initialization', () => {
    it('should initialize with empty cart', () => {
      render(<TestComponent />, { wrapper: Wrapper });

      expect(screen.getByTestId('totalItems')).toHaveTextContent('0');
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('0');
      expect(screen.getByTestId('itemsCount')).toHaveTextContent('0');
    });

    it('should initialize with stored items for logged user', () => {
      const storedItems: CartItem[] = [
        {
          ...mockCartItem,
          tempId: 'temp-1',
          quantity: 2,
        },
      ];

      mockUseLocalStorage.mockReturnValue({
        value: storedItems,
        setValue: jest.fn(),
        removeValue: jest.fn(),
        error: null,
      });

      render(<TestComponent />, { wrapper: Wrapper });

      expect(screen.getByTestId('totalItems')).toHaveTextContent('2');
      expect(screen.getByTestId('totalPrice')).toHaveTextContent('100');
      expect(screen.getByTestId('itemsCount')).toHaveTextContent('1');
    });

    it('should use guest cart key when user is not logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLogged: false,
        token: null,
        role: null,
        isAdmin: false,
        isSupervisor: false,
        isUser: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(<TestComponent />, { wrapper: Wrapper });

      expect(mockUseLocalStorage).toHaveBeenCalledWith('guest_cart_items', []);
    });

    it('should use user-specific cart key when user is logged in', () => {
      render(<TestComponent />, { wrapper: Wrapper });

      expect(mockUseLocalStorage).toHaveBeenCalledWith('user-1_cart_items', []);
    });
  });

  describe('addToCart', () => {
    it('should increase quantity if item already exists', () => {
      const existingItem: CartItem = {
        ...mockCartItem,
        tempId: 'temp-1',
        quantity: 1,
      };

      const setStoredItems = jest.fn();
      mockUseLocalStorage.mockReturnValue({
        value: [existingItem],
        setValue: setStoredItems,
        removeValue: jest.fn(),
        error: null,
      });

      render(<TestComponent />, { wrapper: Wrapper });

      act(() => {
        screen.getByText('Add to Cart').click();
      });

      expect(screen.getByTestId('totalItems')).toHaveTextContent('2');
    });
  });

  describe('removeFromCart', () => {
    it('should not remove item when user is not logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLogged: false,
        token: null,
        role: null,
        isAdmin: false,
        isSupervisor: false,
        isUser: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const setStoredItems = jest.fn();
      mockUseLocalStorage.mockReturnValue({
        value: [],
        setValue: setStoredItems,
        removeValue: jest.fn(),
        error: null,
      });

      render(<TestComponent />, { wrapper: Wrapper });

      act(() => {
        screen.getByText('Remove').click();
      });

      expect(setStoredItems).not.toHaveBeenCalled();
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const setStoredItems = jest.fn();
      mockUseLocalStorage.mockReturnValue({
        value: [],
        setValue: setStoredItems,
        removeValue: jest.fn(),
        error: null,
      });

      render(<TestComponent />, { wrapper: Wrapper });

      act(() => {
        screen.getByText('Clear Cart').click();
      });

      expect(screen.getByTestId('itemsCount')).toHaveTextContent('0');
    });
  });

  describe('utility functions', () => {
    it('should check if item is in cart', () => {
      const existingItem: CartItem = {
        ...mockCartItem,
        tempId: 'temp-1',
        quantity: 1,
      };

      mockUseLocalStorage.mockReturnValue({
        value: [existingItem],
        setValue: jest.fn(),
        removeValue: jest.fn(),
        error: null,
      });

      render(<TestComponent />, { wrapper: Wrapper });

      expect(screen.getByTestId('isInCart')).toHaveTextContent('true');
    });

    it('should get item quantity', () => {
      const existingItem: CartItem = {
        ...mockCartItem,
        tempId: 'temp-1',
        quantity: 3,
      };

      mockUseLocalStorage.mockReturnValue({
        value: [existingItem],
        setValue: jest.fn(),
        removeValue: jest.fn(),
        error: null,
      });

      render(<TestComponent />, { wrapper: Wrapper });

      expect(screen.getByTestId('itemQuantity')).toHaveTextContent('3');
    });

    it('should return 0 for non-existent item quantity', () => {
      mockUseLocalStorage.mockReturnValue({
        value: [],
        setValue: jest.fn(),
        removeValue: jest.fn(),
        error: null,
      });

      render(<TestComponent />, { wrapper: Wrapper });

      expect(screen.getByTestId('itemQuantity')).toHaveTextContent('0');
    });
  });

  describe('calculations', () => {
    it('should calculate total items correctly', () => {
      const items: CartItem[] = [
        { ...mockCartItem, tempId: 'temp-1', quantity: 2 },
        { ...mockCartItem, tempId: 'temp-2', quantity: 3 },
      ];

      mockUseLocalStorage.mockReturnValue({
        value: items,
        setValue: jest.fn(),
        removeValue: jest.fn(),
        error: null,
      });

      render(<TestComponent />, { wrapper: Wrapper });

      expect(screen.getByTestId('totalItems')).toHaveTextContent('5');
    });

    it('should calculate total price correctly', () => {
      const items: CartItem[] = [
        { ...mockCartItem, tempId: 'temp-1', quantity: 2, price: 50 },
        { ...mockCartItem, tempId: 'temp-2', quantity: 1, price: 30 },
      ];

      mockUseLocalStorage.mockReturnValue({
        value: items,
        setValue: jest.fn(),
        removeValue: jest.fn(),
        error: null,
      });

      render(<TestComponent />, { wrapper: Wrapper });

      expect(screen.getByTestId('totalPrice')).toHaveTextContent('130');
    });
  });

  describe('error handling', () => {
    it('should throw error when useCart is used outside of CartProvider', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useCart must be used within a CartProvider');

      consoleSpy.mockRestore();
    });
  });
});
