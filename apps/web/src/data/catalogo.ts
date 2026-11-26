/**
 * Datos de ejemplo para la demo.
 * Cuando exista la API (NestJS + PostgreSQL), estas funciones se reemplazan
 * por llamadas HTTP con la misma forma, y las páginas no cambian.
 */
import type { Categoria, Feria, Pieza } from "@/lib/tipos";

export const categorias: Categoria[] = [
  { slug: "anillos", nombre: "Anillos", singular: "anillo", articulo: "el", prefijo: "A", forma: "anillo" },
  { slug: "manillas", nombre: "Manillas", singular: "manilla", articulo: "la", prefijo: "M", forma: "manilla" },
  { slug: "collares", nombre: "Collares", singular: "collar", articulo: "el", prefijo: "C", forma: "collar" },
  { slug: "cadenas", nombre: "Cadenas", singular: "cadena", articulo: "la", prefijo: "K", forma: "cadena" },
  { slug: "aretes", nombre: "Aretes", singular: "par de aretes", articulo: "el", prefijo: "R", forma: "aretes" },
];

const piezas: Pieza[] = [
  {
    codigo: "C-021",
    nombre: "Collar Punto de Luz",
    categoria: "collares",
    material: "Acero inoxidable con circón",
    precio: 32000,
    descripcion:
      "Cadena delgada con un dije de circón en forma de gota. Sencillo, lindo y va con todo: de diario o para una salida.",
    estado: "DISPONIBLE",
    acento: "perla",
    creadaEn: "2026-11-24",
  },
  {
    codigo: "C-020",
    nombre: "Collares Cósmicos (pareja)",
    categoria: "collares",
    material: "Acero dorado con imán",
    precio: 45000,
    descripcion:
      "Dos collares con astronautas que se unen por un corazón imantado. Para regalar uno y quedarse con el otro: amores tan grandes como galaxias.",
    estado: "DISPONIBLE",
    acento: "oro",
    creadaEn: "2026-11-22",
  },
  {
    codigo: "A-042",
    nombre: "Anillo Negro Mate",
    categoria: "anillos",
    material: "Acero inoxidable negro",
    precio: 18000,
    descripcion:
      "Anillo de líneas limpias en negro mate. Esencial para él, resistente al agua y al uso diario.",
    estado: "DISPONIBLE",
    acento: "onix",
    creadaEn: "2026-11-20",
  },
  {
    codigo: "M-013",
    nombre: "Manilla Telaraña",
    categoria: "manillas",
    material: "Hilo trenzado y dije de acero",
    precio: 15000,
    descripcion:
      "Manilla de hilo trenzado a mano con un dije de telaraña en acero. Ajustable con nudo corredizo.",
    estado: "DISPONIBLE",
    acento: "rubi",
    creadaEn: "2026-11-18",
  },
  {
    codigo: "C-019",
    nombre: "Collar Corazón Rubí",
    categoria: "collares",
    material: "Aleación plateada con cristal",
    precio: 28000,
    descripcion: "Dije de corazón con cristal rojo y un moño delicado en la parte superior.",
    estado: "DISPONIBLE",
    acento: "rubi",
    creadaEn: "2026-11-15",
  },
  {
    codigo: "A-041",
    nombre: "Anillo Serpiente Esmeralda",
    categoria: "anillos",
    material: "Baño de oro con cristales verdes",
    precio: 25000,
    descripcion:
      "Anillo abierto en forma de serpiente con cristales color esmeralda. Ajustable a varias tallas.",
    estado: "DISPONIBLE",
    acento: "esmeralda",
    creadaEn: "2026-11-12",
  },
  {
    codigo: "R-007",
    nombre: "Aretes Gota Zafiro",
    categoria: "aretes",
    material: "Acero inoxidable con cristal azul",
    precio: 22000,
    descripcion: "Aretes colgantes en forma de gota con cristal azul profundo, como la pluma del pavo real.",
    estado: "DISPONIBLE",
    acento: "zafiro",
    creadaEn: "2026-11-10",
  },
  {
    codigo: "K-005",
    nombre: "Cadena Eslabón Cubano",
    categoria: "cadenas",
    material: "Acero inoxidable dorado",
    precio: 38000,
    descripcion: "Cadena de eslabón cubano de 4 mm, 50 cm de largo. No se oscurece con el agua.",
    estado: "DISPONIBLE",
    acento: "oro",
    creadaEn: "2026-11-08",
  },
  {
    codigo: "C-018",
    nombre: "Collar Luna",
    categoria: "collares",
    material: "Acero dorado con esmalte azul",
    precio: 26000,
    descripcion: "Dije de media luna en esmalte azul noche con una pequeña estrella.",
    estado: "RESERVADA",
    acento: "zafiro",
    creadaEn: "2026-11-05",
  },
  {
    codigo: "M-012",
    nombre: "Manilla Hilo Azul Marino",
    categoria: "manillas",
    material: "Hilo encerado trenzado",
    precio: 12000,
    descripcion: "Manilla tejida a mano en azul marino, cierre ajustable. Unisex.",
    estado: "DISPONIBLE",
    acento: "zafiro",
    creadaEn: "2026-11-02",
  },
  {
    codigo: "A-040",
    nombre: "Anillo Turquesa",
    categoria: "anillos",
    material: "Acero plateado con piedra turquesa",
    precio: 24000,
    descripcion: "Anillo con piedra turquesa ovalada y engaste trabajado.",
    estado: "DISPONIBLE",
    acento: "esmeralda",
    creadaEn: "2026-10-28",
  },
  {
    codigo: "R-006",
    nombre: "Aretes Argolla Dorada",
    categoria: "aretes",
    material: "Acero con baño de oro",
    precio: 20000,
    descripcion: "Argollas medianas de acabado brillante. Livianas para usar todo el día.",
    estado: "DISPONIBLE",
    acento: "oro",
    creadaEn: "2026-10-25",
  },
  // Vendidas
  {
    codigo: "C-017",
    nombre: "Collar Sol",
    categoria: "collares",
    material: "Acero dorado",
    precio: 26000,
    descripcion: "Dije de sol radiante en acero dorado.",
    estado: "VENDIDA",
    acento: "oro",
    creadaEn: "2026-10-10",
    vendidaEn: "2026-10-14",
  },
  {
    codigo: "C-016",
    nombre: "Collar Rosa Plateada",
    categoria: "collares",
    material: "Aleación plateada",
    precio: 24000,
    descripcion: "Dije de rosa de tallo largo.",
    estado: "VENDIDA",
    acento: "perla",
    creadaEn: "2026-09-30",
    vendidaEn: "2026-10-03",
  },
  {
    codigo: "M-011",
    nombre: "Manilla Telaraña Roja",
    categoria: "manillas",
    material: "Hilo trenzado y dije de acero",
    precio: 15000,
    descripcion: "Manilla de hilo rojo con dije de telaraña.",
    estado: "VENDIDA",
    acento: "rubi",
    creadaEn: "2026-09-15",
    vendidaEn: "2026-09-18",
  },
  {
    codigo: "A-039",
    nombre: "Anillo Negro Liso",
    categoria: "anillos",
    material: "Acero inoxidable negro",
    precio: 18000,
    descripcion: "Anillo liso negro mate de 6 mm.",
    estado: "VENDIDA",
    acento: "onix",
    creadaEn: "2026-09-10",
    vendidaEn: "2026-09-18",
  },
];

