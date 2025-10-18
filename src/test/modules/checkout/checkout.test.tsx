import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import * as authContext from '../../../core/contexts/auth-context';
import * as cartContext from '../../../core/contexts/cart-context';
import * as confettiContext from '../../../core/contexts/confetti-context';
import * as useGetDataFromBackendHook from '../../../core/hooks/useGetDataFromBackend';
import { CheckoutPage } from '../../../modules/checkout/checkout';

// Mock the toaster
jest.mock('../../../core/components/ui/toaster', () => ({
  toaster: {
    create: jest.fn(),
  },
}));

// Mock cart-context to avoid requiring CartProvider
jest.mock('../../../core/contexts/cart-context', () => ({
  __esModule: true,
  ...jest.requireActual('../../../core/contexts/cart-context'),
  useCart: jest.fn(() => ({
    items: [
      {
        tempId: 'temp-1',
        eventId: 'event-1',
        eventName: 'Concierto de Rock',
        eventDate: '2024-01-15T20:00:00Z',
        eventTime: '20:00',
        culturalPlaceName: 'Teatro Principal',
        ticketType: 'VIP',
        price: 100,
        quantity: 2,
      },
    ],
    totalItems: 1,
    totalPrice: 200,
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    isInCart: jest.fn(),
    getItemQuantity: jest.fn(),
  })),
}));

// Mock confetti-context to avoid requiring ConfettiProvider
jest.mock('../../../core/contexts/confetti-context', () => ({
  __esModule: true,
  ...jest.requireActual('../../../core/contexts/confetti-context'),
  useConfetti: jest.fn(() => ({
    triggerConfetti: jest.fn(),
    showConfetti: false,
    hideConfetti: jest.fn(),
  })),
}));

// Ensure useAuth is mocked to avoid requiring AuthProvider
jest.mock('../../../core/contexts/auth-context', () => ({
  __esModule: true,
  ...jest.requireActual('../../../core/contexts/auth-context'),
  useAuth: jest.fn(() => ({
    user: {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      image: null,
    },
    isLogged: true,
    login: jest.fn(),
    logout: jest.fn(),
    role: 'user',
    isAdmin: false,
    isSupervisor: false,
    isUser: true,
  })),
}));

// Mock utility functions
jest.mock('../../../core/utils/date.utils', () => ({
  formatIsoDate: jest.fn((_date: string) => '15 de enero de 2024'),
}));

jest.mock('../../../core/utils/money.utils', () => ({
  formatMoney: jest.fn((amount: number) => `$${amount}`),
}));

// Mock react-router navigate
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

const mockUser = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user' as const,
  image: null,
};

const mockCartItems = [
  {
    tempId: 'temp-1',
    eventId: 'event-1',
    eventName: 'Concierto de Rock',
    eventDate: '2024-01-15T20:00:00Z',
    eventTime: '20:00',
    culturalPlaceName: 'Teatro Principal',
    ticketType: 'VIP',
    price: 100,
    quantity: 2,
  },
];

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider value={defaultSystem}>
    <MemoryRouter>{children}</MemoryRouter>
  </ChakraProvider>
);

describe('CheckoutPage', () => {
  const mockUseAuth = jest.spyOn(authContext, 'useAuth');
  const mockUseCart = jest.spyOn(cartContext, 'useCart');
  const mockUseConfetti = jest.spyOn(confettiContext, 'useConfetti');
  const mockUseGetDataFromBackend = jest.spyOn(
    useGetDataFromBackendHook,
    'useGetDataFromBackend'
  );

  beforeEach(() => {
    jest.clearAllMocks();
    const mockToaster = require('../../../core/components/ui/toaster').toaster;
    mockToaster.create.mockClear();
    mockNavigate.mockClear();

    // Default mocks
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isLogged: true,
      token: 'mock-token-123',
      login: jest.fn(),
      logout: jest.fn(),
      role: 'user',
      isAdmin: false,
      isSupervisor: false,
      isUser: true,
    });

    mockUseCart.mockReturnValue({
      items: mockCartItems,
      totalItems: mockCartItems.length,
      totalPrice: 200,
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      isInCart: jest.fn(),
      getItemQuantity: jest.fn(),
    });

    mockUseConfetti.mockReturnValue({
      triggerConfetti: jest.fn(),
      showConfetti: false,
      hideConfetti: jest.fn(),
    });

    mockUseGetDataFromBackend.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      callback: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('redirects to home when cart is empty and user not logged', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLogged: false,
      token: null,
      login: jest.fn(),
      logout: jest.fn(),
      role: null,
      isAdmin: false,
      isSupervisor: false,
      isUser: false,
    });

    mockUseCart.mockReturnValue({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      isInCart: jest.fn(),
      getItemQuantity: jest.fn(),
    });

    render(
      <TestWrapper>
        <CheckoutPage />
      </TestWrapper>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('redirects to mis-tickets when cart is empty and user logged in', () => {
    mockUseCart.mockReturnValue({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      isInCart: jest.fn(),
      getItemQuantity: jest.fn(),
    });

    render(
      <TestWrapper>
        <CheckoutPage />
      </TestWrapper>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/mis-tickets');
  });

  it('handles continue shopping button click', () => {
    render(
      <TestWrapper>
        <CheckoutPage />
      </TestWrapper>
    );

    const continueButton = screen.getByRole('button', {
      name: /← Continuar Comprando/i,
    });
    fireEvent.click(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('updates payment data correctly', () => {
    render(
      <TestWrapper>
        <CheckoutPage />
      </TestWrapper>
    );

    // Test card number formatting
    const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
    fireEvent.change(cardInput, { target: { value: '1234567890123456' } });

    // Verify the formatted value is displayed
    expect(cardInput).toHaveValue('1234 5678 9012 3456');

    // Test other fields
    const nameInput = screen.getByPlaceholderText('Como aparece en la tarjeta');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput).toHaveValue('John Doe');

    const cvvInput = screen.getByPlaceholderText('123');
    fireEvent.change(cvvInput, { target: { value: '456' } });
    expect(cvvInput).toHaveValue('456');
  });

  it('prevents purchase when user ID is missing', () => {
    mockUseAuth.mockReturnValue({
      user: { ...mockUser, id: undefined as any },
      isLogged: true,
      token: 'mock-token-123',
      login: jest.fn(),
      logout: jest.fn(),
      role: 'user',
      isAdmin: false,
      isSupervisor: false,
      isUser: true,
    });

    render(
      <TestWrapper>
        <CheckoutPage />
      </TestWrapper>
    );

    const mockToaster = require('../../../core/components/ui/toaster').toaster;
    expect(mockToaster.create).toHaveBeenCalledWith({
      title: 'Autenticación requerida',
      description: 'Debes iniciar sesión para realizar una compra',
      type: 'warning',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
