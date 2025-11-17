import { Box, Card, HStack, Text } from '@chakra-ui/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaLocationDot } from 'react-icons/fa6';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  type MapContainerProps,
} from 'react-leaflet';
import type {
  BikeStation,
  Truck,
} from '../../../modules/events/single-event.api';

// Fix for default markers in production
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type MapsProps = {
  cardTitle?: string;
  coordinates: { lat: number; lng: number; description: string };
  stations?: BikeStation[];
  trucks?: Truck[];
  mapsProps?: MapContainerProps;
};

export const Maps = ({
  coordinates,
  stations = [],
  trucks = [],
  mapsProps = {},
  cardTitle = '',
}: MapsProps) => {
  if (!coordinates) {
    return <div>No coordinates to display</div>;
  }

  const center = [coordinates.lat, coordinates.lng] as [number, number];

  return (
    <Card.Root>
      {cardTitle && (
        <Card.Header>
          <Card.Title>
            <HStack gap={2}>
              <Box as={FaLocationDot} color="brand.500" />
              <Text fontSize="xl" fontWeight="bold" color="brand.700">
                {cardTitle}
              </Text>
            </HStack>
          </Card.Title>
        </Card.Header>
      )}
      <Card.Body>
        <MapContainer
          center={center}
          zoom={15}
          style={{ height: '400px', width: '100%' }}
          {...mapsProps}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>{coordinates.description}</Popup>
          </Marker>

          {/* Mostrar estaciones de bicicleta */}
          {stations &&
            stations.length > 0 &&
            stations.map((station) => {
              // Extraer coordenadas: [lng, lat] -> [lat, lng] para Leaflet
              const [lng, lat] = station.location.coordinates;
              const position: [number, number] = [lat, lng];

              const keyboardIcon = L.divIcon({
                html: `<div style="
                    font-size: 20px;
                    color: white;
                    background-color: ${station.bikesCount === 0 ? '#ff6565ff' : '#04BF8A'};
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                  ">
                    🚲
                  </div>`,
                className: '',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              });

              return (
                <Marker
                  key={station._id || station.name}
                  position={position}
                  icon={keyboardIcon}
                >
                  <Popup>
                    <Box>
                      <Text fontWeight="bold">{station.name}</Text>
                      <Text fontSize="sm">
                        Bicicletas: {station.bikesCount}
                      </Text>
                      <Text fontSize="sm">Capacidad: {station.capacity}</Text>
                      <Text fontSize="sm">Estado: {station.status}</Text>
                    </Box>
                  </Popup>
                </Marker>
              );
            })}

          {/* Mostrar camiones (trucks) */}
          {trucks &&
            trucks.length > 0 &&
            trucks
              .filter(
                (truck) =>
                  truck.punto_actual?.latitud != null &&
                  truck.punto_actual?.longitud != null
              )
              .map((truck) => {
                const position: [number, number] = [
                  truck.punto_actual.latitud,
                  truck.punto_actual.longitud,
                ];

                const truckIcon = L.divIcon({
                  html: `<div style="
                    font-size: 20px;
                    color: white;
                    background-color: #FF6B35;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                  ">
                    🚚
                  </div>`,
                  className: '',
                  iconSize: [36, 36],
                  iconAnchor: [18, 18],
                });

                return (
                  <Marker
                    key={truck._id || truck.id_ruta}
                    position={position}
                    icon={truckIcon}
                  >
                    <Popup>
                      <Box>
                        <Text fontWeight="bold">Ruta: {truck.id_ruta}</Text>
                        <Text fontSize="sm">
                          Punto: {truck.indice_punto_actual}/
                          {truck.total_puntos}
                        </Text>
                        <Text fontSize="sm">
                          Progreso: {truck.porcentaje_progreso.toFixed(1)}%
                        </Text>
                        <Text fontSize="sm">
                          Lat: {truck.punto_actual.latitud.toFixed(4)}, Lng:{' '}
                          {truck.punto_actual.longitud.toFixed(4)}
                        </Text>
                      </Box>
                    </Popup>
                  </Marker>
                );
              })}
        </MapContainer>
      </Card.Body>
    </Card.Root>
  );
};

type MapsRoutesProps = {
  coordinates: { lat: number; lng: number; description: string }[];
};

export const MapsRoutes = ({ coordinates }: MapsRoutesProps) => {
  if (coordinates.length === 0) {
    return <div>No coordinates to display</div>;
  }

  const center = [coordinates[0].lat, coordinates[0].lng] as [number, number];
  const positions = coordinates.map(
    (coord) => [coord.lat, coord.lng] as [number, number]
  );

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline positions={positions} color="blue" />
      {coordinates.map((coord, index) => (
        <Marker key={index} position={[coord.lat, coord.lng]}>
          <Popup>{coord.description}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
