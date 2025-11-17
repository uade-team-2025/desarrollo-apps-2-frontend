import {
  Box,
  Button,
  Dialog,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useId } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { toaster } from '../../../../core/components/ui/toaster';
import { useGetDataFromBackend } from '../../../../core/hooks/useGetDataFromBackend';
import { createCulturalPlace } from '../cultural-places.api';

interface CulturalPlaceFormData {
  name: string;
  description: string;
  category: string;
  characteristics: { value: string }[];
  schedules: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  contact: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    phone: string;
    website: string;
    email: string;
  };
  image: string;
  rating: number;
  isActive: boolean;
  color: string;
}

interface CreateCulturalPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceCreated: () => void;
}

export const CreateCulturalPlaceModal = ({
  isOpen,
  onClose,
  onPlaceCreated,
}: CreateCulturalPlaceModalProps) => {
  const id = useId();
  const { register, control, handleSubmit, reset, watch } =
    useForm<CulturalPlaceFormData>({
      defaultValues: {
        name: '',
        description: '',
        category: '',
        characteristics: [{ value: '' }],
        schedules: {
          monday: { open: '10:00', close: '18:00', closed: false },
          tuesday: { open: '10:00', close: '18:00', closed: false },
          wednesday: { open: '10:00', close: '18:00', closed: false },
          thursday: { open: '10:00', close: '18:00', closed: false },
          friday: { open: '10:00', close: '18:00', closed: false },
          saturday: { open: '10:00', close: '18:00', closed: false },
          sunday: { open: '10:00', close: '18:00', closed: false },
        },
        contact: {
          address: '',
          coordinates: {
            lat: -34.6037,
            lng: -58.3816,
          },
          phone: '',
          website: '',
          email: '',
        },
        image: '',
        rating: 4.0,
        isActive: true,
        color: '#FF6B6B',
      },
    });

  const {
    fields: characteristicFields,
    append: appendCharacteristic,
    remove: removeCharacteristic,
  } = useFieldArray({
    control,
    name: 'characteristics',
  });

  const { loading: creatingPlace, callback: onCreatePlace } =
    useGetDataFromBackend({
      url: createCulturalPlace(),
      options: {
        method: 'POST',
        body: JSON.stringify({
          ...watch(),
          characteristics: watch()
            .characteristics.map((char) => char.value)
            .filter((value) => value.trim() !== ''),
        }),
      },
      onSuccess: () => {
        toaster.create({
          type: 'success',
          title: '¡Listo!',
          description: 'El lugar cultural ha sido creado correctamente.',
        });
        reset();
        onPlaceCreated();
        onClose();
      },
    });

  const onSubmit = () => {
    onCreatePlace();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const addCharacteristicItem = () => {
    appendCharacteristic({ value: '' });
  };

  const removeCharacteristicItem = (index: number) => {
    if (characteristicFields.length > 1) {
      removeCharacteristic(index);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose} size={'xl'}>
      <Dialog.Trigger />
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>Crear Lugar Cultural</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body maxH="80vh" overflowY="auto">
            <form onSubmit={handleSubmit(onSubmit)} id={id}>
              <Stack gap={6} px={2} py={4}>
                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.700">
                    Información Básica
                  </Text>
                  <Grid
                    templateColumns={{ base: '1fr', md: '1fr 1fr' }}
                    gap={4}
                  >
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                      <Text
                        fontWeight="semibold"
                        mb={2}
                        color="gray.700"
                        fontSize="sm"
                      >
                        Nombre del Lugar *
                      </Text>
                      <Input
                        {...register('name', { required: true })}
                        placeholder="Ej: Museo de Arte Moderno"
                        bg="white"
                      />
                    </GridItem>

                    <GridItem colSpan={{ base: 1, md: 2 }}>
                      <Text
                        fontWeight="semibold"
                        mb={2}
                        color="gray.700"
                        fontSize="sm"
                      >
                        Descripción
                      </Text>
                      <Textarea
                        {...register('description')}
                        placeholder="Descripción del lugar cultural..."
                        rows={4}
                        bg="white"
                        resize="vertical"
                      />
                    </GridItem>

                    <GridItem>
                      <Text
                        fontWeight="semibold"
                        mb={2}
                        color="gray.700"
                        fontSize="sm"
                      >
                        Categoría *
                      </Text>
                      <select
                        {...register('category', { required: true })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          fontSize: '14px',
                        }}
                      >
                        <option value="">Selecciona una categoría</option>
                        <option value="Festival verde">Festival verde</option>
                        <option value="Centro Cultural">Centro Cultural</option>
                        <option value="Museo">Museo</option>
                        <option value="Teatro">Teatro</option>
                        <option value="Biblioteca">Biblioteca</option>
                        <option value="Galería">Galería</option>
                        <option value="Cine">Cine</option>
                        <option value="Auditorio">Auditorio</option>
                      </select>
                    </GridItem>

                    <GridItem>
                      <Text
                        fontWeight="semibold"
                        mb={2}
                        color="gray.700"
                        fontSize="sm"
                      >
                        Rating (1-5)
                      </Text>
                      <Input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        {...register('rating', {
                          valueAsNumber: true,
                          min: 1,
                          max: 5,
                        })}
                        placeholder="4.5"
                        bg="white"
                      />
                    </GridItem>
                  </Grid>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.700">
                    Apariencia
                  </Text>
                  <Grid
                    templateColumns={{ base: '1fr', md: '1fr 4fr' }}
                    gap={4}
                  >
                    <GridItem>
                      <Text
                        fontWeight="semibold"
                        mb={2}
                        color="gray.700"
                        fontSize="sm"
                      >
                        Color del Tema
                      </Text>
                      <Input
                        {...register('color')}
                        type="color"
                        placeholder="#FF6B6B"
                        h={10}
                        bg="white"
                        p={0}
                      />
                    </GridItem>

                    <GridItem>
                      <Text
                        fontWeight="semibold"
                        mb={2}
                        color="gray.700"
                        fontSize="sm"
                      >
                        URL de la Imagen
                      </Text>
                      <Input
                        {...register('image')}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        type="url"
                        bg="white"
                      />
                    </GridItem>
                  </Grid>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.700">
                    Información de Contacto
                  </Text>
                  <Grid
                    templateColumns={{ base: '1fr', md: '1fr 1fr' }}
                    gap={4}
                  >
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                      <Text
                        fontWeight="semibold"
                        mb={2}
                        color="gray.700"
                        fontSize="sm"
                      >
                        Dirección *
                      </Text>
                      <Input
                        {...register('contact.address', { required: true })}
                        placeholder="Ej: Av. Corrientes 123, Buenos Aires"
                        bg="white"
                      />
                    </GridItem>

                    <GridItem>
                      <Text
                        fontWeight="semibold"
                        mb={2}
                        color="gray.700"
                        fontSize="sm"
                      >
                        Latitud *
                      </Text>
                      <Input
                        type="number"
                        step="any"
                        {...register('contact.coordinates.lat', {
                          required: true,
                          valueAsNumber: true,
                        })}
                        placeholder="Ej: -34.6037"
                        bg="white"
                      />
                    </GridItem>

                    <GridItem>
                      <Text
                        fontWeight="semibold"
                        mb={2}
                        color="gray.700"
                        fontSize="sm"
                      >
                        Longitud *
                      </Text>
                      <Input
                        type="number"
                        step="any"
                        {...register('contact.coordinates.lng', {
                          required: true,
                          valueAsNumber: true,
                        })}
                        placeholder="Ej: -58.3816"
                        bg="white"
                      />
                    </GridItem>

                    <GridItem>
                      <Text
                        fontWeight="semibold"
                        mb={2}
                        color="gray.700"
                        fontSize="sm"
                      >
                        Teléfono
                      </Text>
                      <Input
                        {...register('contact.phone')}
                        placeholder="Ej: +54 11 1234-5678"
                        bg="white"
                      />
                    </GridItem>

                    <GridItem>
                      <Text
                        fontWeight="semibold"
                        mb={2}
                        color="gray.700"
                        fontSize="sm"
                      >
                        Sitio Web
                      </Text>
                      <Input
                        {...register('contact.website')}
                        placeholder="Ej: https://www.ejemplo.com"
                        type="url"
                        bg="white"
                      />
                    </GridItem>

                    <GridItem>
                      <Text
                        fontWeight="semibold"
                        mb={2}
                        color="gray.700"
                        fontSize="sm"
                      >
                        Email
                      </Text>
                      <Input
                        {...register('contact.email')}
                        placeholder="Ej: contacto@ejemplo.com"
                        type="email"
                        bg="white"
                      />
                    </GridItem>
                  </Grid>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.700">
                    Horarios de Atención
                  </Text>
                  <Stack gap={4}>
                    <Box
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <Grid
                        templateColumns={{
                          base: '1fr',
                          sm: '120px 1fr 1fr 100px',
                          md: '140px 1fr 1fr 120px',
                        }}
                        gap={4}
                        alignItems="center"
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.700"
                        >
                          Lunes
                        </Text>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Apertura
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.monday.open')}
                          />
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Cierre
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.monday.close')}
                          />
                        </Box>
                        <Box textAlign="center">
                          <Text fontSize="xs" color="gray.600" mb={2}>
                            Cerrado
                          </Text>
                          <input
                            type="checkbox"
                            {...register('schedules.monday.closed')}
                            style={{ width: '16px', height: '16px' }}
                          />
                        </Box>
                      </Grid>
                    </Box>

                    <Box
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <Grid
                        templateColumns={{
                          base: '1fr',
                          sm: '120px 1fr 1fr 100px',
                          md: '140px 1fr 1fr 120px',
                        }}
                        gap={4}
                        alignItems="center"
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.700"
                        >
                          Martes
                        </Text>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Apertura
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.tuesday.open')}
                          />
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Cierre
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.tuesday.close')}
                          />
                        </Box>
                        <Box textAlign="center">
                          <Text fontSize="xs" color="gray.600" mb={2}>
                            Cerrado
                          </Text>
                          <input
                            type="checkbox"
                            {...register('schedules.tuesday.closed')}
                            style={{ width: '16px', height: '16px' }}
                          />
                        </Box>
                      </Grid>
                    </Box>

                    <Box
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <Grid
                        templateColumns={{
                          base: '1fr',
                          sm: '120px 1fr 1fr 100px',
                          md: '140px 1fr 1fr 120px',
                        }}
                        gap={4}
                        alignItems="center"
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.700"
                        >
                          Miércoles
                        </Text>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Apertura
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.wednesday.open')}
                          />
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Cierre
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.wednesday.close')}
                          />
                        </Box>
                        <Box textAlign="center">
                          <Text fontSize="xs" color="gray.600" mb={2}>
                            Cerrado
                          </Text>
                          <input
                            type="checkbox"
                            {...register('schedules.wednesday.closed')}
                            style={{ width: '16px', height: '16px' }}
                          />
                        </Box>
                      </Grid>
                    </Box>

                    <Box
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <Grid
                        templateColumns={{
                          base: '1fr',
                          sm: '120px 1fr 1fr 100px',
                          md: '140px 1fr 1fr 120px',
                        }}
                        gap={4}
                        alignItems="center"
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.700"
                        >
                          Jueves
                        </Text>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Apertura
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.thursday.open')}
                          />
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Cierre
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.thursday.close')}
                          />
                        </Box>
                        <Box textAlign="center">
                          <Text fontSize="xs" color="gray.600" mb={2}>
                            Cerrado
                          </Text>
                          <input
                            type="checkbox"
                            {...register('schedules.thursday.closed')}
                            style={{ width: '16px', height: '16px' }}
                          />
                        </Box>
                      </Grid>
                    </Box>

                    <Box
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <Grid
                        templateColumns={{
                          base: '1fr',
                          sm: '120px 1fr 1fr 100px',
                          md: '140px 1fr 1fr 120px',
                        }}
                        gap={4}
                        alignItems="center"
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.700"
                        >
                          Viernes
                        </Text>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Apertura
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.friday.open')}
                          />
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Cierre
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.friday.close')}
                          />
                        </Box>
                        <Box textAlign="center">
                          <Text fontSize="xs" color="gray.600" mb={2}>
                            Cerrado
                          </Text>
                          <input
                            type="checkbox"
                            {...register('schedules.friday.closed')}
                            style={{ width: '16px', height: '16px' }}
                          />
                        </Box>
                      </Grid>
                    </Box>

                    <Box
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <Grid
                        templateColumns={{
                          base: '1fr',
                          sm: '120px 1fr 1fr 100px',
                          md: '140px 1fr 1fr 120px',
                        }}
                        gap={4}
                        alignItems="center"
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.700"
                        >
                          Sábado
                        </Text>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Apertura
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.saturday.open')}
                          />
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Cierre
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.saturday.close')}
                          />
                        </Box>
                        <Box textAlign="center">
                          <Text fontSize="xs" color="gray.600" mb={2}>
                            Cerrado
                          </Text>
                          <input
                            type="checkbox"
                            {...register('schedules.saturday.closed')}
                            style={{ width: '16px', height: '16px' }}
                          />
                        </Box>
                      </Grid>
                    </Box>

                    <Box
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <Grid
                        templateColumns={{
                          base: '1fr',
                          sm: '120px 1fr 1fr 100px',
                          md: '140px 1fr 1fr 120px',
                        }}
                        gap={4}
                        alignItems="center"
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.700"
                        >
                          Domingo
                        </Text>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Apertura
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.sunday.open')}
                          />
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={1}>
                            Cierre
                          </Text>
                          <Input
                            type="time"
                            size="sm"
                            {...register('schedules.sunday.close')}
                          />
                        </Box>
                        <Box textAlign="center">
                          <Text fontSize="xs" color="gray.600" mb={2}>
                            Cerrado
                          </Text>
                          <input
                            type="checkbox"
                            {...register('schedules.sunday.closed')}
                            style={{ width: '16px', height: '16px' }}
                          />
                        </Box>
                      </Grid>
                    </Box>
                  </Stack>
                </Box>

                <Box>
                  <HStack justify="space-between" mb={4}>
                    <Text fontWeight="bold" fontSize="lg" color="gray.700">
                      Características
                    </Text>
                    <Button
                      onClick={addCharacteristicItem}
                      colorPalette="blue"
                      size="sm"
                    >
                      <FiPlus style={{ marginRight: '4px' }} />
                      Agregar
                    </Button>
                  </HStack>
                  <Stack gap={3}>
                    {characteristicFields.map((field, index) => (
                      <Box
                        key={field.id}
                        p={3}
                        bg="gray.50"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                      >
                        <HStack>
                          <Box flex="1">
                            <Input
                              {...register(`characteristics.${index}.value`)}
                              placeholder={`Característica ${index + 1}`}
                              bg="white"
                            />
                          </Box>
                          {characteristicFields.length > 1 && (
                            <IconButton
                              colorPalette="red"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCharacteristicItem(index)}
                            >
                              <FiTrash2 />
                            </IconButton>
                          )}
                        </HStack>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={4} color="gray.700">
                    Estado del Lugar
                  </Text>
                  <select
                    {...register('isActive')}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      fontSize: '14px',
                    }}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </Box>
              </Stack>
            </form>
          </Dialog.Body>
          <Dialog.Footer>
            <HStack gap={3} justify="end" w="full">
              <Button variant="outline" onClick={handleClose} type="button">
                Cancelar
              </Button>
              <Button
                colorPalette="blue"
                form={id}
                type="submit"
                loading={creatingPlace}
                loadingText={'Creando...'}
              >
                Crear Lugar Cultural
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
