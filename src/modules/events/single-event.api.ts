import { API_BASE_URL } from '../../core/config/api.config';

export interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  culturalPlaceId: {
    _id: string;
    name: string;
    description: string;
    category: string;
    characteristics: string[];
    contact: {
      address: string;
      coordinates: { lat: number; lng: number };
      phone: string;
      website: string;
      email: string;
    };
    image: string;
    rating: number;
  };
  ticketTypes: {
    type: string;
    price: number;
    initialQuantity: number;
    soldQuantity: number;
    isActive: boolean;
  }[];
  isActive: boolean;
}

export const getEventById = (id: string) =>
  `${API_BASE_URL}/api/v1/events/${id}`;

export type BikeStation = {
  _id?: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  capacity: number;
  bikesCount: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export const getMobilityStationsForEvent = (eventId: string) =>
  `${API_BASE_URL}/api/v1/mobility/stations/${eventId}`;

export type Truck = {
  _id?: string;
  id_ruta: string;
  indice_punto_actual: number;
  total_puntos: number;
  punto_actual: {
    latitud: number;
    longitud: number;
  };
  porcentaje_progreso: number;
  informacion_adicional: Array<{
    id_evento: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

export const getTruckPositionsForEvent = (eventId: string) =>
  `${API_BASE_URL}/api/v1/residuos/trucks/event/${eventId}`;
