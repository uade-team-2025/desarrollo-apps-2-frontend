import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { OrderSummary } from '../../../../modules/checkout/components/order-summary';
import type { CartItem } from '../../../../core/contexts/cart-context';

// Mock utility functions
jest.mock('../../../../core/utils/money.utils', () => ({
  formatMoney: jest.fn((amount: number) => `$${amount}`),
}));

const mockItems: CartItem[] = [
  {
    tempId: 'temp-1',
    eventId: 'event-1',
    eventName: 'Event 1',
    eventDate: '2024-01-15T20:00:00Z',
    eventTime: '20:00',
    culturalPlaceName: 'Venue 1',
    ticketType: 'VIP',
    price: 100,
    quantity: 2,
  },
  {
    tempId: 'temp-2',
    eventId: 'event-2',
    eventName: 'Event 2',
    eventDate: '2024-01-16T19:00:00Z',
    eventTime: '19:00',
    culturalPlaceName: 'Venue 2',
    ticketType: 'Standard',
    price: 50,
    quantity: 1,
  },
];

const defaultProps = {
  items: mockItems,
  totalPrice: 250,
  loading: false,
  onConfirmPurchase: jest.fn(),
  onContinueShopping: jest.fn(),
  isPaymentValid: true,
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

describe('OrderSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders subtotal with correct item count (plural)', () => {
    render(
      <TestWrapper>
        <OrderSummary {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Subtotal (2 entradas)')).toBeInTheDocument();
    expect(screen.getAllByText('$250')).toHaveLength(2);
  });

  it('renders subtotal with correct item count (singular)', () => {
    const singleItemProps = {
      ...defaultProps,
      items: [mockItems[0]],
      totalPrice: 200,
    };

    render(
      <TestWrapper>
        <OrderSummary {...singleItemProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Subtotal (1 entrada)')).toBeInTheDocument();
  });

  it('shows free service charges', () => {
    render(
      <TestWrapper>
        <OrderSummary {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Cargos por servicio')).toBeInTheDocument();
    expect(screen.getByText('¡Gratis!')).toBeInTheDocument();
  });

  it('displays total amount to pay', () => {
    render(
      <TestWrapper>
        <OrderSummary {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Total a pagar')).toBeInTheDocument();
    expect(screen.getAllByText('$250')).toHaveLength(2); // Subtotal + Total
  });

  it('renders confirm purchase button when payment is valid', () => {
    render(
      <TestWrapper>
        <OrderSummary {...defaultProps} />
      </TestWrapper>
    );

    const confirmButton = screen.getByRole('button', {
      name: /✨ Confirmar Compra/i,
    });
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).not.toBeDisabled();
  });

  it('renders disabled confirm button when payment is invalid', () => {
    const invalidPaymentProps = {
      ...defaultProps,
      isPaymentValid: false,
    };

    render(
      <TestWrapper>
        <OrderSummary {...invalidPaymentProps} />
      </TestWrapper>
    );

    const confirmButton = screen.getByRole('button', {
      name: /Complete los datos de pago/i,
    });
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
  });

  it('shows loading state on confirm button when loading', () => {
    const loadingProps = {
      ...defaultProps,
      loading: true,
    };

    render(
      <TestWrapper>
        <OrderSummary {...loadingProps} />
      </TestWrapper>
    );

    const confirmButton = screen.getByRole('button', {
      name: /Procesando compra.../i,
    });
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
  });

  it('renders continue shopping button', () => {
    render(
      <TestWrapper>
        <OrderSummary {...defaultProps} />
      </TestWrapper>
    );

    const continueButton = screen.getByRole('button', {
      name: /← Continuar Comprando/i,
    });
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).not.toBeDisabled();
  });

  it('disables continue shopping button when loading', () => {
    const loadingProps = {
      ...defaultProps,
      loading: true,
    };

    render(
      <TestWrapper>
        <OrderSummary {...loadingProps} />
      </TestWrapper>
    );

    const continueButton = screen.getByRole('button', {
      name: /← Continuar Comprando/i,
    });
    expect(continueButton).toBeDisabled();
  });

  it('calls onConfirmPurchase when confirm button is clicked', () => {
    const onConfirmPurchase = jest.fn();
    const props = {
      ...defaultProps,
      onConfirmPurchase,
    };

    render(
      <TestWrapper>
        <OrderSummary {...props} />
      </TestWrapper>
    );

    const confirmButton = screen.getByRole('button', {
      name: /✨ Confirmar Compra/i,
    });
    fireEvent.click(confirmButton);

    expect(onConfirmPurchase).toHaveBeenCalledTimes(1);
  });

  it('calls onContinueShopping when continue button is clicked', () => {
    const onContinueShopping = jest.fn();
    const props = {
      ...defaultProps,
      onContinueShopping,
    };

    render(
      <TestWrapper>
        <OrderSummary {...props} />
      </TestWrapper>
    );

    const continueButton = screen.getByRole('button', {
      name: /← Continuar Comprando/i,
    });
    fireEvent.click(continueButton);

    expect(onContinueShopping).toHaveBeenCalledTimes(1);
  });

  it('does not call onConfirmPurchase when button is disabled', () => {
    const onConfirmPurchase = jest.fn();
    const props = {
      ...defaultProps,
      onConfirmPurchase,
      isPaymentValid: false,
    };

    render(
      <TestWrapper>
        <OrderSummary {...props} />
      </TestWrapper>
    );

    const confirmButton = screen.getByRole('button', {
      name: /Complete los datos de pago/i,
    });
    fireEvent.click(confirmButton);

    expect(onConfirmPurchase).not.toHaveBeenCalled();
  });

  it('handles zero total price', () => {
    const freeProps = {
      ...defaultProps,
      totalPrice: 0,
    };

    render(
      <TestWrapper>
        <OrderSummary {...freeProps} />
      </TestWrapper>
    );

    expect(screen.getAllByText('$0')).toHaveLength(2); // Subtotal + Total
  });

  it('handles large total prices', () => {
    const expensiveProps = {
      ...defaultProps,
      totalPrice: 99999,
    };

    render(
      <TestWrapper>
        <OrderSummary {...expensiveProps} />
      </TestWrapper>
    );

    expect(screen.getAllByText('$99999')).toHaveLength(2); // Subtotal + Total
  });

  it('handles empty items array', () => {
    const emptyProps = {
      ...defaultProps,
      items: [],
      totalPrice: 0,
    };

    render(
      <TestWrapper>
        <OrderSummary {...emptyProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Subtotal (0 entradas)')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    expect(() => {
      render(
        <TestWrapper>
          <OrderSummary {...defaultProps} />
        </TestWrapper>
      );
    }).not.toThrow();
  });

  it('displays all main sections', () => {
    const { container } = render(
      <TestWrapper>
        <OrderSummary {...defaultProps} />
      </TestWrapper>
    );

    // Verify main content structure exists
    expect(container.firstChild).toBeTruthy();

    // Check for all key sections
    expect(screen.getByText('Subtotal (2 entradas)')).toBeInTheDocument();
    expect(screen.getByText('Cargos por servicio')).toBeInTheDocument();
    expect(screen.getByText('¡Gratis!')).toBeInTheDocument();
    expect(screen.getByText('Total a pagar')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /✨ Confirmar Compra/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /← Continuar Comprando/i })
    ).toBeInTheDocument();
  });

  it('has different button states based on loading and validity', () => {
    const { rerender } = render(
      <TestWrapper>
        <OrderSummary {...defaultProps} loading={false} isPaymentValid={true} />
      </TestWrapper>
    );

    expect(screen.getByText('✨ Confirmar Compra')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <OrderSummary {...defaultProps} loading={true} isPaymentValid={true} />
      </TestWrapper>
    );

    expect(screen.getByText('Procesando compra...')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <OrderSummary
          {...defaultProps}
          loading={false}
          isPaymentValid={false}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Complete los datos de pago')).toBeInTheDocument();
  });
});
