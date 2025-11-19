import {
  Badge,
  Box,
  Card,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiEdit, FiMail, FiTrash2, FiUser } from 'react-icons/fi';
import { useAuth } from '../../../../core/contexts/auth-context';
import { useGetDataFromBackend } from '../../../../core/hooks/useGetDataFromBackend';
import type { User } from '../users.api';
import { deleteUser } from '../users.api';
import {
  formatLastLogin,
  getRoleColor,
  getRoleLabel,
  getStatusColor,
  getStatusLabel,
} from '../users.utils';
import { UserEditDialog } from './user-edit-dialog';

interface UserCardProps {
  user: User;
  onUserUpdate: () => void;
}

export const UserCard = ({ user, onUserUpdate }: UserCardProps) => {
  const { isSupervisor } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleEdit = () => {
    setIsDrawerOpen(true);
  };

  const { callback: deleteUserCallback, loading: isLoadingDeleteUser } =
    useGetDataFromBackend({
      url: deleteUser(user._id),
      options: { method: 'DELETE' },
      onSuccess: () => {
        onUserUpdate();
      },
    });

  const handleDelete = async () => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar al usuario "${user.name}"?`
      )
    ) {
      return;
    }
    deleteUserCallback();
  };

  return (
    <>
      <Card.Root>
        <Card.Body>
          <HStack gap={4} align="start">
            <Box
              w="12"
              h="12"
              borderRadius="full"
              bg={user.role === 'admin' ? 'red.500' : 'blue.500'}
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              <Icon as={FiUser} boxSize={6} />
            </Box>

            <VStack align="start" flex={1} gap={2}>
              <HStack gap={3} align="center">
                <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                  {user.name}
                </Text>
                <Badge colorPalette={getRoleColor(user.role)} variant="solid">
                  {getRoleLabel(user.role)}
                </Badge>
                <Badge
                  colorPalette={getStatusColor(user.isActive)}
                  variant="outline"
                >
                  {getStatusLabel(user.isActive)}
                </Badge>
              </HStack>

              <HStack gap={2} color="gray.600">
                <Icon as={FiMail} boxSize={4} />
                <Text fontSize="sm">{user.email}</Text>
              </HStack>

              <HStack gap={4} fontSize="sm" color="gray.500">
                <Text>
                  Creado: {new Date(user.createdAt).toLocaleDateString()}
                </Text>
                <Text>Último login: {formatLastLogin(user.lastLogin)}</Text>
              </HStack>
            </VStack>

            <HStack gap={2}>
              <IconButton
                size="sm"
                variant="outline"
                colorPalette="blue"
                onClick={handleEdit}
                aria-label="Editar usuario"
                disabled={isSupervisor}
              >
                <Icon as={FiEdit} />
              </IconButton>

              <IconButton
                size="sm"
                variant="outline"
                colorPalette="red"
                onClick={handleDelete}
                disabled={isLoadingDeleteUser || isSupervisor}
                aria-label="Eliminar usuario"
              >
                <Icon as={FiTrash2} />
              </IconButton>
            </HStack>
          </HStack>
        </Card.Body>
      </Card.Root>

      <UserEditDialog
        user={user}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUserUpdate={onUserUpdate}
      />
    </>
  );
};
