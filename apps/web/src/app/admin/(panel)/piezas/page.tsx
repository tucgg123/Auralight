import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { Plus, Search } from "lucide-react";
import { FotoPieza } from "@/components/FotoPieza";
import { InsigniaEstado } from "@/components/InsigniaEstado";
import { claseCampo } from "@/lib/admin/estilos";
import { apiAdmin, type EstadoPieza, type PiezaAdmin } from "@/lib/admin/api";
import { acentoDeCodigo } from "@/lib/formas";
import { formatearPrecio } from "@/lib/formato";

export const metadata: Metadata = { title: "Piezas" };

const filtros: { valor: EstadoPieza | ""; texto: string }[] = [
  { valor: "", texto: "Todas" },
  { valor: "DISPONIBLE", texto: "Disponibles" },
  { valor: "RESERVADA", texto: "Reservadas" },
  { valor: "VENDIDA", texto: "Vendidas" },
  { valor: "OCULTA", texto: "Ocultas" },
];

type Props = { searchParams: Promise<{ q?: string; estado?: string }> };

export default async function Piezas({ searchParams }: Props) {
  const { q = "", estado = "" } = await searchParams;
  const todas = await apiAdmin<PiezaAdmin[]>(`/admin/productos${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  const lista = estado ? todas.filter((p) => p.estado === estado) : todas;
  const cuenta = (e: string) => (e ? todas.filter((p) => p.estado === e).length : todas.length);
  const enlace = (e: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (e) p.set("estado", e);
    const s = p.toString();
    return s ? `/admin/piezas?${s}` : "/admin/piezas";
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-marfil">Piezas</h1>
        <Link
          href="/admin/piezas/nueva"
          className="hidden items-center gap-1.5 rounded-full bg-gradient-to-b from-oro-claro to-oro px-4 py-2 text-sm font-semibold text-noche md:inline-flex"
        >
          <Plus size={16} /> Nueva pieza
        </Link>
      </div>

      <form className="relative mt-4" role="search">
        {estado && <input type="hidden" name="estado" value={estado} />}
        <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-humo" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, código o material"
          className={clsx(claseCampo, "pl-10")}
          type="search"
        />
      </form>

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {filtros.map((f) => (
          <Link
            key={f.valor || "todas"}
            href={enlace(f.valor)}
            className={clsx(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm",
              estado === f.valor ? "border-oro bg-oro text-noche" : "border-borde text-marfil/85",
            )}
          >
            {f.texto} <span className="opacity-70">{cuenta(f.valor)}</span>
          </Link>
        ))}
      </div>

      {lista.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-borde p-10 text-center">
          <p className="text-marfil">{todas.length === 0 && !q ? "Todavía no hay piezas." : "No hay piezas con ese filtro."}</p>
          <Link href="/admin/piezas/nueva" className="mt-2 inline-block text-sm text-oro hover:underline">
            Subir una pieza
          </Link>
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {lista.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/piezas/${p.id}`}
                className="block overflow-hidden rounded-2xl border border-borde bg-carbon transition hover:border-oro/50"
              >
                <div className="relative">
                  <FotoPieza
                    pieza={{
                      nombre: p.nombre,
                      categoria: p.categoria,
                      acento: acentoDeCodigo(p.codigo),
                      imagenes: p.imagenes.flatMap((i) => (i.url ? [i.url] : [])),
                    }}
                    ancho={300}
                    className={clsx("aspect-square w-full", (p.estado === "VENDIDA" || p.estado === "OCULTA") && "opacity-50")}
                  />
                  <InsigniaEstado estado={p.estado} admin className="absolute left-2 top-2" />
                </div>
                <div className="p-3">
                  <p className="font-mono text-[11px] text-humo">#{p.codigo}</p>
                  <p className="line-clamp-1 text-sm text-marfil">{p.nombre}</p>
                  <p className="text-sm text-oro">{formatearPrecio(p.precio)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
