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

type BikeStation = {
  stationId: string;
  lt: number;
  lg: number;
  count: number;
};

type Truck = {
  truckId: string;
  lat: number;
  long: number;
};

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
              const keyboardIcon = L.divIcon({
                html: `<div style="
                    font-size: 20px;
                    color: white;
                    background-color: ${station.count === 0 ? '#ff6565ff' : '#04BF8A'};
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
                  key={station.stationId}
                  position={[station.lt, station.lg]}
                  icon={keyboardIcon}
                >
                  <Popup>
                    <Box>
                      <Text fontWeight="bold">{station.stationId}</Text>
                      <Text fontSize="sm">Bicicletas: {station.count}</Text>
                    </Box>
                  </Popup>
                </Marker>
              );
            })}

          {/* Mostrar camiones (trucks) */}
          {trucks &&
            trucks.length > 0 &&
            trucks.map((truck) => {
              // Validar que el truck tenga coordenadas válidas
              if (
                !truck ||
                truck.lat === undefined ||
                truck.long === undefined
              ) {
                return null;
              }

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
                  key={truck.truckId}
                  position={[truck.lat, truck.long]}
                  icon={truckIcon}
                >
                  <Popup>
                    <Box>
                      <Text fontWeight="bold">{truck.truckId}</Text>
                      <Text fontSize="sm">
                        Lat: {truck.lat.toFixed(4)}, Lng:{' '}
                        {truck.long.toFixed(4)}
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
