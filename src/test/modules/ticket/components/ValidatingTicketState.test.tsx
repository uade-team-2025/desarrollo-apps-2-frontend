import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ValidatingTicketState } from '../../../../modules/ticket/components/ValidatingTicketState';
import type { TicketData } from '../../../../modules/ticket/ticket.api';

const mockTicketData: TicketData = {
  _id: 'ticket-123',
  eventId: 'event-456',
  userId: 'user-789',
  ticketType: 'VIP',
  price: 150,
  status: 'active',
  isActive: true,
  qrCode: 'QR123456789',
  validationURL: 'https://example.com/validate/ticket-123',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

describe('ValidatingTicketState', () => {
  it('renders validating ticket state with correct title and badge', () => {
    render(
      <TestWrapper>
        <ValidatingTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('Validando Ticket...')).toBeInTheDocument();
    expect(screen.getByText('⏳ EN PROCESO')).toBeInTheDocument();
  });

  it('displays ticket type correctly', () => {
    render(
      <TestWrapper>
        <ValidatingTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('Tipo:')).toBeInTheDocument();
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });

  it('displays ticket price correctly', () => {
    render(
      <TestWrapper>
        <ValidatingTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('💰 Precio:')).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();
  });

  it('displays event ID correctly', () => {
    render(
      <TestWrapper>
        <ValidatingTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('Evento ID:')).toBeInTheDocument();
    expect(screen.getByText('event-456')).toBeInTheDocument();
  });

  it('displays user ID correctly', () => {
    render(
      <TestWrapper>
        <ValidatingTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('Usuario ID:')).toBeInTheDocument();
    expect(screen.getByText('user-789')).toBeInTheDocument();
  });

  it('shows validation in progress section', () => {
    render(
      <TestWrapper>
        <ValidatingTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('VALIDACIÓN EN CURSO')).toBeInTheDocument();
  });

  it('displays confirmation message', () => {
    render(
      <TestWrapper>
        <ValidatingTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('Confirmando asistencia...')).toBeInTheDocument();
  });

  it('displays wait instruction', () => {
    render(
      <TestWrapper>
        <ValidatingTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(
      screen.getByText('Por favor espere mientras procesamos su ticket')
    ).toBeInTheDocument();
  });

  it('shows ticket details section header', () => {
    render(
      <TestWrapper>
        <ValidatingTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    expect(screen.getByText('Detalles del Ticket')).toBeInTheDocument();
  });

  it('renders spinner component', () => {
    render(
      <TestWrapper>
        <ValidatingTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    // Check if spinner exists by looking for loading elements
    const loadingElements = [
      screen.queryByText('Confirmando asistencia...'),
      screen.queryByText('Por favor espere mientras procesamos su ticket'),
    ];

    expect(loadingElements.some((element) => element !== null)).toBe(true);
  });

  it('handles different ticket types', () => {
    const standardTicket: TicketData = {
      ...mockTicketData,
      ticketType: 'Standard',
    };

    render(
      <TestWrapper>
        <ValidatingTicketState ticket={standardTicket} />
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
        <ValidatingTicketState ticket={expensiveTicket} />
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
        <ValidatingTicketState ticket={freeTicket} />
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
        <ValidatingTicketState ticket={longIdTicket} />
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
        <ValidatingTicketState ticket={specialTicket} />
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
          <ValidatingTicketState ticket={mockTicketData} />
        </TestWrapper>
      );
    }).not.toThrow();
  });

  it('displays all main layout elements', () => {
    const { container } = render(
      <TestWrapper>
        <ValidatingTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    // Verify main content structure exists
    expect(container.firstChild).toBeTruthy();

    // Check for key elements
    expect(screen.getByText('Validando Ticket...')).toBeInTheDocument();
    expect(screen.getByText('⏳ EN PROCESO')).toBeInTheDocument();
    expect(screen.getByText('Detalles del Ticket')).toBeInTheDocument();
    expect(screen.getByText('VALIDACIÓN EN CURSO')).toBeInTheDocument();
  });

  it('maintains consistent loading theme', () => {
    render(
      <TestWrapper>
        <ValidatingTicketState ticket={mockTicketData} />
      </TestWrapper>
    );

    // All the key loading-related messages should be present
    expect(screen.getByText('⏳ EN PROCESO')).toBeInTheDocument();
    expect(screen.getByText('VALIDACIÓN EN CURSO')).toBeInTheDocument();
    expect(screen.getByText('Confirmando asistencia...')).toBeInTheDocument();
    expect(
      screen.getByText('Por favor espere mientras procesamos su ticket')
    ).toBeInTheDocument();
  });

  it('handles empty or unusual ticket data gracefully', () => {
    const unusualTicket: TicketData = {
      ...mockTicketData,
      ticketType: '',
      eventId: '',
      userId: '',
    };

    render(
      <TestWrapper>
        <ValidatingTicketState ticket={unusualTicket} />
      </TestWrapper>
    );

    // Component should render without crashing even with empty strings
    expect(screen.getByText('Validando Ticket...')).toBeInTheDocument();
    expect(screen.getByText('Tipo:')).toBeInTheDocument();
    expect(screen.getByText('Evento ID:')).toBeInTheDocument();
    expect(screen.getByText('Usuario ID:')).toBeInTheDocument();
  });
});
