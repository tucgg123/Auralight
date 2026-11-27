/** Genera el código legible de una pieza: prefijo de la categoría + consecutivo con 3 dígitos (A-042). */
export function formatearCodigo(prefijo: string, consecutivo: number) {
  if (!Number.isInteger(consecutivo) || consecutivo < 1) throw new Error("El consecutivo debe ser un entero positivo");
  return `${prefijo.toUpperCase()}-${String(consecutivo).padStart(3, "0")}`;
}
