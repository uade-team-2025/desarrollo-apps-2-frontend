import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { CheckoutItem } from '../../../../modules/checkout/components/checkout-item';
import type { CartItem } from '../../../../core/contexts/cart-context';

// Mock utility functions
jest.mock('../../../../core/utils/date.utils', () => ({
  formatIsoDate: jest.fn((_date: string) => '15 de enero de 2024'),
}));

jest.mock('../../../../core/utils/money.utils', () => ({
  formatMoney: jest.fn((amount: number) => `$${amount}`),
}));

const mockCartItem: CartItem = {
  tempId: 'temp-123',
  eventId: 'event-456',
  eventName: 'Concierto de Rock',
  eventDate: '2024-01-15T20:00:00Z',
  eventTime: '20:00',
  culturalPlaceName: 'Teatro Principal',
  ticketType: 'VIP',
  price: 100,
  quantity: 2,
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

describe('CheckoutItem', () => {
  it('renders event name', () => {
    render(
      <TestWrapper>
        <CheckoutItem item={mockCartItem} />
      </TestWrapper>
    );

    expect(screen.getByText('Concierto de Rock')).toBeInTheDocument();
  });

  it('renders cultural place name', () => {
    render(
      <TestWrapper>
        <CheckoutItem item={mockCartItem} />
      </TestWrapper>
    );

    expect(screen.getByText('Teatro Principal')).toBeInTheDocument();
  });

  it('renders formatted event date', () => {
    render(
      <TestWrapper>
        <CheckoutItem item={mockCartItem} />
      </TestWrapper>
    );

    expect(screen.getByText('15 de enero de 2024')).toBeInTheDocument();
  });

  it('renders event time', () => {
    render(
      <TestWrapper>
        <CheckoutItem item={mockCartItem} />
      </TestWrapper>
    );

    expect(screen.getByText('20:00')).toBeInTheDocument();
  });

  it('renders ticket type with quantity', () => {
    render(
      <TestWrapper>
        <CheckoutItem item={mockCartItem} />
      </TestWrapper>
    );

    expect(screen.getByText('VIP x2')).toBeInTheDocument();
  });

  it('renders subtotal label', () => {
    render(
      <TestWrapper>
        <CheckoutItem item={mockCartItem} />
      </TestWrapper>
    );

    expect(screen.getByText('Subtotal')).toBeInTheDocument();
  });

  it('renders calculated subtotal price', () => {
    render(
      <TestWrapper>
        <CheckoutItem item={mockCartItem} />
      </TestWrapper>
    );

    expect(screen.getByText('$200')).toBeInTheDocument();
  });

  it('handles single quantity ticket', () => {
    const singleItem = {
      ...mockCartItem,
      quantity: 1,
    };

    render(
      <TestWrapper>
        <CheckoutItem item={singleItem} />
      </TestWrapper>
    );

    expect(screen.getByText('VIP x1')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('handles different ticket types', () => {
    const standardItem = {
      ...mockCartItem,
      ticketType: 'Standard',
    };

    render(
      <TestWrapper>
        <CheckoutItem item={standardItem} />
      </TestWrapper>
    );

    expect(screen.getByText('Standard x2')).toBeInTheDocument();
  });

  it('handles zero price tickets', () => {
    const freeItem = {
      ...mockCartItem,
      price: 0,
    };

    render(
      <TestWrapper>
        <CheckoutItem item={freeItem} />
      </TestWrapper>
    );

    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('handles large quantities', () => {
    const largeQuantityItem = {
      ...mockCartItem,
      quantity: 10,
      price: 50,
    };

    render(
      <TestWrapper>
        <CheckoutItem item={largeQuantityItem} />
      </TestWrapper>
    );

    expect(screen.getByText('VIP x10')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
  });

  it('handles long event names', () => {
    const longNameItem = {
      ...mockCartItem,
      eventName:
        'Festival Internacional de Música Clásica y Contemporánea 2024',
    };

    render(
      <TestWrapper>
        <CheckoutItem item={longNameItem} />
      </TestWrapper>
    );

    expect(
      screen.getByText(
        'Festival Internacional de Música Clásica y Contemporánea 2024'
      )
    ).toBeInTheDocument();
  });

  it('handles long cultural place names', () => {
    const longPlaceItem = {
      ...mockCartItem,
      culturalPlaceName: 'Centro Cultural Municipal de las Artes y la Cultura',
    };

    render(
      <TestWrapper>
        <CheckoutItem item={longPlaceItem} />
      </TestWrapper>
    );

    expect(
      screen.getByText('Centro Cultural Municipal de las Artes y la Cultura')
    ).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    expect(() => {
      render(
        <TestWrapper>
          <CheckoutItem item={mockCartItem} />
        </TestWrapper>
      );
    }).not.toThrow();
  });

  it('displays all main information sections', () => {
    const { container } = render(
      <TestWrapper>
        <CheckoutItem item={mockCartItem} />
      </TestWrapper>
    );

    // Verify main content structure exists
    expect(container.firstChild).toBeTruthy();

    // Check for all key elements
    expect(screen.getByText('Concierto de Rock')).toBeInTheDocument();
    expect(screen.getByText('Teatro Principal')).toBeInTheDocument();
    expect(screen.getByText('15 de enero de 2024')).toBeInTheDocument();
    expect(screen.getByText('20:00')).toBeInTheDocument();
    expect(screen.getByText('VIP x2')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
  });

  it('handles edge case with empty strings', () => {
    const edgeItem = {
      ...mockCartItem,
      eventName: '',
      culturalPlaceName: '',
      ticketType: '',
    };

    render(
      <TestWrapper>
        <CheckoutItem item={edgeItem} />
      </TestWrapper>
    );

    // Should render without crashing even with empty strings
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
  });
});
