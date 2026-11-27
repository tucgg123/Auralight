import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { FormularioFeria } from "@/components/admin/FormularioFeria";
import { apiAdmin, type FeriaAdmin } from "@/lib/admin/api";
import { formatearFecha } from "@/lib/formato";

export const metadata: Metadata = { title: "Ferias" };

export default async function Ferias() {
  const ferias = await apiAdmin<FeriaAdmin[]>("/admin/ferias");
  const hoy = new Date(Date.now() - 5 * 3600_000).toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl text-marfil">Ferias</h1>

      <details className="rounded-2xl border border-oro/40 bg-carbon/60 p-4 sm:p-6" open={ferias.length === 0}>
        <summary className="cursor-pointer text-sm font-semibold text-oro">+ Nueva feria</summary>
        <div className="mt-4">
          <FormularioFeria />
        </div>
      </details>

      <ul className="space-y-3">
        {ferias.map((f) => (
          <li key={f.id}>
            <details className="rounded-2xl border border-borde bg-carbon/60 p-4">
              <summary className="cursor-pointer list-none">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-marfil">{f.nombre}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-humo">
                      <CalendarDays size={14} /> {formatearFecha(f.fecha)}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-humo">
                      <MapPin size={14} /> {f.lugar}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <span className={f.fecha.slice(0, 10) >= hoy ? "text-pavo-claro" : "text-humo"}>
                      {f.fecha.slice(0, 10) >= hoy ? "Próxima" : "Pasada"}
                    </span>
                    <p className="mt-1 text-humo">{f._count.ventas === 1 ? "1 venta" : `${f._count.ventas} ventas`}</p>
                  </div>
                </div>
              </summary>
              <div className="mt-4 border-t border-borde pt-4">
                <FormularioFeria feria={{ ...f, ventas: f._count.ventas }} />
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
