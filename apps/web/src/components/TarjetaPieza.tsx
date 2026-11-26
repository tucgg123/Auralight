import Link from "next/link";
import clsx from "clsx";
import { categoriaPorSlug } from "@/data/catalogo";
import { formatearPrecio } from "@/lib/formato";
import type { Pieza } from "@/lib/tipos";
import { ImagenPieza } from "./ImagenPieza";
import { InsigniaEstado } from "./InsigniaEstado";

export function TarjetaPieza({ pieza }: { pieza: Pieza }) {
  const cat = categoriaPorSlug(pieza.categoria);
  const vendida = pieza.estado === "VENDIDA";

  return (
    <Link
      href={`/pieza/${pieza.codigo}`}
      className="group block overflow-hidden rounded-2xl border border-borde bg-carbon transition hover:-translate-y-0.5 hover:border-oro/50"
    >
      <div className="relative aspect-square overflow-hidden">
        <ImagenPieza
          forma={cat?.forma ?? "collar"}
          acento={pieza.acento}
          etiqueta={pieza.nombre}
          className={clsx(
            "h-full w-full transition duration-500 group-hover:scale-105",
            vendida && "opacity-50 grayscale",
          )}
        />
        <InsigniaEstado estado={pieza.estado} className="absolute left-3 top-3" />
        <span className="absolute right-3 top-3 hidden rounded-md bg-noche/70 px-2 py-0.5 font-mono text-[11px] text-humo sm:inline">
          #{pieza.codigo}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-humo">{cat?.nombre}</p>
        <h3 className="mt-1 line-clamp-1 font-medium text-marfil group-hover:text-oro-claro">{pieza.nombre}</h3>
        <p className={clsx("mt-1 font-display text-lg", vendida ? "text-humo line-through" : "text-oro")}>
          {formatearPrecio(pieza.precio)}
        </p>
      </div>
    </Link>
  );
}
