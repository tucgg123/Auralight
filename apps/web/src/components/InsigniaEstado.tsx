import clsx from "clsx";
import type { EstadoPieza } from "@/lib/tipos";

const estilos: Record<EstadoPieza, { texto: string; clase: string }> = {
  DISPONIBLE: { texto: "Pieza única", clase: "bg-noche/80 text-oro border-oro/50" },
  RESERVADA: { texto: "Reservada", clase: "bg-zafiro/85 text-white border-zafiro" },
  VENDIDA: { texto: "Vendida", clase: "bg-marfil text-noche border-marfil" },
  OCULTA: { texto: "Oculta", clase: "bg-grafito text-humo border-borde" },
};

export function InsigniaEstado({ estado, className }: { estado: EstadoPieza; className?: string }) {
  const e = estilos[estado];
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        e.clase,
        className,
      )}
    >
      {e.texto}
    </span>
  );
}
