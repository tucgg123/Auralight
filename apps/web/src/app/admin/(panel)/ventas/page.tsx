import type { Metadata } from "next";
import Link from "next/link";
import { nombresCanal } from "@/lib/admin/canales";
import { apiAdmin, type VentaAdmin } from "@/lib/admin/api";
import { formatearFecha, formatearPrecio } from "@/lib/formato";

export const metadata: Metadata = { title: "Ventas" };

export default async function Ventas() {
  const ventas = await apiAdmin<VentaAdmin[]>("/admin/ventas");
  const mes = new Date(Date.now() - 5 * 3600_000).toISOString().slice(0, 7);
  const delMes = ventas.filter((v) => v.fecha.slice(0, 7) === mes);
  const total = (l: VentaAdmin[]) => l.reduce((s, v) => s + v.precioFinal, 0);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl text-marfil">Ventas</h1>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-borde bg-carbon/60 p-4">
          <p className="text-xs text-humo">Este mes</p>
          <p className="mt-1 font-display text-2xl text-oro">{formatearPrecio(total(delMes))}</p>
          <p className="text-xs text-humo">{delMes.length === 1 ? "1 pieza" : `${delMes.length} piezas`}</p>
        </div>
        <div className="rounded-2xl border border-borde bg-carbon/60 p-4">
          <p className="text-xs text-humo">Últimas {ventas.length}</p>
          <p className="mt-1 font-display text-2xl text-marfil">{formatearPrecio(total(ventas))}</p>
          <p className="text-xs text-humo">Las estadísticas completas llegan en la Fase 2</p>
        </div>
      </div>

      {ventas.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-borde p-8 text-center text-sm text-humo">
          Aún no hay ventas. Se registran desde la página de cada pieza con «Marcar como vendida».
        </p>
      ) : (
        <ul className="divide-y divide-borde rounded-2xl border border-borde bg-carbon/60">
          {ventas.map((v) => (
            <li key={v.id}>
              <Link href={`/admin/piezas/${v.producto.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-grafito/50">
                <div className="min-w-0">
                  <p className="truncate text-marfil">
                    <span className="font-mono text-xs text-humo">#{v.producto.codigo}</span> {v.producto.nombre}
                  </p>
                  <p className="text-xs text-humo">
                    {formatearFecha(v.fecha)} · {nombresCanal[v.canal]}
                    {v.feria ? ` · ${v.feria.nombre}` : ""}
                  </p>
                </div>
                <p className="shrink-0 text-oro">{formatearPrecio(v.precioFinal)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
