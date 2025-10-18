import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from '../../../core/components/ui/provider';
import AuthCallback from '../../../modules/auth/auth-callback';

// Mock the auth context
const mockLogin = jest.fn();
jest.mock('../../../core/contexts/auth-context', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

const renderWithProviders = (
  initialEntries: string[] = ['/auth/callback?token=test-token']
) => {
  return render(
    <Provider>
      <MemoryRouter initialEntries={initialEntries}>
        <AuthCallback />
      </MemoryRouter>
    </Provider>
  );
};

describe('AuthCallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('shows loading message while processing valid JWT token', () => {
    // Usar un JWT válido simple para el test
    const simpleJWT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6OTk5OTk5OTk5OX0.Twzj-0x_5_8FJWbzFCbxFj6sLf9tUXPULzYD_qS4q8o';

    renderWithProviders([`/auth/callback?token=${simpleJWT}`]);

    // Verificar que muestra el mensaje de carga
    expect(
      screen.getByText('Completando el proceso de login...')
    ).toBeInTheDocument();
    expect(mockLogin).toHaveBeenCalledWith(
      {
        id: '1234567890',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        createdAt: expect.any(String),
      },
      simpleJWT
    );
  });

  it('shows loading message even when no token is provided', async () => {
    renderWithProviders(['/auth/callback']); // No token

    // Verificar que muestra el mensaje de carga (la UI es simple, no muestra errores)
    expect(
      screen.getByText('Completando el proceso de login...')
    ).toBeInTheDocument();

    // Verificar que no se llama a login si no hay token
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('decodes JWT token and calls login with user data', async () => {
    // JWT token real (el que mencionaste en el ejemplo)
    const mockJWT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGMyZGQ2MGZiMTcyODIzZGE2MWViOTIiLCJlbWFpbCI6InRvbWFzc2NodXN0ZXIxMEBnbWFpbC5jb20iLCJuYW1lIjoiSnVhbiBQw6lyZXoiLCJyb2xlIjoidXNlciIsImlzR29vZ2xlVXNlciI6ZmFsc2UsImlhdCI6MTc2MDc5MTMyNiwiZXhwIjoxNzYxMzk2MTI2fQ.wjhDfrVXM98C5983WVB0JgiZ5cfwxxef7os_RAyhVRY';

    renderWithProviders([`/auth/callback?token=${mockJWT}`]);

    // Verificar que muestra el mensaje de carga
    expect(
      screen.getByText('Completando el proceso de login...')
    ).toBeInTheDocument();

    // Verificar que se llama a login con los datos correctos del JWT y el token
    expect(mockLogin).toHaveBeenCalledWith(
      {
        id: '68c2dd60fb172823da61eb92',
        name: 'Juan Pérez',
        email: 'tomasschuster10@gmail.com',
        role: 'user',
        createdAt: expect.any(String),
      },
      mockJWT
    );
  });

  it('shows loading message even with invalid JWT tokens', async () => {
    renderWithProviders(['/auth/callback?token=invalid-token']);

    // Verificar que muestra el mensaje de carga (la UI es simple, no muestra errores)
    expect(
      screen.getByText('Completando el proceso de login...')
    ).toBeInTheDocument();

    // Verificar que no se llama a login si el token es inválido
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
