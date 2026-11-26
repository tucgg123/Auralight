/**
 * URL pública del sitio. En Vercel se toma sola del dominio de producción;
 * NEXT_PUBLIC_SITE_URL permite sobrescribirla (por ejemplo, con un dominio propio).
 */
function urlDelSitio() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const sitio = {
  nombre: "Auralight",
  lema: "Piezas únicas. Cuando se vende, no vuelve.",
  descripcion:
    "Anillos, manillas, collares y aretes únicos. Cada pieza existe una sola vez: si te gusta, pídela por WhatsApp antes de que alguien más se la lleve.",
  url: urlDelSitio(),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "573043139986",
};
