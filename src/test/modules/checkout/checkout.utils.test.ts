import {
  formatCardNumber,
  isPaymentValid,
} from '../../../modules/checkout/checkout.utils';
import type { PaymentData } from '../../../modules/checkout/checkout.utils';

describe('checkout.utils', () => {
  describe('formatCardNumber', () => {
    it('formats valid card number with spaces', () => {
      const result = formatCardNumber('1234567890123456');
      expect(result).toBe('1234 5678 9012 3456');
    });

    it('handles card number with existing spaces', () => {
      const result = formatCardNumber('1234 5678 9012 3456');
      expect(result).toBe('1234 5678 9012 3456');
    });

    it('removes non-numeric characters', () => {
      const result = formatCardNumber('1234-5678-9012-3456');
      expect(result).toBe('1234 5678 9012 3456');
    });

    it('handles card number with letters', () => {
      const result = formatCardNumber('1234abc5678def9012ghi3456');
      expect(result).toBe('1234 5678 9012 3456');
    });

    it('handles empty string', () => {
      const result = formatCardNumber('');
      expect(result).toBe('');
    });

    it('handles short card number', () => {
      const result = formatCardNumber('1234');
      expect(result).toBe('1234');
    });

    it('handles card number less than 4 digits', () => {
      const result = formatCardNumber('123');
      expect(result).toBe('123');
    });

    it('handles card number with only special characters', () => {
      const result = formatCardNumber('!@#$%^&*()');
      expect(result).toBe('');
    });

    it('handles mixed alphanumeric with spaces', () => {
      const result = formatCardNumber('12 34 ab 56 78');
      expect(result).toBe('1234 5678');
    });

    it('handles card numbers longer than 16 digits', () => {
      const result = formatCardNumber('12345678901234567890');
      expect(result).toBe('1234 5678 9012 3456');
    });

    it('handles card number with multiple spaces', () => {
      const result = formatCardNumber('1234    5678    9012    3456');
      expect(result).toBe('1234 5678 9012 3456');
    });
  });

  describe('isPaymentValid', () => {
    const validPaymentData: PaymentData = {
      cardNumber: '1234 5678 9012 3456',
      expiryMonth: '12',
      expiryYear: '25',
      cvv: '123',
      cardholderName: 'John Doe',
    };

    it('returns true for valid payment data', () => {
      const result = isPaymentValid(validPaymentData);
      expect(result).toBe(true);
    });

    it('returns false for card number shorter than 13 digits', () => {
      const paymentData = {
        ...validPaymentData,
        cardNumber: '1234 5678 901',
      };
      const result = isPaymentValid(paymentData);
      expect(result).toBe(false);
    });

    it('returns true for card number with 13 digits (minimum)', () => {
      const paymentData = {
        ...validPaymentData,
        cardNumber: '1234 5678 90123',
      };
      const result = isPaymentValid(paymentData);
      expect(result).toBe(true);
    });

    it('returns false for empty expiry month', () => {
      const paymentData = {
        ...validPaymentData,
        expiryMonth: '',
      };
      const result = isPaymentValid(paymentData);
      expect(result).toBe(false);
    });

    it('returns false for empty expiry year', () => {
      const paymentData = {
        ...validPaymentData,
        expiryYear: '',
      };
      const result = isPaymentValid(paymentData);
      expect(result).toBe(false);
    });

    it('returns false for CVV shorter than 3 digits', () => {
      const paymentData = {
        ...validPaymentData,
        cvv: '12',
      };
      const result = isPaymentValid(paymentData);
      expect(result).toBe(false);
    });

    it('returns true for 4-digit CVV', () => {
      const paymentData = {
        ...validPaymentData,
        cvv: '1234',
      };
      const result = isPaymentValid(paymentData);
      expect(result).toBe(true);
    });

    it('returns false for empty cardholder name', () => {
      const paymentData = {
        ...validPaymentData,
        cardholderName: '',
      };
      const result = isPaymentValid(paymentData);
      expect(result).toBe(false);
    });

    it('returns false for cardholder name with only spaces', () => {
      const paymentData = {
        ...validPaymentData,
        cardholderName: '   ',
      };
      const result = isPaymentValid(paymentData);
      expect(result).toBe(false);
    });

    it('returns true for cardholder name with leading/trailing spaces', () => {
      const paymentData = {
        ...validPaymentData,
        cardholderName: '  John Doe  ',
      };
      const result = isPaymentValid(paymentData);
      expect(result).toBe(true);
    });

    it('returns false when all fields are empty', () => {
      const emptyPaymentData: PaymentData = {
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardholderName: '',
      };
      const result = isPaymentValid(emptyPaymentData);
      expect(result).toBe(false);
    });

    it('handles card number without spaces', () => {
      const paymentData = {
        ...validPaymentData,
        cardNumber: '1234567890123456',
      };
      const result = isPaymentValid(paymentData);
      expect(result).toBe(true);
    });

    it('returns false for card number with only spaces', () => {
      const paymentData = {
        ...validPaymentData,
        cardNumber: '     ',
      };
      const result = isPaymentValid(paymentData);
      expect(result).toBe(false);
    });
  });
});
