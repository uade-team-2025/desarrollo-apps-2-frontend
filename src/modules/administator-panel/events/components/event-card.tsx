import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiClock,
  FiEdit,
  FiMapPin,
  FiTrash2,
} from 'react-icons/fi';
import { useAuth } from '../../../../core/contexts/auth-context';
import { useGetDataFromBackend } from '../../../../core/hooks/useGetDataFromBackend';
import type { Event } from '../events.api';
import { deleteEvent } from '../events.api';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDeleted: () => void;
}

export const EventCard = ({ event, onEdit, onDeleted }: EventCardProps) => {
  const { isSupervisor } = useAuth();
  const { loading: deleteLoading, callback: onDeleteEvent } =
    useGetDataFromBackend({
      url: deleteEvent(event._id),
      options: { method: 'DELETE' },
    });

  const handleDelete = async () => {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar este evento?'
    );
    if (confirmed) {
      try {
        await onDeleteEvent();
        onDeleted();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <Card.Root>
      <Image
        src={event.culturalPlaceId.image}
        alt={event.culturalPlaceId.name}
        h="200px"
        w="100%"
        objectFit="cover"
      />

      <Card.Body p={4}>
        <Stack gap={3}>
          <HStack justifyContent="space-between">
            <Badge
              colorPalette={event.isActive ? 'green' : 'red'}
              variant="solid"
            >
              {event.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
            <HStack>
              <Button
                size="sm"
                colorPalette="green"
                variant="outline"
                onClick={() => onEdit(event)}
                disabled={isSupervisor}
              >
                <Icon as={FiEdit} />
              </Button>
              <Button
                size="sm"
                colorPalette="red"
                variant="outline"
                onClick={handleDelete}
                loading={deleteLoading}
                disabled={isSupervisor}
              >
                <Icon as={FiTrash2} />
              </Button>
            </HStack>
          </HStack>

          <Text fontSize="lg" fontWeight="bold">
            {event.name}
          </Text>

          {event.description && (
            <Text fontSize="sm" color="gray.600">
              {event.description}
            </Text>
          )}

          <Stack gap={2}>
            <HStack>
              <Icon as={FiCalendar} color="gray.400" size="sm" />
              <Text fontSize="sm" color="gray.600">
                {new Date(event.date).toLocaleDateString('es-ES')}
              </Text>
            </HStack>

            <HStack>
              <Icon as={FiClock} color="gray.400" size="sm" />
              <Text fontSize="sm" color="gray.600">
                {event.time}
              </Text>
            </HStack>

            <HStack>
              <Icon as={FiMapPin} color="gray.400" size="sm" />
              <Text fontSize="sm" color="gray.600">
                {event.culturalPlaceId.name}
              </Text>
            </HStack>
          </Stack>

          {event.ticketTypes && event.ticketTypes.length > 0 && (
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Tipos de entrada:
              </Text>
              <Stack direction="row" wrap="wrap" gap={1}>
                {event.ticketTypes.slice(0, 3).map((ticket, index) => (
                  <Badge
                    key={index}
                    size="sm"
                    variant="outline"
                    colorPalette="gray"
                  >
                    {ticket.type} ${ticket.price}
                  </Badge>
                ))}
                {event.ticketTypes.length > 3 && (
                  <Badge size="sm" variant="outline" colorPalette="gray">
                    +{event.ticketTypes.length - 3}
                  </Badge>
                )}
              </Stack>
            </Box>
          )}

          <HStack justifyContent="space-between">
            <Text fontSize="sm" color="gray.500">
              Disponibles:
            </Text>
            <Text fontSize="sm" fontWeight="bold" color="green.600">
              {event.ticketTypes.reduce(
                (total, ticket) =>
                  total + (ticket.initialQuantity - ticket.soldQuantity),
                0
              )}
            </Text>
          </HStack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
