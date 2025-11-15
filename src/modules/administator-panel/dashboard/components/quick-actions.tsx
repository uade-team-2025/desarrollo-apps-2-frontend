import {
  Box,
  Button,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import {
  FiBarChart,
  FiCalendar,
  FiFileText,
  FiMapPin,
  FiUsers,
} from 'react-icons/fi';
import { useNavigate } from 'react-router';

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.200"
      shadow="sm"
    >
      <Stack gap={4}>
        <Heading size="md">Acciones Rápidas</Heading>
        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
          }}
          gap={4}
        >
          <Button
            colorPalette="green"
            size="lg"
            onClick={() => navigate('/admin/eventos')}
          >
            <Icon as={FiCalendar} mr={2} />
            Crear Evento
          </Button>
          <Button
            colorPalette="green"
            size="lg"
            onClick={() => navigate('/admin/espacios-culturales')}
          >
            <Icon as={FiMapPin} mr={2} />
            Agregar Lugar
          </Button>
          <Button
            colorPalette="purple"
            size="lg"
            onClick={() => navigate('/admin/tickets')}
          >
            <Icon as={FiFileText} mr={2} />
            Ver Tickets
          </Button>
          <Button
            colorPalette="orange"
            size="lg"
            onClick={() => navigate('/admin/usuarios')}
          >
            <Icon as={FiUsers} mr={2} />
            Gestionar Usuarios
          </Button>
          <Button
            colorPalette="orange"
            size="lg"
            onClick={() => navigate('/admin/reportes')}
          >
            <Icon as={FiBarChart} mr={2} />
            Ver Reportes
          </Button>
        </SimpleGrid>
      </Stack>
    </Box>
  );
};
