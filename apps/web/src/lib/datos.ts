/**
 * Capa de datos del sitio público.
 *
 * - Con API_URL configurada, lee la API de NestJS (con caché de Next.js).
 * - Sin API_URL, usa los datos de ejemplo, así la demo funciona sin backend.
 *
 * Las páginas solo usan estas funciones; no saben de dónde vienen los datos.
 */
import "server-only";
import { categoriasEjemplo, feriasEjemplo, piezasEjemplo } from "@/data/ejemplos";
import { acentoDeCodigo } from "./formas";
import type { Categoria, EstadoPieza, Feria, Pieza } from "./tipos";

export const ETIQUETA_CATALOGO = "catalogo";
export const ETIQUETA_FERIAS = "ferias";

const API_URL = process.env.API_URL?.replace(/\/$/, "");
export const usaApi = Boolean(API_URL);

interface PiezaApi {
  codigo: string;
  nombre: string;
  descripcion: string;
  material: string;
  precio: number;
  estado: EstadoPieza;
  categoria: Categoria;
  imagenes: { url: string | null }[];
  creadoEn: string;
  vendidaEn: string | null;
}

const enBuild = process.env.NEXT_PHASE === "phase-production-build";

async function api<T>(ruta: string, etiqueta: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${ruta}`, {
      next: { revalidate: 60, tags: [etiqueta] },
      signal: AbortSignal.timeout(enBuild ? 90_000 : 20_000),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`La API respondió ${res.status} en ${ruta}`);
    return (await res.json()) as T;
  } catch (e) {
    // Si la API no responde durante el build (por ejemplo, Render dormido), no se cae el despliegue:
    // la página sale vacía y se regenera sola en la primera visita después de un minuto.
    if (enBuild) {
      console.warn(`[datos] No se pudo leer ${ruta} durante el build:`, (e as Error).message);
      return null;
    }
    throw e;
  }
}

function aPieza(p: PiezaApi): Pieza {
  return {
    codigo: p.codigo,
    nombre: p.nombre,
    descripcion: p.descripcion,
    material: p.material,
    precio: p.precio,
    estado: p.estado,
    categoria: p.categoria,
    imagenes: p.imagenes.map((i) => i.url).filter((u): u is string => Boolean(u)),
    acento: acentoDeCodigo(p.codigo),
    creadaEn: p.creadoEn,
    vendidaEn: p.vendidaEn,
  };
}

const porFechaDesc = (a: Pieza, b: Pieza) => b.creadaEn.localeCompare(a.creadaEn);

export async function categorias(): Promise<Categoria[]> {
  if (!API_URL) return categoriasEjemplo;
  return (await api<Categoria[]>("/categorias", ETIQUETA_CATALOGO)) ?? [];
}

/** Piezas disponibles y reservadas, más recientes primero. */
export async function piezasPublicas(): Promise<Pieza[]> {
  if (!API_URL) {
    return piezasEjemplo.filter((p) => p.estado === "DISPONIBLE" || p.estado === "RESERVADA").sort(porFechaDesc);
  }
  return ((await api<PiezaApi[]>("/productos", ETIQUETA_CATALOGO)) ?? []).map(aPieza);
}

export async function piezasVendidas(): Promise<Pieza[]> {
  if (!API_URL) {
    return piezasEjemplo
      .filter((p) => p.estado === "VENDIDA")
      .sort((a, b) => (b.vendidaEn ?? "").localeCompare(a.vendidaEn ?? ""));
  }
  return ((await api<PiezaApi[]>("/productos/vendidas", ETIQUETA_CATALOGO)) ?? []).map(aPieza);
}

export async function piezaPorCodigo(codigo: string): Promise<Pieza | null> {
  if (!/^[A-Za-z]{1,3}-\d{1,5}$/.test(codigo)) return null;
  if (!API_URL) {
    return piezasEjemplo.find((p) => p.codigo.toLowerCase() === codigo.toLowerCase() && p.estado !== "OCULTA") ?? null;
  }
  const p = await api<PiezaApi>(`/productos/${encodeURIComponent(codigo)}`, ETIQUETA_CATALOGO);
  return p ? aPieza(p) : null;
}

/** Códigos para pre-generar páginas en el build (las nuevas se generan al visitarlas). */
export async function codigosParaPrerender(): Promise<string[]> {
  try {
    const [publicas, vendidas] = await Promise.all([piezasPublicas(), piezasVendidas()]);
    return [...publicas, ...vendidas].map((p) => p.codigo);
  } catch {
    return []; // Si la API está dormida durante el build, las páginas se generan al primer visitante.
  }
}

export async function novedades(cantidad = 4) {
  return (await piezasPublicas()).slice(0, cantidad);
}

export async function relacionadas(pieza: Pieza, cantidad = 4) {
  return (await piezasPublicas())
    .filter((p) => p.codigo !== pieza.codigo && p.estado === "DISPONIBLE")
    .sort((a, b) => Number(b.categoria.slug === pieza.categoria.slug) - Number(a.categoria.slug === pieza.categoria.slug))
    .slice(0, cantidad);
}

export async function feriasOrdenadas(): Promise<{ proximas: Feria[]; pasadas: Feria[] }> {
  if (!API_URL) {
    const hoy = hoyEnColombia();
    return {
      proximas: feriasEjemplo.filter((f) => f.fecha >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha)),
      pasadas: feriasEjemplo.filter((f) => f.fecha < hoy).sort((a, b) => b.fecha.localeCompare(a.fecha)),
    };
  }
  return (await api<{ proximas: Feria[]; pasadas: Feria[] }>("/ferias", ETIQUETA_FERIAS)) ?? { proximas: [], pasadas: [] };
}

function hoyEnColombia() {
  return new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
