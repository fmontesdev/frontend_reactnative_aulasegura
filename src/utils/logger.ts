/**
 * Logger condicional por entorno.
 * En producción los errores no se exponen en consola.
 * __DEV__ es el global de React Native/Expo para detección de modo desarrollo.
 */
export const logger = {
  error: (message: string, ...args: unknown[]) => {
    if (__DEV__) console.error(message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    if (__DEV__) console.warn(message, ...args);
  },
};
