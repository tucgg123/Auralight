import { sitio } from "./config";
import type { Pieza } from "./tipos";

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatearPrecio(precio: number) {
  return cop.format(precio);
}

const fechaLarga = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const fechaLargaBogota = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Bogota",
});

/**
 * Fechas sin hora (ferias: "2026-12-12" o medianoche UTC) se muestran tal cual;
 * momentos exactos (una venta) se muestran en la hora de Colombia.
 */
export function formatearFecha(iso: string) {
  const soloDia = iso.length === 10 || iso.endsWith("T00:00:00.000Z") || iso.endsWith("T00:00:00Z");
  const texto = soloDia
    ? fechaLarga.format(new Date(`${iso.slice(0, 10)}T00:00:00Z`))
    : fechaLargaBogota.format(new Date(iso));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function enlaceWhatsApp(texto: string) {
  return `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export function mensajePieza(pieza: Pieza) {
  const que = `${pieza.categoria.articulo} ${pieza.categoria.singular}`;
  return `Hola Auralight, quiero ${que} #${pieza.codigo} (${pieza.nombre}, ${formatearPrecio(
    pieza.precio,
  )}). ¿Sigue disponible?\n${sitio.url}/pieza/${pieza.codigo}`;
}
