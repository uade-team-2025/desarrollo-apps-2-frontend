import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import useLocalStorage from '../../core/hooks/useLocalStorage';
import { toaster } from '../components/ui/toaster';
import { LDAP_AUTH_URL } from '../config/api.config';
import { getLDAPLoginUrl, validateLDAPToken } from '../login/ldap.api';
import type { User } from '../login/login.api';
import { decodeJWT, isTokenExpired, mapJWTToUser } from '../utils/jwt.utils';

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  SUPERVISOR: 'supervisor',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

interface AuthContextType {
  isLogged: boolean;
  user: User | null;
  token: string | null;
  role: UserRoleType | null;
  isAdmin: boolean;
  isSupervisor: boolean;
  isUser: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  loginLDAP: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    value: storedUser,
    setValue: setStoredUser,
    removeValue: removeStoredUser,
  } = useLocalStorage<User | null>('auth_user', null);
  const { value: storedIsLogged, setValue: setStoredIsLogged } =
    useLocalStorage<boolean>('auth_isLogged', false);
  const { value: storedToken, setValue: setStoredToken } = useLocalStorage<
    string | null
  >('auth_token', '');

  const [user, setUser] = useState<User | null>(storedUser);
  const [isLogged, setIsLogged] = useState<boolean>(storedIsLogged);
  const [token, setToken] = useState<string | null>(storedToken || null);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setIsLogged(true);
    setStoredUser(userData);
    setStoredIsLogged(true);
    setToken(token);
    setStoredToken(token);
  };

  const logout = () => {
    setUser(null);
    setIsLogged(false);
    setToken(null);
    removeStoredUser();
    setStoredIsLogged(false);
    setStoredToken(null);
  };

  const loginLDAP = useCallback(() => {
    const redirectUrl = window.location.origin;
    const loginUrl = getLDAPLoginUrl(redirectUrl);
    window.open(loginUrl, 'LoginPopup', 'width=600,height=700');
  }, []);

  useEffect(() => {
    const validateAuth = async () => {
      if (token && !user) {
        const decoded = decodeJWT(token);
        if (!decoded) {
          console.error('No se pudo decodificar el token');
          logout();
          return;
        }

        if (decoded.isGoogleUser === true) {
          return;
        }

        if (isTokenExpired(token)) {
          toaster.create({
            title: 'Sesión expirada',
            description:
              'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            type: 'warning',
          });
          logout();
          return;
        }

        const { success } = await validateLDAPToken(token);
        if (success) {
          try {
            const userData = mapJWTToUser(decoded);
            if (decoded.iat) {
              userData.createdAt = new Date(decoded.iat * 1000).toISOString();
            }
            setUser(userData);
            setStoredUser(userData);
            setIsLogged(true);
            setStoredIsLogged(true);
          } catch (e) {
            console.error('Error decodificando JWT de LDAP:', e);
            logout();
          }
        } else {
          toaster.create({
            title: 'Sesión expirada',
            description:
              'Tu sesión expiró. Se abrirá la ventana de login en unos segundos...',
            type: 'warning',
          });
          setTimeout(() => {
            loginLDAP();
          }, 5000);
        }
      }
    };

    validateAuth();
  }, [token, logout, loginLDAP, setStoredUser, setStoredIsLogged, user]);

  // Escuchar mensajes desde la ventana de login LDAP
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verificar el origen del mensaje
      if (event.origin !== LDAP_AUTH_URL) {
        return;
      }

      const { token: receivedToken } = event.data;
      if (receivedToken) {
        try {
          // Trim any whitespace that might have been introduced
          let token = receivedToken.trim();

          // Validate token format (should have 3 parts separated by dots)
          const parts = token.split('.');
          if (parts.length !== 3) {
            console.error(
              'Token JWT inválido de LDAP: número de partes incorrecto',
              {
                partsCount: parts.length,
                tokenLength: token.length,
              }
            );
            toaster.create({
              title: 'Error de autenticación',
              description: 'El formato del token recibido no es válido',
              type: 'error',
            });
            return;
          }

          // Guardar el token
          setStoredToken(token);
          setToken(token);

          // Validar el token
          validateLDAPToken(token).then(({ success }) => {
            if (success) {
              // Decodificar y mapear el JWT
              const decoded = decodeJWT(token);
              if (decoded) {
                const userData = mapJWTToUser(decoded);
                // Add createdAt if available
                if (decoded.iat) {
                  userData.createdAt = new Date(
                    decoded.iat * 1000
                  ).toISOString();
                }
                login(userData, token);
                toaster.create({
                  title: 'Sesión iniciada',
                  description: `Bienvenido, ${userData.name || userData.email}`,
                  type: 'success',
                });
              } else {
                toaster.create({
                  title: 'Error de autenticación',
                  description: 'No se pudo decodificar el token JWT',
                  type: 'error',
                });
              }
            } else {
              toaster.create({
                title: 'Error de autenticación',
                description: 'El token recibido no es válido',
                type: 'error',
              });
            }
          });
        } catch (e) {
          console.error('Error procesando token LDAP:', e);
          toaster.create({
            title: 'Error',
            description:
              'Hubo un problema al procesar el token de autenticación',
            type: 'error',
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login, setStoredToken]);

  const value: AuthContextType = {
    isLogged,
    user,
    token,
    role: user?.role || null,
    isAdmin: user?.role === UserRole.ADMIN,
    isSupervisor: user?.role === UserRole.SUPERVISOR,
    isUser: user?.role === UserRole.USER,
    login,
    logout,
    loginLDAP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
