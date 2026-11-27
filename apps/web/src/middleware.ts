import { NextResponse, type NextRequest } from "next/server";
import {
  COOKIE_ACCESO,
  COOKIE_REFRESH,
  DURACION_ACCESO,
  DURACION_REFRESH,
  expiraEn,
  opcionesCookie,
  urlApi,
} from "@/lib/admin/sesion";

/**
 * Protege /admin. Si el token de acceso venció pero hay refresh token, pide uno nuevo
 * a la API sin que el administrador tenga que volver a iniciar sesión.
 */
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();

  const acceso = req.cookies.get(COOKIE_ACCESO)?.value;
  const ahora = Math.floor(Date.now() / 1000);
  if (acceso && expiraEn(acceso) - 30 > ahora) return NextResponse.next();

  const refresh = req.cookies.get(COOKIE_REFRESH)?.value;
  const api = urlApi();
  if (refresh && api) {
    const r = await fetch(`${api}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    }).catch(() => null);
    if (r?.ok) {
      const { accessToken, refreshToken } = (await r.json()) as { accessToken: string; refreshToken: string };
      // Se pasan también en la petición para que esta misma página ya use el token nuevo.
      req.cookies.set(COOKIE_ACCESO, accessToken);
      req.cookies.set(COOKIE_REFRESH, refreshToken);
      const res = NextResponse.next({ request: { headers: req.headers } });
      res.cookies.set(COOKIE_ACCESO, accessToken, opcionesCookie(DURACION_ACCESO));
      res.cookies.set(COOKIE_REFRESH, refreshToken, opcionesCookie(DURACION_REFRESH));
      return res;
    }
  }

  const login = new URL("/admin/login", req.url);
  if (req.nextUrl.pathname !== "/admin") login.searchParams.set("volver", req.nextUrl.pathname);
  const res = NextResponse.redirect(login);
  res.cookies.delete(COOKIE_ACCESO);
  res.cookies.delete(COOKIE_REFRESH);
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
