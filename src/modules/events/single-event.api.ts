import { API_BASE_URL } from '../../core/config/api.config';

export const getEventById = (id: string) =>
  `${API_BASE_URL}/api/v1/events/${id}`;

export type BikeStation = {
  stationId: string;
  lt: number;
  lg: number;
  count: number;
};

export const getMobilityStationsForEvent = (eventId: string) =>
  `${API_BASE_URL}/api/v1/mobility/stations/${eventId}`;

export type Truck = {
  truckId: string;
  lat: number;
  long: number;
};

export const getTruckPositionsForEvent = (eventId: string) =>
  `${API_BASE_URL}/api/v1/residuos/trucks/event/${eventId}`;
