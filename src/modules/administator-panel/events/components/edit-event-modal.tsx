import {
  Box,
  Button,
  Dialog,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../../../core/contexts/auth-context';
import { toaster } from '../../../../core/components/ui/toaster';
import { useGetDataFromBackend } from '../../../../core/hooks/useGetDataFromBackend';
import { formatIsoDate } from '../../../../core/utils/date.utils';
import { updateEvent, type Event, type EventFormData } from '../events.api';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated: () => void;
  event: Event;
}

export const EditEventModal = ({
  isOpen,
  onClose,
  onEventUpdated,
  event,
}: EditEventModalProps) => {
  const { isSupervisor } = useAuth();
  const { watch, register, control, handleSubmit, reset } =
    useForm<EventFormData>({
      defaultValues: {
        culturalPlaceId:
          typeof event.culturalPlaceId === 'object'
            ? event.culturalPlaceId._id
            : event.culturalPlaceId,
        name: event.name,
        description: event.description,
        date: formatIsoDate(event.date, { utc: true, format: 'YYYY-MM-DD' }),
        time: event.time,
        isActive: event.isActive,
        ticketTypes: event.ticketTypes,
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ticketTypes',
  });

  const { loading: updatingPlace, callback: onUpdateEvent } =
    useGetDataFromBackend<Event>({
      url: updateEvent(event._id),
      options: { method: 'PUT', body: JSON.stringify(watch()) },
      onSuccess: () => {
        toaster.create({
          type: 'success',
          title: '¡Listo!',
          description: 'El evento ha sido actualizado correctamente.',
        });

        onEventUpdated();
        handleClose();
      },
    });

  const addTicketType = () => {
    append({
      type: '',
      price: 0,
      initialQuantity: 0,
      soldQuantity: 0,
      isActive: true,
    });
  };

  const removeTicketType = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      size="lg"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          as={'form'}
          onSubmit={handleSubmit(onUpdateEvent)}
          maxW="4xl"
          w="90vw"
        >
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title fontSize="xl" fontWeight="bold">
              Editar Evento
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <VStack gap={6} align="stretch">
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Lugar Cultural
                </Text>
                <Box
                  p={3}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Text>
                    {typeof event.culturalPlaceId === 'object'
                      ? event.culturalPlaceId.name
                      : 'Lugar no especificado'}
                  </Text>
                </Box>
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2}>
                  Nombre del Evento *
                </Text>
                <Input
                  {...register('name', { required: true })}
                  placeholder="Ej: Concierto de Jazz"
                />
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2}>
                  Descripción
                </Text>
                <Textarea
                  {...register('description')}
                  placeholder="Descripción del evento..."
                  rows={3}
                />
              </Box>

              <HStack gap={4}>
                <Box flex="1">
                  <Text fontWeight="medium" mb={2}>
                    Fecha *
                  </Text>
                  <Input
                    type="date"
                    {...register('date', { required: true })}
                  />
                </Box>

                <Box flex="1">
                  <Text fontWeight="medium" mb={2}>
                    Hora *
                  </Text>
                  <Input
                    type="time"
                    {...register('time', { required: true })}
                  />
                </Box>
              </HStack>

              <Box>
                <Text fontWeight="medium" mb={2}>
                  Estado
                </Text>
                <select
                  {...register('isActive')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                  }}
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </Box>

              <Box>
                <HStack justifyContent="space-between" mb={3}>
                  <Text fontWeight="medium">Tipos de Entrada</Text>
                  <Button
                    size="sm"
                    colorPalette="green"
                    variant="outline"
                    onClick={addTicketType}
                    type="button"
                    disabled={isSupervisor}
                  >
                    <FiPlus style={{ marginRight: '4px' }} />
                    Agregar Tipo
                  </Button>
                </HStack>

                <Stack gap={4}>
                  {fields.map((field, index) => (
                    <Box
                      key={field.id}
                      p={4}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                    >
                      <HStack justifyContent="space-between" mb={3}>
                        <Text fontSize="sm" fontWeight="medium">
                          Tipo de Entrada #{index + 1}
                        </Text>
                        {fields.length > 1 && (
                          <IconButton
                            size="sm"
                            colorPalette="red"
                            variant="outline"
                            aria-label="Eliminar tipo"
                            onClick={() => removeTicketType(index)}
                            type="button"
                            disabled={isSupervisor}
                          >
                            <FiTrash2 />
                          </IconButton>
                        )}
                      </HStack>

                      <Stack gap={3}>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={1}>
                            Tipo
                          </Text>
                          <select
                            {...register(`ticketTypes.${index}.type`, {
                              required: true,
                            })}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #E2E8F0',
                              borderRadius: '6px',
                              backgroundColor: 'white',
                            }}
                          >
                            <option value="">Seleccionar tipo</option>
                            <option value="general">General</option>
                            <option value="vip">VIP</option>
                            <option value="jubilados">Jubilados</option>
                            <option value="estudiantes">Estudiantes</option>
                          </select>
                        </Box>

                        <HStack gap={2}>
                          <Box flex="1">
                            <Text fontSize="sm" fontWeight="medium" mb={1}>
                              Precio ($)
                            </Text>
                            <Input
                              type="number"
                              {...register(`ticketTypes.${index}.price`, {
                                required: true,
                                min: 0,
                                valueAsNumber: true,
                              })}
                              min="0"
                            />
                          </Box>

                          <Box flex="1">
                            <Text fontSize="sm" fontWeight="medium" mb={1}>
                              Cantidad Inicial
                            </Text>
                            <Input
                              type="number"
                              {...register(
                                `ticketTypes.${index}.initialQuantity`,
                                {
                                  required: true,
                                  min: 1,
                                  valueAsNumber: true,
                                }
                              )}
                              min="1"
                            />
                          </Box>

                          <Box flex="1">
                            <Text fontSize="sm" fontWeight="medium" mb={1}>
                              Vendidos
                            </Text>
                            <Input
                              type="number"
                              {...register(
                                `ticketTypes.${index}.soldQuantity`,
                                {
                                  valueAsNumber: true,
                                }
                              )}
                              min="0"
                            />
                          </Box>
                        </HStack>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </VStack>
          </Dialog.Body>

          <Dialog.Footer>
            <HStack gap={3}>
              <Button variant="outline" onClick={handleClose} type="button">
                Cancelar
              </Button>
              <Button
                colorPalette="green"
                type="submit"
                loading={updatingPlace}
                disabled={updatingPlace || isSupervisor}
              >
                {updatingPlace ? 'Actualizando...' : 'Actualizar Evento'}
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
