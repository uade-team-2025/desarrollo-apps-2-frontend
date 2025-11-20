import { API_BASE_URL } from '../../../core/config/api.config';

// Interfaces
export interface Ticket {
  _id: string;
  eventId: string;
  userId: string;
  ticketType: string;
  price: number;
  status: 'active' | 'used' | 'cancelled' | 'refunded';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  qrCode?: string;
}

export interface TicketStats {
  totalTickets: number;
  activeTickets: number;
  usedTickets: number;
  cancelledTickets: number;
  refundedTickets: number;
  totalRevenue: number;
}

export interface TicketFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  eventId?: string;
  userId?: string;
  ticketType?: string;
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  isActive: boolean;
  ticketTypes: Array<{
    type: string;
    price: number;
    initialQuantity: number;
    soldQuantity: number;
    isActive: boolean;
  }>;
}

// API Endpoints
export const getTickets = (filters?: TicketFilters) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.eventId) params.append('eventId', filters.eventId);
  if (filters?.userId) params.append('userId', filters.userId);
  if (filters?.ticketType) params.append('ticketType', filters.ticketType);

  return `${API_BASE_URL}/api/v1/tickets${params.toString() ? `?${params.toString()}` : ''}`;
};

export const getTicketById = (id: string) =>
  `${API_BASE_URL}/api/v1/tickets/${id}`;

export const getTicketStats = () => `${API_BASE_URL}/api/v1/tickets/stats`;

export const getTicketsByStatus = (status: string) =>
  `${API_BASE_URL}/api/v1/tickets/status/${status}`;

export const getActiveTickets = () => `${API_BASE_URL}/api/v1/tickets/active`;

export const updateTicketStatus = (id: string) =>
  `${API_BASE_URL}/api/v1/tickets/${id}`;

export const cancelTicket = (id: string) =>
  `${API_BASE_URL}/api/v1/tickets/${id}/cancel`;

export const useTicket = (id: string) =>
  `${API_BASE_URL}/api/v1/tickets/${id}/use`;
