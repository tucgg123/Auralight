import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_ACCESO, urlApi } from "./sesion";

export class ErrorApi extends Error {
  constructor(
    public status: number,
    mensaje: string,
  ) {
    super(mensaje);
  }
}

/**
 * Llama a un endpoint de administración con el token de la sesión.
 * El navegador nunca ve el token: vive en una cookie httpOnly y solo el servidor de Next.js lo usa.
 */
export async function apiAdmin<T = unknown>(ruta: string, init: RequestInit = {}): Promise<T> {
  const base = urlApi();
  if (!base) throw new ErrorApi(503, "El panel necesita la API. Configura API_URL.");
  const token = (await cookies()).get(COOKIE_ACCESO)?.value;
  if (!token) redirect("/admin/login");

  const res = await fetch(`${base}${ruta}`, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init.headers, Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) redirect("/admin/login?vencida=1");
  if (res.status === 204) return undefined as T;
  const cuerpo = await res.json().catch(() => ({}));
  if (!res.ok) {
    const m = (cuerpo as { mensaje?: string | string[] }).mensaje;
    throw new ErrorApi(res.status, Array.isArray(m) ? m.join(" ") : (m ?? "Error de la API"));
  }
  return cuerpo as T;
}

// ---- Tipos de las respuestas de administración ----

export type EstadoPieza = "DISPONIBLE" | "RESERVADA" | "VENDIDA" | "OCULTA";
export type Canal = "WEB" | "FERIA" | "WHATSAPP" | "INSTAGRAM" | "OTRO";

export interface PiezaAdmin {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  material: string;
  precio: number;
  estado: EstadoPieza;
  categoria: { slug: string; nombre: string; singular: string; articulo: string };
  imagenes: { id: string; publicId: string; url: string | null }[];
  creadoEn: string;
  actualizadoEn: string;
  venta: null | {
    id: string;
    fecha: string;
    canal: Canal;
    precioFinal: number;
    feria: { id: string; nombre: string } | null;
  };
}

export interface FeriaAdmin {
  id: string;
  nombre: string;
  lugar: string;
  fecha: string;
  horario: string | null;
  _count: { ventas: number };
}

export interface VentaAdmin {
  id: string;
  fecha: string;
  canal: Canal;
  precioFinal: number;
  producto: { id: string; codigo: string; nombre: string; precio: number };
  feria: { id: string; nombre: string } | null;
}

export interface FirmaSubida {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
  urlSubida: string;
}
