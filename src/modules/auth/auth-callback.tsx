import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../../core/contexts/auth-context';
import type { User } from '../../core/login/login.api';
import { base64UrlDecode } from './auth-callback.utils';

// Función para decodificar JWT sin verificar la firma (solo para Google)
const decodeJWT = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido');
    }

    const payload = parts[1];
    const decoded = JSON.parse(base64UrlDecode(payload));
    return decoded;
  } catch (error) {
    throw new Error('Error al decodificar el token JWT');
  }
};

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const token = searchParams.get('token');

        if (!token) {
          throw new Error('Token no encontrado en la URL');
        }

        const decodedToken = decodeJWT(token);

        const userData: User = {
          id: decodedToken.sub || decodedToken.id,
          name: decodedToken.name,
          email: decodedToken.email,
          role: decodedToken.role,
          createdAt: decodedToken.iat
            ? new Date(decodedToken.iat * 1000).toISOString()
            : undefined,
        };

        login(userData, token);
      } catch (err) {
        console.error('Error during authentication callback:', err);
      } finally {
        setTimeout(() => {
          window.location.href = '/';
        }, 0);
      }
    };

    handleAuthCallback();
  }, [searchParams, login]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      p={8}
    >
      <VStack gap={6} maxWidth="600px" w="full">
        <VStack gap={2}>
          <Spinner size="md" color="green.500" />
          <Text fontSize="sm" color="green.600" textAlign="center">
            Completando el proceso de login...
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default AuthCallback;
