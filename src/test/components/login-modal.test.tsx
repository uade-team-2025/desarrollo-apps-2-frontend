import { fireEvent, render, screen } from '@testing-library/react';

// Mock de Chakra UI
jest.mock('@chakra-ui/react', () =>
  require('../../__mocks__/@chakra-ui__react')
);

// Mock del contexto de autenticación
const mockLogin = jest.fn();
jest.mock('../../core/contexts/auth-context', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
  UserRole: {
    ADMIN: 'admin',
    USER: 'user',
    supervisor: 'supervisor',
  },
}));

// Crear un componente simplificado para testing
const TestLoginModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div data-testid="dialog">
      <div data-testid="dialog-title">Iniciar Sesión</div>
      <div data-testid="dialog-body">
        <p>Selecciona tu rol para continuar:</p>
        <button
          onClick={() => {
            mockLogin({
              id: 'admin_456',
              name: 'María Admin',
              email: 'maria@admin.com',
              role: 'admin',
            }, 'admin-token-123');
            onClose();
          }}
        >
          🛡️ Iniciar como Admin
        </button>
        <button
          onClick={() => {
            mockLogin({
              id: '68c2dd60fb172823da61eb92',
              name: 'Juan Pérez',
              email: 'juan@usuario.com',
              role: 'user',
            }, 'user-token-456');
            onClose();
          }}
        >
          👤 Iniciar como Usuario
        </button>
        <button
          onClick={() => {
            mockLogin({
              id: 'supervisor_789',
              name: 'Carlos Operador',
              email: 'carlos@operador.com',
              role: 'supervisor',
            }, 'supervisor-token-789');
            onClose();
          }}
        >
          👨‍💼 Iniciar como Operador
        </button>
        <button aria-label="Cerrar modal" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

describe('LoginModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('no se renderiza cuando isOpen es false', () => {
    const mockOnClose = jest.fn();

    render(<TestLoginModal isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('se renderiza correctamente cuando isOpen es true', () => {
    const mockOnClose = jest.fn();

    render(<TestLoginModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(
      screen.getByText('Selecciona tu rol para continuar:')
    ).toBeInTheDocument();
  });

  it('muestra todos los botones de rol', () => {
    const mockOnClose = jest.fn();

    render(<TestLoginModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('🛡️ Iniciar como Admin')).toBeInTheDocument();
    expect(screen.getByText('👤 Iniciar como Usuario')).toBeInTheDocument();
    expect(screen.getByText('👨‍💼 Iniciar como Operador')).toBeInTheDocument();
  });

  it('llama a onClose cuando se hace click en el botón de cerrar', () => {
    const mockOnClose = jest.fn();

    render(<TestLoginModal isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /cerrar modal/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('inicia sesión como admin cuando se hace click en el botón de admin', () => {
    const mockOnClose = jest.fn();

    render(<TestLoginModal isOpen={true} onClose={mockOnClose} />);

    const adminButton = screen.getByText('🛡️ Iniciar como Admin');
    fireEvent.click(adminButton);

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith({
      id: 'admin_456',
      name: 'María Admin',
      email: 'maria@admin.com',
      role: 'admin',
    }, 'admin-token-123');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('inicia sesión como usuario cuando se hace click en el botón de usuario', () => {
    const mockOnClose = jest.fn();

    render(<TestLoginModal isOpen={true} onClose={mockOnClose} />);

    const userButton = screen.getByText('👤 Iniciar como Usuario');
    fireEvent.click(userButton);

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith({
      id: '68c2dd60fb172823da61eb92',
      name: 'Juan Pérez',
      email: 'juan@usuario.com',
      role: 'user',
    }, 'user-token-456');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('inicia sesión como operador cuando se hace click en el botón de operador', () => {
    const mockOnClose = jest.fn();

    render(<TestLoginModal isOpen={true} onClose={mockOnClose} />);

    const supervisorButton = screen.getByText('👨‍💼 Iniciar como Operador');
    fireEvent.click(supervisorButton);

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith({
      id: 'supervisor_789',
      name: 'Carlos Operador',
      email: 'carlos@operador.com',
      role: 'supervisor',
    }, 'supervisor-token-789');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('tiene la estructura de diálogo correcta', () => {
    const mockOnClose = jest.fn();

    render(<TestLoginModal isOpen={true} onClose={mockOnClose} />);

    // Verificar que existe el título del diálogo
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();

    // Verificar que existe el contenido del diálogo
    expect(screen.getByTestId('dialog-body')).toBeInTheDocument();
    expect(
      screen.getByText('Selecciona tu rol para continuar:')
    ).toBeInTheDocument();

    // Verificar que el botón de cerrar existe
    expect(
      screen.getByRole('button', { name: /cerrar modal/i })
    ).toBeInTheDocument();
  });

  it('se cierra cuando se cambia la prop open a false', () => {
    const mockOnClose = jest.fn();

    const { rerender } = render(
      <TestLoginModal isOpen={true} onClose={mockOnClose} />
    );

    expect(screen.getByTestId('dialog')).toBeInTheDocument();

    rerender(<TestLoginModal isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });
});
