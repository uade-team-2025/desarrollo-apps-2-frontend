import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { toaster } from '../../core/components/ui/toaster';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Extract token from URL - for Google auth, backend already validated the user
        let token = searchParams.get('token');

        // Fallback: extract directly from window.location if searchParams fails
        if (!token) {
          const urlParams = new URLSearchParams(window.location.search);
          token = urlParams.get('token');
        }

        // Another fallback: parse from window.location.search directly
        if (!token) {
          const match = window.location.search.match(/[?&]token=([^&]+)/);
          if (match && match[1]) {
            token = decodeURIComponent(match[1]);
          }
        }

        if (!token) {
          console.error('Token no encontrado en la URL');
          toaster.create({
            title: 'Error de autenticación',
            description: 'No se encontró el token en la URL',
            type: 'error',
          });
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          return;
        }

        // Trim any whitespace
        token = token.trim();

        // For Google auth: just save the token
        // The auth context will validate and decode it when the app loads
        // Store token in localStorage directly
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_isLogged', 'true');

        // Redirect to home - auth context will handle validation on mount
        window.location.href = '/';
      } catch (err) {
        console.error('Error during authentication callback:', err);
        toaster.create({
          title: 'Error de autenticación',
          description:
            err instanceof Error
              ? err.message
              : 'Hubo un problema al procesar el token de autenticación',
          type: 'error',
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [searchParams]);

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
