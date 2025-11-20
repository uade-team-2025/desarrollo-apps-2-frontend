import { Alert, Box, Grid, Stack, Text, VStack } from '@chakra-ui/react';
import { FiXCircle } from 'react-icons/fi';
import { useParams } from 'react-router';
import { LoadingIndicator } from '../../../../core/components/ui/loading-indicator';
import { Maps } from '../../../../core/components/ui/maps';
import { useGetDataFromBackend } from '../../../../core/hooks/useGetDataFromBackend';
import { getCulturalPlaceById } from '../cultural-places.api';
import { About } from './about';
import { Contact } from './contact';
import { Features } from './features';
import { Header } from './header';
import { Hours } from './hours';
import { NextEvents } from './next-events';

interface CulturalPlace {
  _id: string;
  name: string;
  category: string;
  characteristics: string[];
  schedules: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
    _id: string;
  };
  contact: {
    coordinates: { lat: number; lng: number };
    address: string;
    phone: string;
    website: string;
    email: string;
    _id: string;
  };
  image: string;
  rating: number;
  isActive: boolean;
  status?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  description: string;
  color: string;
  icon: string;
  reviews: number;
}

export const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: culturalPlace, loading } = useGetDataFromBackend<CulturalPlace>(
    {
      url: getCulturalPlaceById(id!),
      options: {
        method: 'GET',
      },
      executeAutomatically: !!id,
    }
  );

  if (loading) {
    return <LoadingIndicator text="Cargando espacio cultural..." />;
  }

  if (!culturalPlace) {
    return (
      <Stack align="center" justify="center" minH="400px">
        <FiXCircle size={'50'} />
        <Text fontSize="lg" color="gray.500">
          Espacio cultural no encontrado.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack bg="gray.100" pb={6}>
      <Header
        image={culturalPlace.image}
        name={culturalPlace.name}
        color={culturalPlace.color || 'green'}
        culturalPlace={culturalPlace.category}
        rating={culturalPlace.rating}
        reviews={culturalPlace.reviews}
      />

      <Box mx="auto" px={4} position="relative">
        {!culturalPlace.isActive && (
          <Alert.Root status="warning" mb={6} borderRadius="md">
            <Text fontWeight="semibold">
              {culturalPlace.status === 'CLOSED_DOWN'
                ? 'Centro cultural clausurado'
                : culturalPlace.status === 'TEMPORAL_CLOSED_DOWN'
                  ? 'Centro cultural cerrado temporalmente'
                  : 'Este centro cultural no está disponible actualmente.'}
            </Text>
          </Alert.Root>
        )}

        <Grid templateColumns={{ base: '1fr', xl: '2fr 1fr' }} gap={6}>
          <VStack gap={2} align="stretch">
            <About longDescription={culturalPlace.description} />
            <Features characteristics={culturalPlace.characteristics} />
            <Hours
              openingHours={{
                monday: culturalPlace.schedules.monday.closed
                  ? 'Cerrado'
                  : `${culturalPlace.schedules.monday.open} - ${culturalPlace.schedules.monday.close}`,
                tuesday: culturalPlace.schedules.tuesday.closed
                  ? 'Cerrado'
                  : `${culturalPlace.schedules.tuesday.open} - ${culturalPlace.schedules.tuesday.close}`,
                wednesday: culturalPlace.schedules.wednesday.closed
                  ? 'Cerrado'
                  : `${culturalPlace.schedules.wednesday.open} - ${culturalPlace.schedules.wednesday.close}`,
                thursday: culturalPlace.schedules.thursday.closed
                  ? 'Cerrado'
                  : `${culturalPlace.schedules.thursday.open} - ${culturalPlace.schedules.thursday.close}`,
                friday: culturalPlace.schedules.friday.closed
                  ? 'Cerrado'
                  : `${culturalPlace.schedules.friday.open} - ${culturalPlace.schedules.friday.close}`,
                saturday: culturalPlace.schedules.saturday.closed
                  ? 'Cerrado'
                  : `${culturalPlace.schedules.saturday.open} - ${culturalPlace.schedules.saturday.close}`,
                sunday: culturalPlace.schedules.sunday.closed
                  ? 'Cerrado'
                  : `${culturalPlace.schedules.sunday.open} - ${culturalPlace.schedules.sunday.close}`,
              }}
            />
          </VStack>

          <VStack gap={2} align="stretch">
            <Contact
              address={culturalPlace.contact.address}
              phone={culturalPlace.contact.phone}
              website={culturalPlace.contact.website}
              email={culturalPlace.contact.email}
            />
            <NextEvents />
            <Maps
              cardTitle="Ubicación del evento"
              coordinates={{
                lat: culturalPlace.contact.coordinates.lat,
                lng: culturalPlace.contact.coordinates.lng,
                description: culturalPlace.name,
              }}
            />
          </VStack>
        </Grid>
      </Box>
    </Stack>
  );
};
