/// <reference types="vite/client" />

declare module '*.lottie' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_LDAP_AUTH_URL?: string;
  readonly VITE_LDAP_VALIDATE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
