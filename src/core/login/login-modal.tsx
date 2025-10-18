import {
  Alert,
  Box,
  Button,
  Dialog,
  Field,
  Flex,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState } from 'react';
import boyStudyingAnimation from '../../animations/BoyStudyingScience.lottie';
import { API_BASE_URL } from '../config/api.config';
import { useAuth } from '../contexts/auth-context';
import { useGetDataFromBackend } from '../hooks/useGetDataFromBackend';
import { loginUser, type User } from './login.api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const { callback: loginCallback } = useGetDataFromBackend<User>({
    url: loginUser(),
    options: {
      method: 'POST',
      body: { email },
    },
    onSuccess: (user) => {
      login(user);
      onClose();
    },
  });

  const handleSubmit = async () => {
    setError(null);
    if (!email || !email.includes('@')) {
      setError('Ingresa un email válido');
      return;
    }

    setLoading(true);
    try {
      await loginCallback();
    } catch (err: any) {
      setError(err?.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW={{ base: '400px', md: '900px' }} p={4}>
          <Dialog.Header>
            <Dialog.Title>
              <Text
                fontWeight="bold"
                fontSize={{
                  base: 'md',
                  md: 'xl',
                }}
                color="brand.600"
              >
                Iniciar Sesión
              </Text>
            </Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Cerrar modal"
                onClick={onClose}
              >
                ✕
              </Button>
            </Dialog.CloseTrigger>
          </Dialog.Header>
          <Dialog.Body>
            <Box
              display={{ base: 'block', md: 'grid' }}
              gridTemplateColumns={{ md: '1fr 1fr' }}
              gap={6}
            >
              <Box display="flex" justifyContent="center" alignItems="center">
                <Box w="100%" h={{ base: '200px', md: '320px' }}>
                  <DotLottieReact
                    src={boyStudyingAnimation}
                    autoplay
                    loop
                    style={{ width: '100%', height: '100%' }}
                  />
                </Box>
              </Box>

              <VStack
                gap={{
                  base: 2,
                  md: 4,
                }}
                align="center"
                justify="center"
                h="100%"
              >
                <Flex
                  align="center"
                  display={{
                    base: 'none',
                    md: 'flex',
                  }}
                >
                  <Flex direction="column" gap={2} textAlign={'center'}>
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      letterSpacing="tight"
                      color={'brand.600'}
                    >
                      Cultura
                    </Text>
                    <Text fontSize="xs" color="brand.600" letterSpacing="wider">
                      DESCUBRE • CONECTA • INSPIRA
                    </Text>
                  </Flex>
                </Flex>

                {/* Botón principal: Google OAuth */}
                <Button
                  variant="solid"
                  colorPalette="brand"
                  w="full"
                  size="lg"
                  display="flex"
                  alignItems="center"
                  gap={3}
                  onClick={() => {
                    window.location.href = `${API_BASE_URL}/api/v1/auth/google`;
                  }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      fill="white"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="white"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="white"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="white"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continuar con Google
                </Button>

                {/* Separador */}
                <Box w="full" position="relative" textAlign="center" my={2}>
                  <Text
                    fontSize="xs"
                    color="gray.400"
                    bg="white"
                    px={3}
                    position="relative"
                    zIndex={1}
                  >
                    ¿Eres administrador?
                  </Text>
                  <Box
                    position="absolute"
                    top="50%"
                    left={0}
                    right={0}
                    height="1px"
                    bg="gray.200"
                    transform="translateY(-50%)"
                    zIndex={0}
                  />
                </Box>

                {/* Opción para administradores */}
                {!showAdminLogin ? (
                  <Button
                    variant="outline"
                    size="sm"
                    color="gray.600"
                    onClick={() => setShowAdminLogin(true)}
                  >
                    Acceso de administrador
                  </Button>
                ) : (
                  <VStack gap={3} w="full">
                    <Field.Root>
                      <Field.Label>Email de administrador</Field.Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@cultura.com"
                        type="email"
                        w="100%"
                        h={{ base: '40px', md: '48px' }}
                        fontSize={{ base: 'sm', md: 'md' }}
                        px={3}
                      />
                    </Field.Root>

                    <Button
                      variant="outline"
                      colorPalette="brand"
                      w="full"
                      size="md"
                      loading={loading}
                      loadingText="Verificando..."
                      onClick={handleSubmit}
                    >
                      Ingresar como administrador
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      color="gray.500"
                      onClick={() => {
                        setShowAdminLogin(false);
                        setEmail('');
                        setError(null);
                      }}
                    >
                      ← Volver
                    </Button>
                  </VStack>
                )}

                {error && (
                  <Alert.Root status="error">
                    <Text>{error}</Text>
                  </Alert.Root>
                )}
              </VStack>
            </Box>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
