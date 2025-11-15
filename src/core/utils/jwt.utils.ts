import { jwtDecode } from 'jwt-decode';
import type { User } from '../login/login.api';

export interface DecodedJWT {
  sub: string;
  aud: string;
  iss: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  roles: string[];
  azp: string;
  email: string;
  scope: string[];
  typ: string;
}

/**
 * Decodifica un token JWT y retorna su contenido
 */
export const decodeJWT = (token: string): DecodedJWT | null => {
  try {
    return jwtDecode<DecodedJWT>(token);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
};

/**
 * Valida si un token JWT está expirado
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Mapea un JWT decodificado al formato User de la aplicación
 */
export const mapJWTToUser = (decoded: DecodedJWT): User => {
  // Mapear roles del JWT a los roles de la aplicación
  let role: 'admin' | 'user' | 'supervisor' = 'user';
  
  if (decoded.roles) {
    if (decoded.roles.some(r => r.includes('admin') || r.includes('super_admin'))) {
      role = 'admin';
    } else if (decoded.roles.some(r => r.includes('supervisor'))) {
      role = 'supervisor';
    }
  }

  return {
    id: decoded.sub || decoded.azp || '',
    name: decoded.sub || '',
    email: decoded.email || '',
    role,
  };
};

