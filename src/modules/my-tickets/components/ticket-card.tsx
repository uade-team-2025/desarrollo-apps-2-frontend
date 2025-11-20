import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { MdConfirmationNumber, MdQrCode } from 'react-icons/md';
import { Link } from 'react-router';
import { formatIsoDate } from '../../../core/utils/date.utils';
import type { PopulatedEvent, Ticket } from '../my-tickets.api';
import {
  getStatusColor,
  getStatusText,
  getTicketTypeText,
  isPopulatedEvent,
} from '../my-tickets.utils';
import { QRModal } from './qr-modal';

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard = ({ ticket }: TicketCardProps) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const isPopulated = isPopulatedEvent(ticket.eventId);
  let eventData: PopulatedEvent | null = null;
  let isExpired = false;
  let eventImage = '/placeholder-image.jpg';

  if (isPopulated) {
    eventData = ticket.eventId as PopulatedEvent;
    isExpired = new Date(eventData.date) < new Date();
    eventImage =
      eventData.image ||
      eventData.culturalPlaceId?.image ||
      '/placeholder-image.jpg';
  }

  return (
    <>
      <Card.Root
        overflow="hidden"
        bg="white"
        shadow="lg"
        borderRadius="xl"
        transition="all 0.2s"
        _hover={{
          shadow: 'xl',
          transform: 'translateY(-2px)',
        }}
        border="1px solid"
        borderColor="gray.200"
      >
        {isPopulated ? (
          <Box position="relative" height="180px" overflow="hidden">
            <Image
              src={eventImage}
              alt={isPopulated ? eventData!.name : 'Evento'}
              objectFit="cover"
              width="100%"
              height="100%"
            />

            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgGradient="linear(to-b, transparent 0%, rgba(0,0,0,0.7) 100%)"
            />

            <Box
              position="absolute"
              top={3}
              left={3}
              bg="white"
              borderRadius="full"
              p={2}
              boxShadow="md"
            >
              <MdConfirmationNumber size={16} color="#2D3748" />
            </Box>

            <Badge
              position="absolute"
              top={3}
              right={3}
              colorPalette={
                ticket.status === 'active' && eventData && eventData.isActive === false
                  ? 'red'
                  : getStatusColor(ticket.status)
              }
              variant="solid"
              size="sm"
              px={3}
              py={1}
            >
              {getStatusText(ticket.status, eventData)}
            </Badge>

            <Box position="absolute" bottom={3} left={3} right={3}>
              <Text
                color="white"
                fontSize="xs"
                fontWeight="medium"
                opacity={0.9}
              >
                TICKET #{ticket._id.slice(-6).toUpperCase()}
              </Text>
              <Heading
                color="white"
                size="sm"
                lineHeight="short"
                css={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {eventData!.name}
              </Heading>
            </Box>
          </Box>
        ) : (
          <Box
            bgGradient="linear(135deg, brand.500, brand.600)"
            p={4}
            position="relative"
          >
            <Flex justify="space-between" align="center">
              <VStack align="start" gap={1}>
                <Text
                  color="white"
                  fontSize="xs"
                  fontWeight="medium"
                  opacity={0.9}
                >
                  TICKET #{ticket._id.slice(-6).toUpperCase()}
                </Text>
                <Heading color="white" size="sm" lineHeight="short">
                  Evento Cultural
                </Heading>
              </VStack>
              <Badge
                colorPalette={
                  ticket.status === 'active' && eventData && eventData.isActive === false
                    ? 'red'
                    : getStatusColor(ticket.status)
                }
                variant="solid"
                size="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                {getStatusText(ticket.status, eventData)}
              </Badge>
            </Flex>

            <Box position="absolute" right={2} top={2} opacity={0.2}>
              <MdConfirmationNumber size={40} color="white" />
            </Box>
          </Box>
        )}

        <Card.Body p={5}>
          <VStack align="stretch" gap={4}>
            {isPopulated ? (
              <Stack gap={2}>
                <Flex align="center" gap={2} color="gray.600">
                  <FiMapPin size={14} />
                  <Text fontSize="sm" fontWeight="medium">
                    {eventData!.culturalPlaceId.name}
                  </Text>
                </Flex>
                <Flex align="center" gap={2} color="gray.600">
                  <FiCalendar size={14} />
                  <Text fontSize="sm">
                    {formatIsoDate(eventData!.date, { utc: true })}
                  </Text>
                </Flex>
                <Flex align="center" gap={2} color="gray.600">
                  <FiClock size={14} />
                  <Text fontSize="sm">
                    {formatIsoDate(eventData!.date, {
                      utc: true,
                    })}{' '}
                    {`${eventData!.time}hs`}
                  </Text>
                </Flex>
              </Stack>
            ) : (
              <Stack gap={3} width="100%">
                <Flex align="center" gap={2}>
                  <Box w={2} h={2} bg="brand.400" borderRadius="full" />
                  <Text fontSize="sm" color="gray.600">
                    ID del Evento: {String(ticket.eventId).slice(-8)}...
                  </Text>
                </Flex>

                <Flex align="center" gap={2}>
                  <Box w={2} h={2} bg="green.400" borderRadius="full" />
                  <Badge colorPalette="green" variant="subtle" size="sm">
                    {getTicketTypeText(ticket.ticketType)}
                  </Badge>
                </Flex>

                <Flex align="center" gap={2}>
                  <Box w={2} h={2} bg="purple.400" borderRadius="full" />
                  <Text fontSize="sm" color="gray.600">
                    Comprado:{' '}
                    {formatIsoDate(ticket.createdAt || ticket.purchaseDate, {
                      utc: true,
                    })}
                  </Text>
                </Flex>
              </Stack>
            )}

            <Flex
              justify="space-between"
              align="center"
              pt={2}
              borderTop="1px solid"
              borderColor="gray.100"
            >
              <VStack align="start" gap={1}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  {isPopulated ? 'TIPO DE ENTRADA' : 'PRECIO PAGADO'}
                </Text>
                {isPopulated ? (
                  <Badge colorPalette="brand" variant="subtle" size="sm">
                    {getTicketTypeText(ticket.ticketType)}
                  </Badge>
                ) : (
                  <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                    ${ticket.price.toLocaleString()}
                  </Text>
                )}
              </VStack>
              <VStack align="end" gap={1}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  PRECIO
                </Text>
                <Text
                  fontSize={isPopulated ? 'lg' : 'sm'}
                  fontWeight="bold"
                  color="brand.600"
                >
                  ${ticket.price.toLocaleString()}
                </Text>
              </VStack>
            </Flex>

            {ticket.status === 'active' && (
              <>
                {isPopulated && !isExpired ? (
                  <Flex gap={2} pt={2}>
                    <Link to={`/evento/${eventData!._id}`} style={{ flex: 1 }}>
                      <Button
                        size="sm"
                        variant="outline"
                        colorPalette="brand"
                        width="100%"
                      >
                        Ver Evento
                      </Button>
                    </Link>

                    {ticket.qrCode && (
                      <Button
                        size="sm"
                        colorPalette="brand"
                        onClick={() => setIsQRModalOpen(true)}
                      >
                        <MdQrCode />
                      </Button>
                    )}
                  </Flex>
                ) : (
                  <VStack gap={2}>
                    <Flex gap={2}>
                      <Button
                        size="sm"
                        disabled={!ticket.qrCode}
                        variant="outline"
                        colorPalette="brand"
                        borderRadius="full"
                        onClick={() => setIsQRModalOpen(true)}
                      >
                        <MdQrCode style={{ marginRight: 4 }} />
                        QR
                      </Button>
                    </Flex>
                  </VStack>
                )}
              </>
            )}

            {isExpired && ticket.status === 'active' && (
              <Box
                bg="red.50"
                p={3}
                borderRadius="md"
                border="1px solid"
                borderColor="red.200"
              >
                <Text
                  fontSize="xs"
                  color="red.600"
                  textAlign="center"
                  fontWeight="medium"
                >
                  ⏰ Este evento ya finalizó
                </Text>
              </Box>
            )}
          </VStack>
        </Card.Body>
      </Card.Root>

      {ticket.qrCode && (
        <QRModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          qrCode={ticket.qrCode}
          status={ticket.status}
        />
      )}
    </>
  );
};
