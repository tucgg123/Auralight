"use client";

import { useActionState, useState, useTransition } from "react";
import { eliminarFeria, guardarFeria, type EstadoFormulario } from "@/app/admin/acciones";
import { Aviso, BotonEnviar, Campo, claseBoton, claseCampo } from "./ui";

interface Feria {
  id?: string;
  nombre?: string;
  lugar?: string;
  fecha?: string;
  horario?: string | null;
  ventas?: number;
}

export function FormularioFeria({ feria = {}, alGuardar }: { feria?: Feria; alGuardar?: () => void }) {
  const [estado, accion, cargando] = useActionState(async (prev: EstadoFormulario, f: FormData) => {
    const r = await guardarFeria(prev, f);
    if (r.ok) alGuardar?.();
    return r;
  }, {});
  const [borrado, setBorrado] = useState<EstadoFormulario>();
  const v = { ...feria, ...estado.valores };
  const [borrando, iniciar] = useTransition();

  return (
    <form action={accion} className="space-y-3" key={feria.id ? undefined : estado.ok}>
      {feria.id && <input type="hidden" name="id" value={feria.id} />}
      <Campo etiqueta="Nombre">
        <input name="nombre" required minLength={3} maxLength={120} defaultValue={v.nombre} className={claseCampo} />
      </Campo>
      <Campo etiqueta="Lugar">
        <input name="lugar" required minLength={2} maxLength={160} defaultValue={v.lugar} className={claseCampo} />
      </Campo>
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Fecha">
          <input name="fecha" type="date" required defaultValue={v.fecha?.slice(0, 10)} className={claseCampo} />
        </Campo>
        <Campo etiqueta="Horario (opcional)">
          <input name="horario" maxLength={60} defaultValue={v.horario ?? ""} placeholder="9 a. m. – 4 p. m." className={claseCampo} />
        </Campo>
      </div>
      <Aviso estado={estado} />
      <Aviso estado={borrado} />
      <div className="flex flex-wrap gap-2">
        <BotonEnviar cargando={cargando}>{feria.id ? "Guardar" : "Crear feria"}</BotonEnviar>
        {feria.id && !feria.ventas && (
          <button
            type="button"
            disabled={borrando}
            onClick={() => iniciar(async () => setBorrado(await eliminarFeria(feria.id!)))}
            className={claseBoton("peligro")}
          >
            Eliminar
          </button>
        )}
      </div>
    </form>
  );
}
