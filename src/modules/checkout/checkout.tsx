import { Container, Flex, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toaster } from '../../core/components/ui/toaster';
import { useAuth } from '../../core/contexts/auth-context';
import { useCart } from '../../core/contexts/cart-context';
import { useConfetti } from '../../core/contexts/confetti-context';
import { useGetDataFromBackend } from '../../core/hooks/useGetDataFromBackend';
import { purchaseTicketUrl } from './checkout.api';
import type { PaymentData } from './checkout.utils';
import { isPaymentValid } from './checkout.utils';
import {
  CheckoutItem,
  OrderSummary,
  PageHeader,
  PaymentForm,
} from './components';

export const CheckoutPage = () => {
  const { user, isLogged } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const { triggerConfetti } = useConfetti();
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
  });

  const handleInputChange = (field: keyof PaymentData, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmPurchase = () => {
    // Solo validar pago si el total es mayor a $0
    if (totalPrice > 0 && !isPaymentValid(paymentData)) {
      toaster.create({
        title: 'Datos incompletos',
        description: 'Por favor complete todos los campos de pago',
        type: 'warning',
      });
      return;
    }
    purchaseMultipleTickets();
  };

  useEffect(() => {
    if (!isLogged || !user?.id) {
      toaster.create({
        title: 'Autenticación requerida',
        description: 'Debes iniciar sesión para realizar una compra',
        type: 'warning',
      });
      navigate('/login');
      return;
    }
  }, [isLogged, user?.id, navigate]);

  const { loading, callback: purchaseMultipleTickets } =
    useGetDataFromBackend<void>({
      url: purchaseTicketUrl(),
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          tickets: items.map((item) => ({
            eventId: item.eventId,
            userId: user!.id,
            type: item.ticketType,
            quantity: item.quantity,
          })),
        },
      },
      onSuccess: () => {
        triggerConfetti();
        toaster.create({
          title: 'Compra exitosa',
          description: 'Tus entradas han sido compradas con éxito',
          type: 'success',
        });
        clearCart();
      },
      onError: () => {
        toaster.create({
          title: 'Error en la compra',
          description:
            'Ocurrió un error al procesar tu compra. Por favor, intenta nuevamente.',
          type: 'error',
        });
      },
    });

  useEffect(() => {
    if (!isLogged) {
      navigate('/');
      return;
    }
    if (items.length === 0) {
      if (isLogged) {
        navigate('/mis-tickets');
      } else {
        navigate('/');
      }
      return;
    }
  }, [isLogged, items.length, navigate]);

  if (!isLogged || !user || items.length === 0) {
    return null;
  }

  return (
    <Container maxW="7xl">
      <Stack gap={10} py={6}>
        <PageHeader />

        <Flex
          gap={8}
          direction={{ base: 'column', lg: 'row' }}
          justify="center"
        >
          <Stack flex={1} maxW="600px" gap={6}>
            {items.map((item) => (
              <CheckoutItem key={item.tempId} item={item} />
            ))}

            {totalPrice > 0 && (
              <PaymentForm
                paymentData={paymentData}
                onPaymentDataChange={handleInputChange}
              />
            )}
          </Stack>

          <OrderSummary
            items={items}
            totalPrice={totalPrice}
            loading={loading}
            onConfirmPurchase={handleConfirmPurchase}
            onContinueShopping={() => navigate(-1)}
            isPaymentValid={totalPrice === 0 || isPaymentValid(paymentData)}
          />
        </Flex>
      </Stack>
    </Container>
  );
};
