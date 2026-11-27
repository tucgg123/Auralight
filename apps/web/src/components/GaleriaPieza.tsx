"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";
import type { Pieza } from "@/lib/tipos";
import { FotoPieza } from "./FotoPieza";

/** Foto grande + miniaturas para cambiar entre las fotos de la pieza. */
export function GaleriaPieza({ pieza, children }: { pieza: Pieza; children?: ReactNode }) {
  const [actual, setActual] = useState(0);
  const vendida = pieza.estado === "VENDIDA";

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-borde">
        <FotoPieza
          pieza={pieza}
          indice={actual}
          ancho={800}
          prioridad
          className={clsx("w-full", vendida && "opacity-50 grayscale")}
        />
        {children}
      </div>
      {pieza.imagenes.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {pieza.imagenes.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActual(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === actual}
              className={clsx(
                "h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition",
                i === actual ? "border-oro" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <FotoPieza pieza={pieza} indice={i} ancho={128} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
