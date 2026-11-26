import { sitio } from "./config";
import { categoriaPorSlug } from "@/data/catalogo";
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

export function formatearFecha(iso: string) {
  const texto = fechaLarga.format(new Date(`${iso.slice(0, 10)}T00:00:00Z`));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function enlaceWhatsApp(texto: string) {
  return `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export function mensajePieza(pieza: Pieza) {
  const cat = categoriaPorSlug(pieza.categoria);
  const que = cat ? `${cat.articulo} ${cat.singular}` : "la pieza";
  return `Hola Auralight, quiero ${que} #${pieza.codigo} (${pieza.nombre}, ${formatearPrecio(
    pieza.precio,
  )}). ¿Sigue disponible?\n${sitio.url}/pieza/${pieza.codigo}`;
}
