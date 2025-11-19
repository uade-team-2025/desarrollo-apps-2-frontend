import { Button, Heading, HStack, Icon, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useAuth } from '../../../core/contexts/auth-context';
import { useGetDataFromBackend } from '../../../core/hooks/useGetDataFromBackend';
import { CreateEventModal } from './components/create-event-modal';
import { EditEventModal } from './components/edit-event-modal';
import { EventList } from './components/event-list';
import { getEvents, type Event } from './events.api';

export const AdminEvents = () => {
  const { isSupervisor } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const {
    data: events,
    loading,
    callback: fetchEvents,
  } = useGetDataFromBackend<Event[]>({
    url: getEvents(),
    options: { method: 'GET' },
    executeAutomatically: true,
  });

  const handleEventCreated = () => {
    fetchEvents();
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseEditModal = () => {
    setSelectedEvent(null);
  };

  const handleEventUpdated = () => {
    fetchEvents();
  };

  return (
    <Stack gap={6}>
      <HStack justifyContent="space-between">
        <Heading size="lg">Gestión de Eventos</Heading>
        <Button
          colorPalette="green"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isSupervisor}
        >
          <Icon as={FiPlus} mr={2} />
          Crear Evento
        </Button>
      </HStack>

      <EventList
        events={events ?? undefined}
        loading={loading}
        onEdit={handleEditEvent}
        onDeleted={fetchEvents}
      />

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEventCreated={handleEventCreated}
      />

      {selectedEvent && (
        <EditEventModal
          isOpen={!!selectedEvent}
          onClose={handleCloseEditModal}
          onEventUpdated={handleEventUpdated}
          event={selectedEvent}
        />
      )}
    </Stack>
  );
};
