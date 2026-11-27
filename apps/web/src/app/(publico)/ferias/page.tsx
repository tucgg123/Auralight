import type { Metadata } from "next";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import clsx from "clsx";
import { feriasOrdenadas } from "@/lib/datos";
import { formatearFecha } from "@/lib/formato";
import type { Feria } from "@/lib/tipos";

export const metadata: Metadata = {
  title: "Ferias",
  description: "Encuentra a Auralight en persona: próximas ferias de emprendimiento.",
};

export const revalidate = 60;

function TarjetaFeria({ feria, pasada }: { feria: Feria; pasada?: boolean }) {
  return (
    <li
      className={clsx(
        "rounded-2xl border p-5",
        pasada ? "border-borde bg-carbon/60 opacity-75" : "border-pavo/40 bg-gradient-to-br from-pavo/10 to-transparent",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-lg text-marfil">{feria.nombre}</h3>
        {feria.ejemplo && (
          <span className="rounded-full bg-grafito px-2 py-0.5 text-[10px] uppercase tracking-wider text-humo">
            Ejemplo
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1.5 text-sm text-marfil/85">
        <p className="flex items-center gap-2">
          <CalendarDays size={16} className="text-oro" aria-hidden="true" />
          <span>{formatearFecha(feria.fecha)}</span>
        </p>
        {feria.horario && (
          <p className="flex items-center gap-2">
            <Clock size={16} className="text-oro" aria-hidden="true" /> {feria.horario}
          </p>
        )}
        <p className="flex items-center gap-2">
          <MapPin size={16} className="text-oro" aria-hidden="true" /> {feria.lugar}
        </p>
      </div>
    </li>
  );
}

export default async function Ferias() {
  const { proximas, pasadas } = await feriasOrdenadas();
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10">
      <h1 className="font-display text-3xl text-marfil sm:text-4xl">Ferias</h1>
      <p className="mt-2 text-sm text-humo">
        Las piezas se ven mejor en persona. Aquí te contamos dónde vamos a estar.
      </p>

      <h2 className="mt-10 text-xs uppercase tracking-[0.25em] text-pavo-claro">Próximas</h2>
      {proximas.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {proximas.map((f) => (
            <TarjetaFeria key={f.id} feria={f} />
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-humo">Pronto anunciaremos la próxima feria.</p>
      )}

      {pasadas.length > 0 && (
        <>
          <h2 className="mt-12 text-xs uppercase tracking-[0.25em] text-humo">Ya estuvimos en</h2>
          <ul className="mt-4 space-y-4">
            {pasadas.map((f) => (
              <TarjetaFeria key={f.id} feria={f} pasada />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
