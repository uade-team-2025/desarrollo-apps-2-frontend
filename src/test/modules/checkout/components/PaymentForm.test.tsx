import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { PaymentForm } from '../../../../modules/checkout/components/payment-form';
import type { PaymentData } from '../../../../modules/checkout/checkout.utils';

const defaultPaymentData: PaymentData = {
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  cardholderName: '',
};

const filledPaymentData: PaymentData = {
  cardNumber: '1234 5678 9012 3456',
  expiryMonth: '12',
  expiryYear: '25',
  cvv: '123',
  cardholderName: 'JOHN DOE',
};

const defaultProps = {
  paymentData: defaultPaymentData,
  onPaymentDataChange: jest.fn(),
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

describe('PaymentForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders payment form title', () => {
    render(
      <TestWrapper>
        <PaymentForm {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('💳 Información de Pago')).toBeInTheDocument();
  });

  it('renders card number input with placeholder', () => {
    render(
      <TestWrapper>
        <PaymentForm {...defaultProps} />
      </TestWrapper>
    );

    expect(
      screen.getByPlaceholderText('1234 5678 9012 3456')
    ).toBeInTheDocument();
    expect(screen.getByText('Número de Tarjeta')).toBeInTheDocument();
  });

  it('renders cardholder name input', () => {
    render(
      <TestWrapper>
        <PaymentForm {...defaultProps} />
      </TestWrapper>
    );

    expect(
      screen.getByPlaceholderText('Como aparece en la tarjeta')
    ).toBeInTheDocument();
    expect(screen.getByText('Nombre del Titular')).toBeInTheDocument();
  });

  it('renders expiry month select with options', () => {
    render(
      <TestWrapper>
        <PaymentForm {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Mes')).toBeInTheDocument();
    const monthSelect = screen.getByDisplayValue('MM');
    expect(monthSelect).toBeInTheDocument();
  });

  it('renders expiry year select with options', () => {
    render(
      <TestWrapper>
        <PaymentForm {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Año')).toBeInTheDocument();
    const yearSelect = screen.getByDisplayValue('YY');
    expect(yearSelect).toBeInTheDocument();
  });

  it('renders CVV input', () => {
    render(
      <TestWrapper>
        <PaymentForm {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('123')).toBeInTheDocument();
    expect(screen.getByText('CVV')).toBeInTheDocument();
  });

  it('displays current payment data values', () => {
    const props = {
      ...defaultProps,
      paymentData: filledPaymentData,
    };

    render(
      <TestWrapper>
        <PaymentForm {...props} />
      </TestWrapper>
    );

    expect(screen.getByDisplayValue('1234 5678 9012 3456')).toBeInTheDocument();
    expect(screen.getByDisplayValue('JOHN DOE')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12')).toBeInTheDocument();
    expect(screen.getByDisplayValue('25')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
  });

  it('calls onPaymentDataChange when card number is changed', () => {
    const onPaymentDataChange = jest.fn();
    const props = {
      ...defaultProps,
      onPaymentDataChange,
    };

    render(
      <TestWrapper>
        <PaymentForm {...props} />
      </TestWrapper>
    );

    const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
    fireEvent.change(cardInput, { target: { value: '1234567890123456' } });

    expect(onPaymentDataChange).toHaveBeenCalledWith(
      'cardNumber',
      '1234 5678 9012 3456'
    );
  });

  it('calls onPaymentDataChange when cardholder name is changed', () => {
    const onPaymentDataChange = jest.fn();
    const props = {
      ...defaultProps,
      onPaymentDataChange,
    };

    render(
      <TestWrapper>
        <PaymentForm {...props} />
      </TestWrapper>
    );

    const nameInput = screen.getByPlaceholderText('Como aparece en la tarjeta');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    expect(onPaymentDataChange).toHaveBeenCalledWith(
      'cardholderName',
      'John Doe'
    );
  });

  it('calls onPaymentDataChange when expiry month is changed', () => {
    const onPaymentDataChange = jest.fn();
    const props = {
      ...defaultProps,
      onPaymentDataChange,
    };

    render(
      <TestWrapper>
        <PaymentForm {...props} />
      </TestWrapper>
    );

    const monthSelect = screen.getByDisplayValue('MM');
    fireEvent.change(monthSelect, { target: { value: '12' } });

    expect(onPaymentDataChange).toHaveBeenCalledWith('expiryMonth', '12');
  });

  it('calls onPaymentDataChange when expiry year is changed', () => {
    const onPaymentDataChange = jest.fn();
    const props = {
      ...defaultProps,
      onPaymentDataChange,
    };

    render(
      <TestWrapper>
        <PaymentForm {...props} />
      </TestWrapper>
    );

    const yearSelect = screen.getByDisplayValue('YY');
    fireEvent.change(yearSelect, { target: { value: '25' } });

    expect(onPaymentDataChange).toHaveBeenCalledWith('expiryYear', '25');
  });

  it('calls onPaymentDataChange when CVV is changed', () => {
    const onPaymentDataChange = jest.fn();
    const props = {
      ...defaultProps,
      onPaymentDataChange,
    };

    render(
      <TestWrapper>
        <PaymentForm {...props} />
      </TestWrapper>
    );

    const cvvInput = screen.getByPlaceholderText('123');
    fireEvent.change(cvvInput, { target: { value: '456' } });

    expect(onPaymentDataChange).toHaveBeenCalledWith('cvv', '456');
  });

  it('limits CVV input to numeric characters only', () => {
    const onPaymentDataChange = jest.fn();
    const props = {
      ...defaultProps,
      onPaymentDataChange,
    };

    render(
      <TestWrapper>
        <PaymentForm {...props} />
      </TestWrapper>
    );

    const cvvInput = screen.getByPlaceholderText('123');
    fireEvent.change(cvvInput, { target: { value: 'abc123def456' } });

    expect(onPaymentDataChange).toHaveBeenCalledWith('cvv', '1234');
  });

  it('limits CVV input to 4 characters maximum', () => {
    const onPaymentDataChange = jest.fn();
    const props = {
      ...defaultProps,
      onPaymentDataChange,
    };

    render(
      <TestWrapper>
        <PaymentForm {...props} />
      </TestWrapper>
    );

    const cvvInput = screen.getByPlaceholderText('123');
    fireEvent.change(cvvInput, { target: { value: '123456789' } });

    expect(onPaymentDataChange).toHaveBeenCalledWith('cvv', '1234');
  });

  it('generates correct month options (01-12)', () => {
    render(
      <TestWrapper>
        <PaymentForm {...defaultProps} />
      </TestWrapper>
    );

    const monthSelect = screen.getByDisplayValue('MM');

    // Check if all months are present
    expect(monthSelect.children).toHaveLength(13); // MM + 12 months

    // Test a few specific months
    fireEvent.change(monthSelect, { target: { value: '01' } });
    fireEvent.change(monthSelect, { target: { value: '06' } });
    fireEvent.change(monthSelect, { target: { value: '12' } });
  });

  it('generates correct year options (current year + 10)', () => {
    render(
      <TestWrapper>
        <PaymentForm {...defaultProps} />
      </TestWrapper>
    );

    const yearSelect = screen.getByDisplayValue('YY');

    // Check if correct number of years are present
    expect(yearSelect.children).toHaveLength(11); // YY + 10 years
  });

  it('handles card number formatting', () => {
    const onPaymentDataChange = jest.fn();
    const props = {
      ...defaultProps,
      onPaymentDataChange,
    };

    render(
      <TestWrapper>
        <PaymentForm {...props} />
      </TestWrapper>
    );

    const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');

    // Test various card number formats
    fireEvent.change(cardInput, { target: { value: '1234567890123456' } });
    expect(onPaymentDataChange).toHaveBeenCalledWith(
      'cardNumber',
      '1234 5678 9012 3456'
    );

    fireEvent.change(cardInput, { target: { value: '1234-5678-9012-3456' } });
    expect(onPaymentDataChange).toHaveBeenCalledWith(
      'cardNumber',
      '1234 5678 9012 3456'
    );
  });

  it('has proper input attributes for accessibility and autofill', () => {
    render(
      <TestWrapper>
        <PaymentForm {...defaultProps} />
      </TestWrapper>
    );

    const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
    expect(cardInput).toHaveAttribute('autoComplete', 'cc-number');
    expect(cardInput).toHaveAttribute('maxLength', '19');

    const nameInput = screen.getByPlaceholderText('Como aparece en la tarjeta');
    expect(nameInput).toHaveAttribute('autoComplete', 'cc-name');

    const monthSelect = screen.getByDisplayValue('MM');
    expect(monthSelect).toHaveAttribute('autoComplete', 'cc-exp-month');

    const yearSelect = screen.getByDisplayValue('YY');
    expect(yearSelect).toHaveAttribute('autoComplete', 'cc-exp-year');

    const cvvInput = screen.getByPlaceholderText('123');
    expect(cvvInput).toHaveAttribute('autoComplete', 'cc-csc');
    expect(cvvInput).toHaveAttribute('maxLength', '4');
    expect(cvvInput).toHaveAttribute('type', 'password');
  });

  it('renders without crashing', () => {
    expect(() => {
      render(
        <TestWrapper>
          <PaymentForm {...defaultProps} />
        </TestWrapper>
      );
    }).not.toThrow();
  });

  it('displays all required form fields', () => {
    const { container } = render(
      <TestWrapper>
        <PaymentForm {...defaultProps} />
      </TestWrapper>
    );

    // Verify main content structure exists
    expect(container.firstChild).toBeTruthy();

    // Check for all form fields
    expect(screen.getByText('💳 Información de Pago')).toBeInTheDocument();
    expect(screen.getByText('Número de Tarjeta')).toBeInTheDocument();
    expect(screen.getByText('Nombre del Titular')).toBeInTheDocument();
    expect(screen.getByText('Mes')).toBeInTheDocument();
    expect(screen.getByText('Año')).toBeInTheDocument();
    expect(screen.getByText('CVV')).toBeInTheDocument();
  });

  it('handles focus and blur events for styling', () => {
    render(
      <TestWrapper>
        <PaymentForm {...defaultProps} />
      </TestWrapper>
    );

    const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');

    // Test focus event
    fireEvent.focus(cardInput);
    // Test blur event
    fireEvent.blur(cardInput);

    // Events should not cause errors
    expect(cardInput).toBeInTheDocument();
  });

  it('maintains proper input types', () => {
    render(
      <TestWrapper>
        <PaymentForm {...defaultProps} />
      </TestWrapper>
    );

    const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456');
    expect(cardInput).toHaveAttribute('type', 'text');

    const nameInput = screen.getByPlaceholderText('Como aparece en la tarjeta');
    expect(nameInput).toHaveAttribute('type', 'text');

    const cvvInput = screen.getByPlaceholderText('123');
    expect(cvvInput).toHaveAttribute('type', 'password');
  });
});
