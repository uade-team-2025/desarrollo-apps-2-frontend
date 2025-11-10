import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toaster } from '../../core/components/ui/toaster';
import { useAuth } from '../../core/contexts/auth-context';
import { decodeJWT, mapJWTToUser } from '../../core/utils/jwt.utils';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get token from URL - searchParams.get automatically URL-decodes
        let token = searchParams.get('token');

        if (!token) {
          throw new Error('Token no encontrado en la URL');
        }

        // Trim any whitespace that might have been introduced
        token = token.trim();

        // Validate token format (should have 3 parts separated by dots)
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.error('Token JWT inválido: número de partes incorrecto', {
            partsCount: parts.length,
            tokenLength: token.length,
            tokenPreview: token.substring(0, 50) + '...',
          });
          throw new Error(`Token JWT inválido: se esperaban 3 partes, se encontraron ${parts.length}`);
        }

        // Decode JWT using the centralized utility
        const decodedToken = decodeJWT(token);

        if (!decodedToken) {
          throw new Error('No se pudo decodificar el token JWT');
        }

        // Map decoded token to User format
        const userData = mapJWTToUser(decodedToken);

        // Add createdAt if available
        if (decodedToken.iat) {
          userData.createdAt = new Date(decodedToken.iat * 1000).toISOString();
        }

        login(userData, token);
      } catch (err) {
        console.error('Error during authentication callback:', err);
        toaster.create({
          title: 'Error de autenticación',
          description: err instanceof Error ? err.message : 'Hubo un problema al procesar el token de autenticación',
          type: 'error',
        });
      } finally {
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    };

    handleAuthCallback();
  }, [searchParams, login, navigate]);

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
