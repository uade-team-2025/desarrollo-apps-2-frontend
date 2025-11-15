import { Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { FaTicketAlt } from 'react-icons/fa';
import { useCart } from '../../../core/contexts/cart-context';

interface TicketType {
  type: string;
  price: number;
  initialQuantity: number;
  soldQuantity: number;
  isActive: boolean;
}

interface EventTicketsProps {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  culturalPlaceName: string;
  tickets: TicketType[];
  isLogged: boolean;
  isEventActive: boolean;
}

export const EventTickets = ({
  eventId,
  eventName,
  eventDate,
  eventTime,
  culturalPlaceName,
  tickets,
  isLogged,
  isEventActive,
}: EventTicketsProps) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const availableTickets = tickets.filter(
    (ticket) => ticket.isActive && ticket.soldQuantity < ticket.initialQuantity
  );

  const handleAddToCart = (ticket: TicketType) => {
    if (!isEventActive) {
      return;
    }
    addToCart({
      eventId,
      eventName,
      eventDate,
      eventTime,
      culturalPlaceName,
      ticketType: ticket.type,
      price: ticket.price,
    });
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
      <HStack gap={2} mb={4}>
        <Box as={FaTicketAlt} color="brand.500" />
        <Text fontSize="xl" fontWeight="bold" color="brand.700">
          Entradas Disponibles
        </Text>
      </HStack>

      {availableTickets.length === 0 ? (
        <Text color="gray.500" textAlign="center" py={4}>
          No hay entradas disponibles
        </Text>
      ) : (
        <VStack gap={3} align="stretch">
          {availableTickets.map((ticket) => {
            const inCartQuantity = getItemQuantity(eventId, ticket.type);
            const availableQuantity =
              ticket.initialQuantity - ticket.soldQuantity;

            return (
              <Box
                key={ticket.type}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
                _hover={{ borderColor: 'brand.300', boxShadow: 'sm' }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text
                      fontWeight="semibold"
                      textTransform="capitalize"
                      fontSize="lg"
                    >
                      {ticket.type}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Disponibles: {availableQuantity}
                    </Text>
                    {inCartQuantity > 0 && (
                      <Text fontSize="sm" color="green.600" fontWeight="medium">
                        En carrito: {inCartQuantity}
                      </Text>
                    )}
                  </Box>
                  <HStack gap={3}>
                    <Text fontSize="xl" fontWeight="bold" color="brand.600">
                      ${ticket.price}
                    </Text>

                    <Button
                      disabled={!isLogged || !isEventActive}
                      colorPalette="brand"
                      size="md"
                      onClick={() => handleAddToCart(ticket)}
                      _hover={{ transform: 'translateY(-1px)' }}
                      transition="all 0.2s"
                    >
                      {isInCart(eventId, ticket.type)
                        ? 'Agregar más'
                        : 'Agregar al carrito'}
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            );
          })}
        </VStack>
      )}
    </Box>
  );
};
