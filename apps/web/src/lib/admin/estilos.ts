import clsx from "clsx";

/** Clases compartidas del panel (archivo sin "use client" para poder usarlas también en componentes de servidor). */
export const claseCampo =
  "w-full rounded-xl border border-borde bg-carbon px-3.5 py-3 text-base text-marfil placeholder:text-humo/60 focus:border-oro focus:outline-none";

export function claseBoton(variante: "principal" | "secundario" | "peligro" = "principal") {
  return clsx(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition disabled:opacity-60",
    variante === "principal" && "bg-gradient-to-b from-oro-claro to-oro text-noche hover:brightness-110",
    variante === "secundario" && "border border-borde text-marfil hover:border-oro/60",
    variante === "peligro" && "border border-red-500/50 text-red-300 hover:bg-red-500/10",
  );
}
