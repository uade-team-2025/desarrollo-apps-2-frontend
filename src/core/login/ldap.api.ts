/**
 * API para interactuar con el servidor de autenticación LDAP
 */

import { LDAP_AUTH_URL, LDAP_VALIDATE_URL } from '../config/api.config';

/**
 * Valida un token JWT con el backend LDAP
 */
export const validateLDAPToken = async (token: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${LDAP_VALIDATE_URL}/v1/auth/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt_token: token }),
    });

    if (!response.ok) {
      throw new Error('Token inválido');
    }

    return { success: true };
  } catch (error) {
    console.error('Error en validateLDAPToken:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};

/**
 * Genera la URL para iniciar el login LDAP
 */
export const getLDAPLoginUrl = (redirectUrl: string): string => {
  return `${LDAP_AUTH_URL}/auth?redirectUrl=${encodeURIComponent(redirectUrl)}`;
};

