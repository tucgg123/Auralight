"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useTransition } from "react";
import { intercambiarOrden } from "@/app/admin/acciones";

type C = { id: number; orden: number };

/** Flechas para subir o bajar una categoría en el orden del catálogo. */
export function OrdenCategoria({ actual, anterior, siguiente }: { actual: C; anterior?: C; siguiente?: C }) {
  const [moviendo, iniciar] = useTransition();
  const boton = "rounded-lg p-1.5 text-humo transition hover:bg-noche hover:text-oro disabled:opacity-30";
  return (
    <div className="flex flex-col" aria-busy={moviendo}>
      <button
        type="button"
        aria-label="Subir"
        disabled={!anterior || moviendo}
        onClick={() => anterior && iniciar(async () => void (await intercambiarOrden(actual, anterior)))}
        className={boton}
      >
        <ArrowUp size={16} />
      </button>
      <button
        type="button"
        aria-label="Bajar"
        disabled={!siguiente || moviendo}
        onClick={() => siguiente && iniciar(async () => void (await intercambiarOrden(actual, siguiente)))}
        className={boton}
      >
        <ArrowDown size={16} />
      </button>
    </div>
  );
}
