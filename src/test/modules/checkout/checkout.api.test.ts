import {
  createTicketUrl,
  purchaseTicketUrl,
} from '../../../modules/checkout/checkout.api';

// Mock API_BASE_URL
jest.mock('../../../core/config/api.config', () => ({
  API_BASE_URL: 'https://api.example.com',
}));

describe('checkout.api', () => {
  describe('createTicketUrl', () => {
    it('returns correct URL for creating a ticket', () => {
      const result = createTicketUrl();

      expect(result).toBe('https://api.example.com/api/v1/tickets');
    });
  });

  describe('purchaseTicketUrl', () => {
    it('returns correct URL for purchasing tickets', () => {
      const result = purchaseTicketUrl();

      expect(result).toBe('https://api.example.com/api/v1/tickets/purchase');
    });
  });

  describe('URL consistency', () => {
    it('both functions use the same base URL', () => {
      const createUrl = createTicketUrl();
      const purchaseUrl = purchaseTicketUrl();

      expect(createUrl).toContain('https://api.example.com/api/v1/tickets');
      expect(purchaseUrl).toContain('https://api.example.com/api/v1/tickets');
    });
  });
});
