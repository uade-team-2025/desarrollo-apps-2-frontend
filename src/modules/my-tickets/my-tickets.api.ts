import { API_BASE_URL } from '../../core/config/api.config';

export interface PopulatedEvent {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  isActive?: boolean;
  status?: string;
  culturalPlaceId: {
    _id: string;
    name: string;
    address: string;
    image: string;
  };
  image: string;
}

export interface Ticket {
  _id: string;
  eventId: string | PopulatedEvent;
  userId: string;
  ticketType: 'general' | 'vip' | 'jubilados' | 'niños';
  price: number;
  status: 'active' | 'used' | 'cancelled';
  purchaseDate: string;
  createdAt?: string;
  updatedAt?: string;
  qrCode?: string;
  validationURL?: string;
  isActive: boolean;
}

export const getUserTickets = (userId: string) =>
  `${API_BASE_URL}/api/v1/tickets/user/${userId}`;
