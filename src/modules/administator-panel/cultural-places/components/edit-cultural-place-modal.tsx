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
import {
  updateCulturalPlace,
  type CulturalPlace,
} from '../cultural-places.api';

interface CulturalPlaceFormData {
  name: string;
  description: string;
  category: string;
  characteristics: { value: string }[];
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
}

interface EditCulturalPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceUpdated: () => void;
  place: CulturalPlace;
}

export const EditCulturalPlaceModal = ({
  isOpen,
  onClose,
  onPlaceUpdated,
  place,
}: EditCulturalPlaceModalProps) => {
  const id = useId();
  const { watch, register, control, handleSubmit, reset } =
    useForm<CulturalPlaceFormData>({
      defaultValues: {
        name: place.name,
        description: place.description,
        category: place.category,
        characteristics: place.characteristics.map((char) => ({ value: char })),
        contact: {
          address: place.contact.address,
          coordinates: {
            lat: place.contact.coordinates.lat,
            lng: place.contact.coordinates.lng,
          },
          phone: place.contact.phone,
          website: place.contact.website,
          email: place.contact.email,
        },
        image: place.image,
        rating: place.rating,
        isActive: place.isActive ?? true,
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

  const { loading: updatingPlace, callback: onUpdatePlace } =
    useGetDataFromBackend<CulturalPlace>({
      url: updateCulturalPlace(place._id),
      options: {
        method: 'PUT',
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
          description: 'El lugar cultural ha sido actualizado correctamente.',
        });

        onPlaceUpdated();
        handleClose();
      },
    });

  const handleClose = () => {
    reset();
    onClose();
  };

  const addCharacteristic = () => {
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
            <Dialog.Title>Editando {place.name}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <form onSubmit={handleSubmit(onUpdatePlace)} id={id}>
              <Box p={6}>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <Text fontWeight="medium" mb={2}>
                      Nombre del Lugar *
                    </Text>
                    <Input
                      {...register('name', { required: true })}
                      placeholder="Ej: Museo de Arte Moderno"
                    />
                  </GridItem>

                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <Text fontWeight="medium" mb={2}>
                      Descripción
                    </Text>
                    <Textarea
                      {...register('description')}
                      placeholder="Descripción del lugar cultural..."
                      rows={3}
                    />
                  </GridItem>

                  <GridItem>
                    <Text fontWeight="medium" mb={2}>
                      Categoría *
                    </Text>
                    <select
                      {...register('category', { required: true })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        backgroundColor: 'white',
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
                      <option value="Plaza">Plaza</option>
                    </select>
                  </GridItem>

                  <GridItem>
                    <Text fontWeight="medium" mb={2}>
                      URL de la Imagen
                    </Text>
                    <Input
                      {...register('image')}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      type="url"
                    />
                  </GridItem>

                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <Text fontWeight="medium" mb={4} fontSize="lg">
                      Información de Contacto
                    </Text>

                    <Grid
                      templateColumns={{ base: '1fr', md: '1fr 1fr' }}
                      gap={4}
                    >
                      <GridItem colSpan={{ base: 1, md: 2 }}>
                        <Text fontWeight="medium" mb={2}>
                          Dirección *
                        </Text>
                        <Input
                          {...register('contact.address', { required: true })}
                          placeholder="Ej: Av. Corrientes 123, Buenos Aires"
                        />
                      </GridItem>

                      <GridItem>
                        <Text fontWeight="medium" mb={2}>
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
                        />
                      </GridItem>

                      <GridItem>
                        <Text fontWeight="medium" mb={2}>
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
                        />
                      </GridItem>

                      <GridItem>
                        <Text fontWeight="medium" mb={2}>
                          Teléfono
                        </Text>
                        <Input
                          {...register('contact.phone')}
                          placeholder="Ej: +54 11 1234-5678"
                        />
                      </GridItem>

                      <GridItem>
                        <Text fontWeight="medium" mb={2}>
                          Sitio Web
                        </Text>
                        <Input
                          {...register('contact.website')}
                          placeholder="https://ejemplo.com"
                          type="url"
                        />
                      </GridItem>

                      <GridItem colSpan={{ base: 1, md: 2 }}>
                        <Text fontWeight="medium" mb={2}>
                          Email
                        </Text>
                        <Input
                          {...register('contact.email')}
                          placeholder="contacto@ejemplo.com"
                          type="email"
                        />
                      </GridItem>
                    </Grid>
                  </GridItem>

                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <HStack justifyContent="space-between" mb={3}>
                      <Text fontWeight="medium">Características</Text>
                      <Button
                        size="sm"
                        colorPalette="green"
                        variant="outline"
                        onClick={addCharacteristic}
                        type="button"
                      >
                        <FiPlus style={{ marginRight: '4px' }} />
                        Agregar Característica
                      </Button>
                    </HStack>

                    <Stack gap={2}>
                      {characteristicFields.map((field, index) => (
                        <HStack key={field.id}>
                          <Input
                            {...register(
                              `characteristics.${index}.value` as const
                            )}
                            placeholder="Ej: Visitas guiadas"
                          />
                          {characteristicFields.length > 1 && (
                            <IconButton
                              size="sm"
                              colorPalette="red"
                              variant="outline"
                              aria-label="Eliminar característica"
                              onClick={() => removeCharacteristicItem(index)}
                              type="button"
                            >
                              <FiTrash2 />
                            </IconButton>
                          )}
                        </HStack>
                      ))}
                    </Stack>
                  </GridItem>

                  <GridItem>
                    <Text fontWeight="medium" mb={2}>
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
                    />
                  </GridItem>

                  <GridItem>
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
                  </GridItem>
                </Grid>
              </Box>
            </form>
          </Dialog.Body>
          <Dialog.Footer>
            <HStack>
              <Button variant="outline" onClick={handleClose} type="button">
                Cancelar
              </Button>
              <Button
                colorPalette="green"
                form={id}
                type="submit"
                loading={updatingPlace}
                loadingText={'Actualizando...'}
              >
                Actualizar
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
