import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ValidTicketState } from '../../../../modules/ticket/components/ValidTicketState';
import type { TicketData } from '../../../../modules/ticket/ticket.api';

const mockTicketData: TicketData = {
  _id: 'ticket-123',
  eventId: 'event-456',
  userId: 'user-789',
  ticketType: 'VIP',
  price: 150,
  status: 'used',
  isActive: false,
  qrCode: 'QR123456789',
  validationURL: 'https://example.com/validate/ticket-123',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T11:30:00Z',
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

describe('ValidTicketState', () => {
  it('renders valid ticket state with correct title and badge', () => {
    render(
      <TestWrapper>
        <ValidTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('¡Ticket Validado!')).toBeInTheDocument();
    expect(screen.getByText('✅ ACCESO PERMITIDO')).toBeInTheDocument();
  });

  it('displays ticket type correctly', () => {
    render(
      <TestWrapper>
        <ValidTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('Tipo:')).toBeInTheDocument();
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });

  it('displays ticket price correctly', () => {
    render(
      <TestWrapper>
        <ValidTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('💰 Precio:')).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();
  });

  it('displays event ID correctly', () => {
    render(
      <TestWrapper>
        <ValidTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('Evento ID:')).toBeInTheDocument();
    expect(screen.getByText('event-456')).toBeInTheDocument();
  });

  it('displays user ID correctly', () => {
    render(
      <TestWrapper>
        <ValidTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('Usuario ID:')).toBeInTheDocument();
    expect(screen.getByText('user-789')).toBeInTheDocument();
  });

  it('displays formatted validation date', () => {
    render(
      <TestWrapper>
        <ValidTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('VALIDADO EL')).toBeInTheDocument();

    // Check that a formatted date is displayed (the exact format may vary by locale)
    const dateRegex =
      /\d{1,2}\s+de\s+\w+\s+de\s+\d{4},?\s+\d{1,2}:\d{2}|\d{1,2}\/\d{1,2}\/\d{4},?\s+\d{1,2}:\d{2}/;
    const dateElements = screen.getAllByText(dateRegex);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('displays celebration message', () => {
    render(
      <TestWrapper>
        <ValidTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('🎉 ¡Disfruta del evento!')).toBeInTheDocument();
  });

  it('shows ticket details section header', () => {
    render(
      <TestWrapper>
        <ValidTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('Detalles del Ticket')).toBeInTheDocument();
  });

  it('handles different ticket types', () => {
    const standardTicket: TicketData = {
      ...mockTicketData,
      ticketType: 'Standard',
    };

    render(
      <TestWrapper>
        <ValidTicketState ticket={standardTicket} />
      </TestWrapper>
    );

    expect(screen.getByText('Standard')).toBeInTheDocument();
  });

  it('handles different price values', () => {
    const expensiveTicket: TicketData = {
      ...mockTicketData,
      price: 9999,
    };

    render(
      <TestWrapper>
        <ValidTicketState ticket={expensiveTicket} />
      </TestWrapper>
    );

    expect(screen.getByText('$9999')).toBeInTheDocument();
  });

  it('handles zero price tickets', () => {
    const freeTicket: TicketData = {
      ...mockTicketData,
      price: 0,
    };

    render(
      <TestWrapper>
        <ValidTicketState ticket={freeTicket} />
      </TestWrapper>
    );

    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('handles long event and user IDs', () => {
    const longIdTicket: TicketData = {
      ...mockTicketData,
      eventId: 'event-with-very-long-identifier-1234567890',
      userId: 'user-with-very-long-identifier-abcdefghij',
    };

    render(
      <TestWrapper>
        <ValidTicketState ticket={longIdTicket} />
      </TestWrapper>
    );

    expect(
      screen.getByText('event-with-very-long-identifier-1234567890')
    ).toBeInTheDocument();
    expect(
      screen.getByText('user-with-very-long-identifier-abcdefghij')
    ).toBeInTheDocument();
  });

  it('handles special characters in ticket data', () => {
    const specialTicket: TicketData = {
      ...mockTicketData,
      ticketType: 'VIP+Premium',
      eventId: 'event@2024#special',
      userId: 'user_123-test',
    };

    render(
      <TestWrapper>
        <ValidTicketState ticket={specialTicket} />
      </TestWrapper>
    );

    expect(screen.getByText('VIP+Premium')).toBeInTheDocument();
    expect(screen.getByText('event@2024#special')).toBeInTheDocument();
    expect(screen.getByText('user_123-test')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    expect(() => {
      render(
        <TestWrapper>
          <ValidTicketState ticket={mockTicketData} />
        </TestWrapper>
      );
    }).not.toThrow();
  });

  it('displays all main layout elements', () => {
    const { container } = render(
      <TestWrapper>
        <ValidTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    // Verify main content structure exists
    expect(container.firstChild).toBeTruthy();

    // Check for key elements
    expect(screen.getByText('¡Ticket Validado!')).toBeInTheDocument();
    expect(screen.getByText('✅ ACCESO PERMITIDO')).toBeInTheDocument();
    expect(screen.getByText('Detalles del Ticket')).toBeInTheDocument();
    expect(screen.getByText('🎉 ¡Disfruta del evento!')).toBeInTheDocument();
  });

  it('handles edge case dates correctly', () => {
    const edgeDateTicket: TicketData = {
      ...mockTicketData,
      updatedAt: '2024-12-31T23:59:59Z', // New Year's Eve
    };

    render(
      <TestWrapper>
        <ValidTicketState ticket={edgeDateTicket} />
      </TestWrapper>
    );

    // Should render date without crashing
    expect(screen.getByText('VALIDADO EL')).toBeInTheDocument();
  });
});
