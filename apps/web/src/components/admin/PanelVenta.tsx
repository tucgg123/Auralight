"use client";

import { useActionState, useState, useTransition } from "react";
import clsx from "clsx";
import { deshacerVenta, registrarVenta, type EstadoFormulario } from "@/app/admin/acciones";
import type { Canal, PiezaAdmin } from "@/lib/admin/api";
import { nombresCanal } from "@/lib/admin/canales";
import { formatearFecha, formatearPrecio } from "@/lib/formato";
import { Aviso, BotonEnviar, Campo, claseBoton, claseCampo } from "./ui";


export function PanelVenta({
  pieza,
  ferias,
}: {
  pieza: PiezaAdmin;
  ferias: { id: string; nombre: string; fecha: string }[];
}) {
  const [estado, accion, cargando] = useActionState(registrarVenta, {});
  const [canal, setCanal] = useState<Canal>("WHATSAPP");
  const [deshecho, setDeshecho] = useState<EstadoFormulario>();
  const [deshaciendo, iniciar] = useTransition();
  const [confirmar, setConfirmar] = useState(false);

  if (pieza.venta) {
    const v = pieza.venta;
    return (
      <div className="space-y-3">
        <Aviso estado={estado.ok ? estado : undefined} />
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-humo">Fecha</dt>
            <dd className="text-marfil">{formatearFecha(v.fecha)}</dd>
          </div>
          <div>
            <dt className="text-humo">Canal</dt>
            <dd className="text-marfil">{nombresCanal[v.canal]}{v.feria ? ` · ${v.feria.nombre}` : ""}</dd>
          </div>
          <div>
            <dt className="text-humo">Precio final</dt>
            <dd className="text-oro">{formatearPrecio(v.precioFinal)}</dd>
          </div>
        </dl>
        <Aviso estado={deshecho} />
        {confirmar ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={deshaciendo}
              onClick={() => iniciar(async () => setDeshecho(await deshacerVenta(pieza.id)))}
              className={claseBoton("peligro")}
            >
              {deshaciendo ? "Deshaciendo…" : "Sí, deshacer la venta"}
            </button>
            <button type="button" onClick={() => setConfirmar(false)} className={claseBoton("secundario")}>
              Cancelar
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmar(true)} className="text-sm text-humo underline hover:text-marfil">
            ¿Fue un error? Deshacer venta
          </button>
        )}
      </div>
    );
  }

  // La feria de hoy o la más reciente aparece primero.
  const hoy = new Date().toISOString().slice(0, 10);
  const feriasOrdenadas = [...ferias].sort(
    (a, b) => Math.abs(Date.parse(a.fecha) - Date.parse(hoy)) - Math.abs(Date.parse(b.fecha) - Date.parse(hoy)),
  );

  return (
    <form action={accion} className="space-y-4">
      <input type="hidden" name="id" value={pieza.id} />
      <input type="hidden" name="canal" value={canal} />
      <fieldset>
        <legend className="mb-2 text-sm text-marfil/90">¿Dónde se vendió?</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(nombresCanal) as Canal[]).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={canal === c}
              onClick={() => setCanal(c)}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm",
                canal === c ? "border-oro bg-oro text-noche" : "border-borde text-marfil/85",
              )}
            >
              {nombresCanal[c]}
            </button>
          ))}
        </div>
      </fieldset>

      {canal === "FERIA" && (
        <Campo etiqueta="Feria" ayuda={ferias.length === 0 ? "Crea la feria en la sección Ferias para asociarla." : undefined}>
          <select name="feriaId" className={claseCampo} defaultValue={estado.valores?.feriaId ?? feriasOrdenadas[0]?.id ?? ""}>
            <option value="">Sin especificar</option>
            {feriasOrdenadas.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre} · {f.fecha.slice(0, 10)}
              </option>
            ))}
          </select>
        </Campo>
      )}

      <Campo etiqueta="Precio final (opcional)" ayuda={`Déjalo vacío si fue el precio publicado: ${formatearPrecio(pieza.precio)}`}>
        <input name="precioFinal" inputMode="numeric" pattern="[0-9.]*" defaultValue={estado.valores?.precioFinal} className={claseCampo} placeholder={pieza.precio.toLocaleString("es-CO")} />
      </Campo>

      <Aviso estado={estado} />
      <BotonEnviar cargando={cargando} textoCargando="Registrando…" className="w-full sm:w-auto">
        Marcar como vendida
      </BotonEnviar>
    </form>
  );
}
