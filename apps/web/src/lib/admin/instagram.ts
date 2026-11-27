import { formatearPrecio } from "@/lib/formato";

export type FormatoInstagram = "post" | "historia";

export const tamanos: Record<FormatoInstagram, { width: number; height: number }> = {
  post: { width: 1080, height: 1350 }, // 4:5, el formato que más espacio ocupa en el feed
  historia: { width: 1080, height: 1920 }, // 9:16
};

const hashtagsPorCategoria: Record<string, string[]> = {
  anillos: ["#anillos", "#anillosdemoda", "#rings"],
  manillas: ["#manillas", "#pulseras", "#manillasartesanales"],
  collares: ["#collares", "#collaresdemoda", "#necklace"],
  cadenas: ["#cadenas", "#cadenasdeacero", "#chains"],
  aretes: ["#aretes", "#aretesdemoda", "#earrings"],
};

const hashtagsBase = ["#auralight", "#piezasunicas", "#accesorios", "#emprendimientocolombiano", "#hechoencolombia"];

interface PiezaTexto {
  codigo: string;
  nombre: string;
  descripcion: string;
  material: string;
  precio: number;
  categoria: { slug: string };
}

/** Texto listo para pegar en el post de Instagram. */
export function textoPublicacion(p: PiezaTexto, urlSitio: string) {
  const tags = [...(hashtagsPorCategoria[p.categoria.slug] ?? []), ...hashtagsBase].join(" ");
  return [
    `✨ ${p.nombre} ✨`,
    "",
    p.descripcion || null,
    p.descripcion ? "" : null,
    `💎 ${p.material}`,
    `💰 ${formatearPrecio(p.precio)}`,
    `🔖 Código #${p.codigo}`,
    "",
    "Es una pieza única: cuando se vende, no vuelve. 🦚",
    `Pídela por WhatsApp con el código #${p.codigo} o mírala en ${urlSitio.replace(/^https?:\/\//, "")}/pieza/${p.codigo} (link en la bio).`,
    "",
    tags,
  ]
    .filter((l) => l !== null)
    .join("\n");
}
