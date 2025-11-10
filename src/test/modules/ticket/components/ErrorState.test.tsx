import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ErrorState } from '../../../../modules/ticket/components/ErrorState';

// Mock window.location
const originalLocation = window.location;

beforeAll(() => {
  // @ts-ignore
  delete window.location;
  window.location = { href: '' } as any;
});

afterAll(() => {
  // @ts-ignore
  window.location = originalLocation;
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

describe('ErrorState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error state with correct title and badge', () => {
    const errorMessage = 'Invalid ticket format';

    render(
      <TestWrapper>
        <ErrorState error={errorMessage} />
      </TestWrapper>
    );

    expect(screen.getByText('Ticket Inválido')).toBeInTheDocument();
    expect(screen.getByText('❌ ACCESO DENEGADO')).toBeInTheDocument();
  });

  it('displays the error message passed as prop', () => {
    const errorMessage = 'This is a custom error message';

    render(
      <TestWrapper>
        <ErrorState error={errorMessage} />
      </TestWrapper>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows error validation section', () => {
    const errorMessage = 'Ticket expired';

    render(
      <TestWrapper>
        <ErrorState error={errorMessage} />
      </TestWrapper>
    );

    expect(screen.getByText('ERROR DE VALIDACIÓN')).toBeInTheDocument();
  });

  it('displays help text', () => {
    const errorMessage = 'Network error';

    render(
      <TestWrapper>
        <ErrorState error={errorMessage} />
      </TestWrapper>
    );

    expect(
      screen.getByText('¿Necesitas ayuda? Contacta al soporte técnico')
    ).toBeInTheDocument();
  });

  it('renders "Volver al Inicio" button', () => {
    const errorMessage = 'Some error';

    render(
      <TestWrapper>
        <ErrorState error={errorMessage} />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: /volver al inicio/i });
    expect(button).toBeInTheDocument();
  });

  it('navigates to home when "Volver al Inicio" button is clicked', () => {
    const errorMessage = 'Some error';

    render(
      <TestWrapper>
        <ErrorState error={errorMessage} />
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: /volver al inicio/i });
    fireEvent.click(button);

    expect(window.location.href).toBe('http://localhost/');
  });

  it('handles long error messages', () => {
    const longErrorMessage =
      'This is a very long error message that should be displayed properly even when it contains a lot of text and might wrap to multiple lines in the UI component.';

    render(
      <TestWrapper>
        <ErrorState error={longErrorMessage} />
      </TestWrapper>
    );

    expect(screen.getByText(longErrorMessage)).toBeInTheDocument();
  });

  it('handles empty error message', () => {
    const emptyErrorMessage = '';

    render(
      <TestWrapper>
        <ErrorState error={emptyErrorMessage} />
      </TestWrapper>
    );

    // Check that the main structural elements are still present
    expect(screen.getByText('Ticket Inválido')).toBeInTheDocument();
    expect(screen.getByText('ERROR DE VALIDACIÓN')).toBeInTheDocument();
    // The empty error message should still render the container
    expect(
      screen.getByText('¿Necesitas ayuda? Contacta al soporte técnico')
    ).toBeInTheDocument();
  });

  it('has correct styling and layout structure', () => {
    const errorMessage = 'Test error';

    render(
      <TestWrapper>
        <ErrorState error={errorMessage} />
      </TestWrapper>
    );

    // Check for main structural elements
    expect(screen.getByText('Ticket Inválido')).toBeInTheDocument();
    expect(screen.getByText('❌ ACCESO DENEGADO')).toBeInTheDocument();
    expect(screen.getByText('ERROR DE VALIDACIÓN')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /volver al inicio/i })
    ).toBeInTheDocument();
  });

  it('displays special characters in error message correctly', () => {
    const errorMessage = 'Error with special chars: áéíóú ñÑ @#$%&*()';

    render(
      <TestWrapper>
        <ErrorState error={errorMessage} />
      </TestWrapper>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('handles HTML-like content in error message as plain text', () => {
    const errorMessage = '<script>alert("test")</script>Invalid ticket';

    render(
      <TestWrapper>
        <ErrorState error={errorMessage} />
      </TestWrapper>
    );

    // Should render as plain text, not execute HTML
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
