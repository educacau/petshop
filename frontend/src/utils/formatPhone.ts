const digitsOnly = /\D+/g;

/**
 * Normaliza uma string mantendo apenas números e limitando ao padrão brasileiro (11 dígitos).
 */
export const normalizePhoneDigits = (value: string) => value.replace(digitsOnly, '').slice(0, 11);

/**
 * Aplica máscara dinâmica de telefone brasileiro enquanto o usuário digita.
 */
export const formatPhone = (value: string) => {
  const digits = normalizePhoneDigits(value);

  if (digits.length === 0) {
    return '';
  }

  const ddd = digits.slice(0, 2);
  const firstChunk = digits.slice(2, digits.length > 10 ? 7 : 6);
  const lastChunk = digits.slice(digits.length > 10 ? 7 : 6);

  if (digits.length <= 2) {
    return `(${ddd}`;
  }

  if (digits.length <= 6) {
    return `(${ddd}) ${firstChunk}`;
  }

  return `(${ddd}) ${firstChunk}-${lastChunk}`;
};
