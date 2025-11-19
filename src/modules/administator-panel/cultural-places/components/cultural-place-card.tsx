import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiEdit, FiGlobe, FiMapPin, FiPhone, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../../../core/contexts/auth-context';
import { useGetDataFromBackend } from '../../../../core/hooks/useGetDataFromBackend';
import { deleteCulturalPlace } from '../cultural-places.api';
import { getCategoryColor } from '../cultural-places.utils';
import { EditCulturalPlaceModal } from './edit-cultural-place-modal';

interface CulturalPlace {
  _id: string;
  name: string;
  description: string;
  category: string;
  characteristics: string[];
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
  isActive?: boolean;
}

interface CulturalPlaceCardProps {
  place: CulturalPlace;
  onDeleted: () => void;
}

export const CulturalPlaceCard = ({
  place,
  onDeleted,
}: CulturalPlaceCardProps) => {
  const { isSupervisor } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { loading: deleteLoading, callback: onDeleteCulturalPlace } =
    useGetDataFromBackend<any>({
      url: deleteCulturalPlace(place._id),
      options: { method: 'DELETE' },
    });

  const handleDeletePlace = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar este lugar cultural?')) {
      try {
        await onDeleteCulturalPlace();
        onDeleted();
      } catch (error) {
        console.error('Error deleting place:', error);
      }
    }
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.200"
      shadow="sm"
      overflow="hidden"
    >
      <Image
        src={place.image}
        alt={place.name}
        h="200px"
        w="100%"
        objectFit="cover"
      />

      <Box p={4}>
        <Stack gap={3}>
          <HStack justifyContent="space-between">
            <Badge
              colorPalette={getCategoryColor(place.category)}
              variant="solid"
            >
              {place.category}
            </Badge>
            <HStack>
              <Button
                size="sm"
                colorPalette="green"
                variant="outline"
                onClick={() => setIsEditModalOpen(true)}
                disabled={isSupervisor}
              >
                <Icon as={FiEdit} />
              </Button>
              <Button
                size="sm"
                colorPalette="red"
                variant="outline"
                onClick={handleDeletePlace}
                loading={deleteLoading}
                disabled={isSupervisor}
              >
                <Icon as={FiTrash2} />
              </Button>
            </HStack>
          </HStack>

          <Heading size="md">{place.name}</Heading>

          <Text fontSize="sm" color="gray.600">
            {place.description}
          </Text>

          <Stack gap={2}>
            <HStack>
              <Icon as={FiMapPin} color="gray.400" size="sm" />
              <Text fontSize="sm" color="gray.600">
                {place.contact.address}
              </Text>
            </HStack>

            {place.contact.phone && (
              <HStack>
                <Icon as={FiPhone} color="gray.400" size="sm" />
                <Text fontSize="sm" color="gray.600">
                  {place.contact.phone}
                </Text>
              </HStack>
            )}

            {place.contact.website && (
              <HStack>
                <Icon as={FiGlobe} color="gray.400" size="sm" />
                <Text fontSize="sm" color="green.600" textDecor="underline">
                  Sitio web
                </Text>
              </HStack>
            )}
          </Stack>

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              Características:
            </Text>
            <Stack direction="row" wrap="wrap" gap={1}>
              {place.characteristics.slice(0, 3).map((char, index) => (
                <Badge
                  key={index}
                  size="sm"
                  variant="outline"
                  colorPalette="gray"
                >
                  {char}
                </Badge>
              ))}
              {place.characteristics.length > 3 && (
                <Badge size="sm" variant="outline" colorPalette="gray">
                  +{place.characteristics.length - 3}
                </Badge>
              )}
            </Stack>
          </Box>

          <HStack justifyContent="space-between">
            <Text fontSize="sm" color="gray.500">
              Rating:
            </Text>
            <HStack>
              <Text fontSize="sm" fontWeight="bold" color="orange.600">
                {place.rating.toFixed(1)}
              </Text>
              <Text fontSize="sm" color="gray.400">
                / 5.0
              </Text>
            </HStack>
          </HStack>
        </Stack>
      </Box>

      <EditCulturalPlaceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onPlaceUpdated={onDeleted}
        place={place}
      />
    </Box>
  );
};