const ferias: Feria[] = [
  {
    id: "cuc-connections-2026",
    nombre: "Feria de Emprendimiento CUC Connections",
    lugar: "Cafetería Central (Zona Coworking), Universidad de la Costa",
    fecha: "2026-09-18",
    horario: "9:00 a. m. – 4:00 p. m.",
  },
  {
    id: "navidad-2026",
    nombre: "Feria Navideña de Emprendedores",
    lugar: "Lugar por confirmar",
    fecha: "2026-12-12",
    horario: "10:00 a. m. – 6:00 p. m.",
    ejemplo: true,
  },
  {
    id: "enero-2027",
    nombre: "Mercado de Emprendimiento de Enero",
    lugar: "Lugar por confirmar",
    fecha: "2027-01-23",
    horario: "9:00 a. m. – 5:00 p. m.",
    ejemplo: true,
  },
];

// ---- Consultas (misma forma que tendrá el cliente de la API) ----

const porFechaDesc = (a: Pieza, b: Pieza) => b.creadaEn.localeCompare(a.creadaEn);

export function categoriaPorSlug(slug: string) {
  return categorias.find((c) => c.slug === slug);
}

export function piezasPublicas() {
  return piezas.filter((p) => p.estado === "DISPONIBLE" || p.estado === "RESERVADA").sort(porFechaDesc);
}

export function piezasVendidas() {
  return piezas
    .filter((p) => p.estado === "VENDIDA")
    .sort((a, b) => (b.vendidaEn ?? "").localeCompare(a.vendidaEn ?? ""));
}

export function novedades(cantidad = 4) {
  return piezasPublicas().slice(0, cantidad);
}

export function piezaPorCodigo(codigo: string) {
  return piezas.find((p) => p.codigo.toLowerCase() === codigo.toLowerCase() && p.estado !== "OCULTA");
}

export function todasLasPiezas() {
  return piezas.filter((p) => p.estado !== "OCULTA");
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

export function relacionadas(pieza: Pieza, cantidad = 4) {
  return piezasPublicas()
    .filter((p) => p.codigo !== pieza.codigo && p.estado === "DISPONIBLE")
    .sort((a, b) => Number(b.categoria === pieza.categoria) - Number(a.categoria === pieza.categoria))
    .slice(0, cantidad);
}

export function feriasOrdenadas(hoy = new Date()) {
  const hoyIso = hoy.toISOString().slice(0, 10);
  const proximas = ferias.filter((f) => f.fecha >= hoyIso).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const pasadas = ferias.filter((f) => f.fecha < hoyIso).sort((a, b) => b.fecha.localeCompare(a.fecha));
  return { proximas, pasadas };
}
