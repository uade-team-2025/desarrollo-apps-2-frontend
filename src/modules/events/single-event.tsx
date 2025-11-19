import { Alert, Box, Grid, Stack, Text, VStack } from '@chakra-ui/react';
import { FiXCircle } from 'react-icons/fi';
import { useParams } from 'react-router';
import { LoadingIndicator } from '../../core/components/ui/loading-indicator';
import { Maps } from '../../core/components/ui/maps';
import { useAuth } from '../../core/contexts/auth-context';
import { useGetDataFromBackend } from '../../core/hooks/useGetDataFromBackend';
import { CulturalPlaceInfo } from './components/cultural-place-info';
import { EventAbout } from './components/event-about';
import { EventCalendar } from './components/event-calendar';
import { EventHeader } from './components/event-header';
import { EventTickets } from './components/event-tickets';
import {
  getEventById,
  getMobilityStationsForEvent,
  getTruckPositionsForEvent,
  type BikeStation,
  type Event,
  type Truck,
} from './single-event.api';

export const SingleEvent = () => {
  const { id } = useParams<{ id: string }>();
  const { isLogged } = useAuth();

  const { data: event, loading } = useGetDataFromBackend<Event>({
    url: id ? getEventById(id) : '',
    options: { method: 'GET' },
    executeAutomatically: !!id,
  });

  const { data: mobilityStations } = useGetDataFromBackend<BikeStation[]>({
    url: id ? getMobilityStationsForEvent(id) : '',
    options: { method: 'GET' },
    executeAutomatically: !!id,
    pollingIntervalSeconds: 5,
  });

  const { data: truckPositions } = useGetDataFromBackend<Truck[]>({
    url: id ? getTruckPositionsForEvent(id) : '',
    options: { method: 'GET' },
    executeAutomatically: !!id,
    pollingIntervalSeconds: 5,
  });

  if (loading) {
    return <LoadingIndicator text="Cargando evento..." />;
  }

  if (!event) {
    return (
      <Stack align="center" justify="center" minH="400px">
        <FiXCircle size={'50'} />
        <Text fontSize="lg" color="gray.500">
          Evento no encontrado.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack bg="gray.100" pb={6}>
      <EventHeader
        image={event.culturalPlaceId.image}
        name={event.name}
        date={event.date}
        time={event.time}
        culturalPlaceName={event.culturalPlaceId.name}
        rating={event.culturalPlaceId.rating}
      />

      <Box mx="auto" px={4} position="relative">
        {!event.isActive && (
          <Alert.Root status="warning" mb={6} borderRadius="md">
            <Text fontWeight="semibold">
              Este evento no está disponible actualmente.
            </Text>
          </Alert.Root>
        )}

        <Stack mb={6} gap={6}>
          <Maps
            coordinates={{
              lat: event.culturalPlaceId.contact.coordinates.lat,
              lng: event.culturalPlaceId.contact.coordinates.lng,
              description: event.culturalPlaceId.name,
            }}
            stations={mobilityStations || []}
            trucks={truckPositions || []}
          />
          <EventAbout description={event.description} />
        </Stack>
        <Grid templateColumns={{ base: '1fr', xl: '2fr 1fr' }} gap={6}>
          <VStack gap={6} align="stretch">
            <CulturalPlaceInfo
              name={event.culturalPlaceId.name}
              description={event.culturalPlaceId.description}
              category={event.culturalPlaceId.category}
              rating={event.culturalPlaceId.rating}
              address={event.culturalPlaceId.contact.address}
              phone={event.culturalPlaceId.contact.phone}
            />

            <EventTickets
              eventId={event._id}
              eventName={event.name}
              eventDate={event.date}
              eventTime={event.time}
              culturalPlaceName={event.culturalPlaceId.name}
              tickets={event.ticketTypes}
              isLogged={isLogged}
              isEventActive={event.isActive}
            />
          </VStack>

          <VStack gap={6} align="stretch">
            <EventCalendar eventDate={event.date} eventName={event.name} />
          </VStack>
        </Grid>
      </Box>
    </Stack>
  );
};
