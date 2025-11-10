import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { PageHeader } from '../../../../modules/checkout/components/page-header';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

describe('PageHeader', () => {
  it('renders the checkout title', () => {
    render(
      <TestWrapper>
        <PageHeader />
      </TestWrapper>
    );

    expect(screen.getByText('Finalizar Compra')).toBeInTheDocument();
  });

  it('renders the descriptive subtitle', () => {
    render(
      <TestWrapper>
        <PageHeader />
      </TestWrapper>
    );

    expect(
      screen.getByText('Revisa tu pedido y confirma la compra de tus entradas')
    ).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    expect(() => {
      render(
        <TestWrapper>
          <PageHeader />
        </TestWrapper>
      );
    }).not.toThrow();
  });

  it('has proper structure with both title and subtitle', () => {
    const { container } = render(
      <TestWrapper>
        <PageHeader />
      </TestWrapper>
    );

    // Verify main content structure exists
    expect(container.firstChild).toBeTruthy();

    // Check for key elements
    expect(screen.getByText('Finalizar Compra')).toBeInTheDocument();
    expect(
      screen.getByText('Revisa tu pedido y confirma la compra de tus entradas')
    ).toBeInTheDocument();
  });
});
