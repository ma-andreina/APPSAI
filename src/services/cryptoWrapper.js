/**
 * Wrapper de Criptografía (SoC)
 * Aísla la aplicación del cálculo directo de firmas y hashes utilizando la Web Crypto API nativa.
 */
export const cryptoWrapper = {
  /**
   * Calcula el hash SHA-256 de un archivo, string o buffer.
   * @param {File|Blob|string|ArrayBuffer} data Datos a los que calcular el hash.
   * @returns {Promise<string>} Hash SHA-256 representado como cadena hexadecimal.
   */
  calculateSHA256: async (data) => {
    if (!data) {
      throw new Error('No se proporcionaron datos para calcular el hash.');
    }

    let arrayBuffer;

    if (data instanceof Blob || data instanceof File) {
      // Para archivos y blobs (carga de evidencias)
      arrayBuffer = await data.arrayBuffer();
    } else if (typeof data === 'string') {
      // Para textos de prueba
      const encoder = new TextEncoder();
      arrayBuffer = encoder.encode(data);
    } else if (data instanceof ArrayBuffer) {
      arrayBuffer = data;
    } else {
      throw new Error('Formato de datos no soportado para el cálculo de SHA-256.');
    }

    // Calcula el hash utilizando Web Crypto API nativo (subtle digest)
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    // Convierte el buffer a cadena hexadecimal
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
      
    return hashHex;
  }
};
