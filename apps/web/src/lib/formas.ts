import type { Acento, Forma } from "./tipos";

const formas: Record<string, Forma> = {
  anillos: "anillo",
  manillas: "manilla",
  pulseras: "manilla",
  collares: "collar",
  cadenas: "cadena",
  aretes: "aretes",
};

/** Forma de la ilustración provisional según la categoría. */
export function formaDeCategoria(slug: string): Forma {
  return formas[slug] ?? "collar";
}

const acentos: Acento[] = ["esmeralda", "zafiro", "rubi", "oro", "onix", "perla"];

/** Color estable para la ilustración de una pieza sin foto, derivado de su código. */
export function acentoDeCodigo(codigo: string): Acento {
  let h = 0;
  for (const c of codigo) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return acentos[h % acentos.length];
}

/** Agrupa el material libre en familias para poder filtrar. */
export function familiaMaterial(material: string) {
  const m = material.toLowerCase();
  if (m.includes("hilo")) return "Hilo tejido";
  if (m.includes("negro")) return "Acero negro";
  if (m.includes("oro") || m.includes("dorad")) return "Dorado";
  return "Plateado";
}

export const familiasMaterial = ["Dorado", "Plateado", "Acero negro", "Hilo tejido"] as const;

/** Inserta transformaciones de Cloudinary (formato y calidad automáticos, recorte cuadrado). */
export function fotoCloudinary(url: string, ancho: number) {
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_fill,g_auto,w_${ancho},h_${ancho}/`);
}
