"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { cambiarEstado, eliminarPieza, type EstadoFormulario } from "@/app/admin/acciones";
import type { PiezaAdmin } from "@/lib/admin/api";
import { Aviso, claseBoton } from "./ui";

export function AccionesPieza({ pieza }: { pieza: PiezaAdmin }) {
  const [resultado, setResultado] = useState<EstadoFormulario>();
  const [ocupado, iniciar] = useTransition();
  const [confirmar, setConfirmar] = useState(false);
  const vendida = pieza.estado === "VENDIDA";
  const oculta = pieza.estado === "OCULTA";

  return (
    <div className="space-y-3">
      <Aviso estado={resultado} />
      <div className="flex flex-wrap gap-2">
        {!vendida && (
          <button
            type="button"
            disabled={ocupado}
            onClick={() => iniciar(async () => setResultado(await cambiarEstado(pieza.id, oculta ? "DISPONIBLE" : "OCULTA")))}
            className={claseBoton("secundario")}
          >
            {oculta ? <Eye size={16} /> : <EyeOff size={16} />}
            {oculta ? "Mostrar en la tienda" : "Ocultar de la tienda"}
          </button>
        )}
        {!vendida &&
          (confirmar ? (
            <>
              <button
                type="button"
                disabled={ocupado}
                onClick={() => iniciar(async () => setResultado(await eliminarPieza(pieza.id)))}
                className={claseBoton("peligro")}
              >
                Sí, eliminar #{pieza.codigo}
              </button>
              <button type="button" onClick={() => setConfirmar(false)} className={claseBoton("secundario")}>
                Cancelar
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setConfirmar(true)} className={claseBoton("peligro")}>
              <Trash2 size={16} /> Eliminar
            </button>
          ))}
      </div>
      {vendida && <p className="text-xs text-humo">Las piezas vendidas no se ocultan ni se eliminan: quedan en la galería de vendidas.</p>}
    </div>
  );
}
