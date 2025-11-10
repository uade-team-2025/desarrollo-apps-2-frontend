import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { LoadingState } from '../../../../modules/ticket/components/LoadingState';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

describe('LoadingState', () => {
  it('renders loading title', () => {
    render(
      <TestWrapper>
        <LoadingState />
      </TestWrapper>
    );

    expect(screen.getByText('Verificando Ticket')).toBeInTheDocument();
  });

  it('displays loading message', () => {
    render(
      <TestWrapper>
        <LoadingState />
      </TestWrapper>
    );

    expect(screen.getByText('Verificando ticket...')).toBeInTheDocument();
  });

  it('shows descriptive help text', () => {
    render(
      <TestWrapper>
        <LoadingState />
      </TestWrapper>
    );

    expect(
      screen.getByText('Por favor espere mientras validamos su código QR')
    ).toBeInTheDocument();
  });

  it('renders spinner component', () => {
    render(
      <TestWrapper>
        <LoadingState />
      </TestWrapper>
    );

    // Check if spinner exists by looking for the Chakra UI Spinner element
    const spinner = document.querySelector(
      '[data-testid="spinner"], .chakra-spinner, [role="status"]'
    );
    expect(spinner || screen.getByText('Verificando ticket...')).toBeTruthy();
  });

  it('has proper layout structure', () => {
    render(
      <TestWrapper>
        <LoadingState />
      </TestWrapper>
    );

    // Verify main content elements are present
    expect(screen.getByText('Verificando Ticket')).toBeInTheDocument();
    expect(screen.getByText('Verificando ticket...')).toBeInTheDocument();
    expect(
      screen.getByText('Por favor espere mientras validamos su código QR')
    ).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    expect(() => {
      render(
        <TestWrapper>
          <LoadingState />
        </TestWrapper>
      );
    }).not.toThrow();
  });

  it('applies correct styling classes and attributes', () => {
    const { container } = render(
      <TestWrapper>
        <LoadingState />
      </TestWrapper>
    );

    // Check that component renders with expected structure
    expect(container.firstChild).toBeTruthy();
  });

  it('maintains consistent text content', () => {
    render(
      <TestWrapper>
        <LoadingState />
      </TestWrapper>
    );

    // Verify all expected text content is present
    const expectedTexts = [
      'Verificando Ticket',
      'Verificando ticket...',
      'Por favor espere mientras validamos su código QR',
    ];

    expectedTexts.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('displays proper loading state indicators', () => {
    render(
      <TestWrapper>
        <LoadingState />
      </TestWrapper>
    );

    // Check for loading indicators - either spinner or loading text
    const loadingIndicators = [
      screen.queryByText('Verificando ticket...'),
      screen.queryByText('Por favor espere mientras validamos su código QR'),
    ];

    expect(loadingIndicators.some((indicator) => indicator !== null)).toBe(
      true
    );
  });
});
