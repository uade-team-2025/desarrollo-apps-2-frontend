import {
  Badge,
  Button,
  Dialog,
  Field,
  Input,
  Select,
  Stack,
  createListCollection,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '../../../../core/contexts/auth-context';
import { toaster } from '../../../../core/components/ui/toaster';
import { useGetDataFromBackend } from '../../../../core/hooks/useGetDataFromBackend';
import type { UpdateUserData, User } from '../users.api';
import { updateUser } from '../users.api';
import { getStatusColor } from '../users.utils';

interface UserEditDialogProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: () => void;
}

export const UserEditDialog = ({
  user,
  isOpen,
  onClose,
  onUserUpdate,
}: UserEditDialogProps) => {
  const { isSupervisor } = useAuth();
  const [formData, setFormData] = useState<UpdateUserData>({
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  });

  const roleOptions = createListCollection({
    items: [
      { label: 'Usuario', value: 'user' },
      { label: 'Administrador', value: 'admin' },
    ],
  });

  const { callback: updateUserCallback, loading: isLoadingUpdateUser } =
    useGetDataFromBackend({
      url: updateUser(user._id),
      options: { method: 'PUT', body: JSON.stringify(formData) },
      onSuccess: () => {
        toaster.create({
          title: '¡Listo!',
          description: 'El usuario ha sido actualizado exitosamente.',
          type: 'success',
        });
        onUserUpdate();
        onClose();
      },
    });

  const handleClose = () => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Editando a {user.name}</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <Stack gap={4}>
              <Field.Root>
                <Field.Label>Nombre</Field.Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Rol</Field.Label>
                <Select.Root
                  collection={roleOptions}
                  value={[formData.role || 'user']}
                  onValueChange={(details) =>
                    setFormData({
                      ...formData,
                      role: details.value[0] as 'admin' | 'user',
                    })
                  }
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText>
                        {formData.role === 'admin'
                          ? 'Administrador'
                          : 'Usuario'}
                      </Select.ValueText>
                    </Select.Trigger>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {roleOptions.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label>Estado</Field.Label>
                <Badge
                  colorPalette={getStatusColor(!!formData.isActive)}
                  variant="outline"
                >
                  {formData.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </Field.Root>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer>
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              colorPalette="green"
              onClick={updateUserCallback}
              loading={isLoadingUpdateUser}
              loadingText="Guardando..."
              disabled={isSupervisor}
            >
              Guardar Cambios
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
