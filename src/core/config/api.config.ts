export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const N8N_API_BASE_URL = import.meta.env.VITE_N8N_API_BASE_URL || '';

export const GRAPHHOPPER_URL =
  import.meta.env.VITE_GRAPHHOPPER_URL || 'https://graphhopper.com';

export const GRAPHHOPPER_API_KEY =
  import.meta.env.VITE_GRAPHHOPPER_API_KEY || '';

export const LDAP_AUTH_URL =
  import.meta.env.VITE_LDAP_AUTH_URL ||
  'http://ec2-44-217-132-156.compute-1.amazonaws.com';

export const LDAP_VALIDATE_URL =
  import.meta.env.VITE_LDAP_VALIDATE_URL ||
  'http://ec2-13-217-71-142.compute-1.amazonaws.com:8081';
