import type { PopulatedEvent } from './my-tickets.api';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green';
    case 'used':
      return 'teal';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

export const getStatusText = (
  status: string,
  eventData?: { isActive?: boolean; status?: string } | null
) => {
  // Si el ticket está activo pero el evento está pausado/cerrado
  if (status === 'active' && eventData && eventData.isActive === false) {
    if (eventData.status === 'PAUSED_BY_CLOSURE') {
      return 'Cancelado';
    }
    if (eventData.status === 'TEMPORAL_PAUSED') {
      return 'Cancelado temporalmente';
    }
    return 'Cancelado';
  }

  switch (status) {
    case 'active':
      return 'Activo';
    case 'used':
      return 'Usado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Desconocido';
  }
};

export const getTicketTypeText = (ticketType: string) => {
  switch (ticketType) {
    case 'general':
      return 'General';
    case 'vip':
      return 'VIP';
    case 'jubilados':
      return 'Jubilados';
    case 'niños':
      return 'Niños';
    default:
      return ticketType;
  }
};

// Type guard para verificar si el eventId está poblado
export const isPopulatedEvent = (
  eventId: string | PopulatedEvent
): eventId is PopulatedEvent => {
  return typeof eventId === 'object' && eventId !== null && '_id' in eventId;
};
