export const base64UrlDecode = (str: string) => {
  // Convertir base64url a base64
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

  // Agregar padding si es necesario
  while (base64.length % 4) {
    base64 += '=';
  }

  // Decodificar base64 y convertir a UTF-8
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Convertir bytes a string UTF-8
  return new TextDecoder('utf-8').decode(bytes);
};
