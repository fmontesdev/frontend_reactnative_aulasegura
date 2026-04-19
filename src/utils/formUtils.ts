/**
 * Compara el estado actual de un formulario con los valores originales
 * y devuelve solo los campos que han cambiado.
 * Para arrays, la comparación es insensible al orden.
 */
export function getChangedFields(
  current: Record<string, unknown>,
  original: Record<string, unknown>,
): Record<string, unknown> {
  return Object.keys(current).reduce<Record<string, unknown>>((acc, key) => {
    const cur = current[key];
    const org = original[key];
    const hasChanged =
      Array.isArray(cur) && Array.isArray(org)
        ? JSON.stringify([...cur].sort()) !== JSON.stringify([...org].sort())
        : cur !== org;
    if (hasChanged) {
      acc[key] = cur;
    }
    return acc;
  }, {});
}
