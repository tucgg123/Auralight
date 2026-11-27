/** Nombres y opciones de las cookies de sesión del panel (compartido con middleware.ts). */
export const COOKIE_ACCESO = "aura_acceso";
export const COOKIE_REFRESH = "aura_refresh";

export const opcionesCookie = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});

export const DURACION_ACCESO = 15 * 60;
export const DURACION_REFRESH = 7 * 24 * 60 * 60;

/** Lee la fecha de expiración de un JWT sin verificarlo (la API es la que verifica la firma). */
export function expiraEn(token: string): number {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return (JSON.parse(atob(payload)) as { exp?: number }).exp ?? 0;
  } catch {
    return 0;
  }
}

export function urlApi() {
  return process.env.API_URL?.replace(/\/$/, "");
}
