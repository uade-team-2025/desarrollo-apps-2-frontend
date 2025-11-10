import { getTicket, useTicket } from '../../../modules/ticket/ticket.api';

// Mock API_BASE_URL
jest.mock('../../../core/config/api.config', () => ({
  API_BASE_URL: 'https://api.example.com',
}));

describe('ticket.api', () => {
  describe('getTicket', () => {
    it('returns correct URL for getting a ticket', () => {
      const ticketId = 'ticket-123';
      const result = getTicket(ticketId);

      expect(result).toBe('https://api.example.com/api/v1/tickets/ticket-123');
    });

    it('handles special characters in ticket ID', () => {
      const ticketId = 'ticket-abc-123_456';
      const result = getTicket(ticketId);

      expect(result).toBe(
        'https://api.example.com/api/v1/tickets/ticket-abc-123_456'
      );
    });

    it('handles empty ticket ID', () => {
      const ticketId = '';
      const result = getTicket(ticketId);

      expect(result).toBe('https://api.example.com/api/v1/tickets/');
    });

    it('handles ticket ID with spaces', () => {
      const ticketId = 'ticket with spaces';
      const result = getTicket(ticketId);

      expect(result).toBe(
        'https://api.example.com/api/v1/tickets/ticket with spaces'
      );
    });
  });

  describe('useTicket', () => {
    it('returns correct URL for using a ticket', () => {
      const ticketId = 'ticket-123';
      const result = useTicket(ticketId);

      expect(result).toBe(
        'https://api.example.com/api/v1/tickets/ticket-123/use'
      );
    });

    it('handles special characters in ticket ID', () => {
      const ticketId = 'ticket-abc-123_456';
      const result = useTicket(ticketId);

      expect(result).toBe(
        'https://api.example.com/api/v1/tickets/ticket-abc-123_456/use'
      );
    });

    it('handles empty ticket ID', () => {
      const ticketId = '';
      const result = useTicket(ticketId);

      expect(result).toBe('https://api.example.com/api/v1/tickets//use');
    });

    it('handles ticket ID with special URL characters', () => {
      const ticketId = 'ticket@123#456';
      const result = useTicket(ticketId);

      expect(result).toBe(
        'https://api.example.com/api/v1/tickets/ticket@123#456/use'
      );
    });
  });

  describe('URL consistency', () => {
    it('getTicket and useTicket use the same base URL and ticket path', () => {
      const ticketId = 'test-ticket';
      const getUrl = getTicket(ticketId);
      const useUrl = useTicket(ticketId);

      expect(getUrl).toBe('https://api.example.com/api/v1/tickets/test-ticket');
      expect(useUrl).toBe(
        'https://api.example.com/api/v1/tickets/test-ticket/use'
      );

      // Ensure they share the same base path
      expect(useUrl.startsWith(getUrl)).toBe(true);
    });
  });
});
