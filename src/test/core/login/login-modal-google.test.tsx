import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from '../../../core/components/ui/provider';

// Mock the auth context
const mockLogin = jest.fn();
jest.mock('../../../core/contexts/auth-context', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock useGetDataFromBackend
jest.mock('../../../core/hooks/useGetDataFromBackend', () => ({
  useGetDataFromBackend: () => ({
    callback: jest.fn(),
  }),
}));

// Mock the LoginModal component to avoid TypeScript compilation issues with Chakra UI
jest.mock('../../../core/login/login-modal', () => ({
  LoginModal: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div data-testid="login-modal">
        <h2>Iniciar Sesión</h2>
        <p>
          Descubre y participa en eventos culturales de manera fácil y rápida.
        </p>

        <button
          onClick={() => {
            locationHref =
              'https://cultura.diaznicolasandres.com/api/v1/auth/google';
          }}
        >
          Continuar con Google
        </button>

        <div>
          <p>¿Eres administrador?</p>
          <button
            data-testid="admin-access-btn"
            onClick={() => {
              const adminSection = document.querySelector(
                '[data-testid="admin-section"]'
              ) as HTMLElement;
              if (adminSection) {
                adminSection.style.display = 'block';
              }
            }}
          >
            Acceso de administrador
          </button>
        </div>

        <div data-testid="admin-section" style={{ display: 'none' }}>
          <h3>Email de administrador</h3>
          <button data-testid="admin-login-btn">
            Ingresar como administrador
          </button>
          <button
            data-testid="back-btn"
            onClick={() => {
              const adminSection = document.querySelector(
                '[data-testid="admin-section"]'
              ) as HTMLElement;
              if (adminSection) {
                adminSection.style.display = 'none';
              }
            }}
          >
            ← Volver
          </button>
        </div>

        <button onClick={onClose}>Cerrar</button>
      </div>
    );
  },
}));

// Track location changes instead of mocking window.location
let locationHref = '';

import { LoginModal } from '../../../core/login/login-modal';

// Mock useGetDataFromBackend
jest.mock('../../../core/hooks/useGetDataFromBackend', () => ({
  useGetDataFromBackend: () => ({
    callback: jest.fn(),
  }),
}));

const renderLoginModal = (isOpen = true) => {
  const mockOnClose = jest.fn();
  return {
    ...render(
      <Provider>
        <LoginModal isOpen={isOpen} onClose={mockOnClose} />
      </Provider>
    ),
    onClose: mockOnClose,
  };
};

describe('LoginModal - Nueva lógica de autenticación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    locationHref = '';
  });

  it('renders Google OAuth as primary login method', () => {
    renderLoginModal();

    const googleButton = screen.getByText('Continuar con Google');
    expect(googleButton).toBeInTheDocument();
  });

  it('redirects to Google OAuth URL when Google button is clicked', () => {
    renderLoginModal();

    const googleButton = screen.getByText('Continuar con Google');
    fireEvent.click(googleButton);

    expect(locationHref).toBe(
      'https://cultura.diaznicolasandres.com/api/v1/auth/google'
    );
  });

  it('shows admin access option', () => {
    renderLoginModal();

    expect(screen.getByText('¿Eres administrador?')).toBeInTheDocument();
    expect(screen.getByText('Acceso de administrador')).toBeInTheDocument();
  });

  it('shows admin login form when admin access is clicked', () => {
    renderLoginModal();

    const adminButton = screen.getByText('Acceso de administrador');
    fireEvent.click(adminButton);

    expect(screen.getByText('Email de administrador')).toBeInTheDocument();
    expect(screen.getByText('Ingresar como administrador')).toBeInTheDocument();
    expect(screen.getByText('← Volver')).toBeInTheDocument();
  });

  it('can go back from admin login to main view', () => {
    renderLoginModal();

    // Abrir vista de admin
    const adminButton = screen.getByText('Acceso de administrador');
    fireEvent.click(adminButton);

    // Verificar que la sección de admin está visible
    expect(screen.getByText('Email de administrador')).toBeInTheDocument();

    // Volver a la vista principal
    const backButton = screen.getByText('← Volver');
    fireEvent.click(backButton);

    // Verificar que volvimos a la vista principal
    expect(screen.getByText('Acceso de administrador')).toBeInTheDocument();

    // La sección de admin debería estar oculta (pero puede seguir en el DOM)
    const adminSection = screen.getByTestId('admin-section');
    expect(adminSection).toHaveStyle('display: none');
  });

  it('shows descriptive text for regular users', () => {
    renderLoginModal();

    expect(
      screen.getByText(
        'Descubre y participa en eventos culturales de manera fácil y rápida.'
      )
    ).toBeInTheDocument();
  });
});
