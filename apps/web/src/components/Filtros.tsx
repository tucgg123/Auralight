"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import clsx from "clsx";

export interface ValoresFiltro {
  categoria?: string;
  material?: string;
  precio?: string;
  orden?: string;
}

export const rangosPrecio = [
  { valor: "0-20000", texto: "Hasta $20.000" },
  { valor: "20000-30000", texto: "$20.000 – $30.000" },
  { valor: "30000-999999999", texto: "Más de $30.000" },
];

export function Filtros({
  valores,
  categorias,
  materiales,
}: {
  valores: ValoresFiltro;
  categorias: { slug: string; nombre: string }[];
  materiales: readonly string[];
}) {
  const router = useRouter();
  const ruta = usePathname();
  const [cargando, iniciar] = useTransition();

  function cambiar(clave: keyof ValoresFiltro, valor: string) {
    const params = new URLSearchParams();
    const nuevos = { ...valores, [clave]: valor };
    for (const [k, v] of Object.entries(nuevos)) if (v) params.set(k, v);
    const qs = params.toString();
    iniciar(() => router.replace(qs ? `${ruta}?${qs}` : ruta, { scroll: false }));
  }

  const select =
    "w-full appearance-none rounded-xl border border-borde bg-carbon px-3 py-2.5 text-sm text-marfil focus:border-oro";

  return (
    <div className={clsx("space-y-4 transition-opacity", cargando && "opacity-60")}>
      {/* Categorías como chips */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ slug: "", nombre: "Todas" }, ...categorias].map((c) => {
          const activo = (valores.categoria ?? "") === c.slug;
          return (
            <button
              key={c.slug || "todas"}
              type="button"
              onClick={() => cambiar("categoria", c.slug)}
              aria-pressed={activo}
              className={clsx(
                "shrink-0 rounded-full border px-4 py-2 text-sm transition",
                activo ? "border-oro bg-oro text-noche" : "border-borde text-marfil/85 hover:border-oro/60",
              )}
            >
              {c.nombre}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2 sm:max-w-2xl sm:gap-3">
        <label className="text-xs text-humo">
          Material
          <select
            className={clsx(select, "mt-1")}
            value={valores.material ?? ""}
            onChange={(e) => cambiar("material", e.target.value)}
          >
            <option value="">Todos</option>
            {materiales.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-humo">
          Precio
          <select
            className={clsx(select, "mt-1")}
            value={valores.precio ?? ""}
            onChange={(e) => cambiar("precio", e.target.value)}
          >
            <option value="">Todos</option>
            {rangosPrecio.map((r) => (
              <option key={r.valor} value={r.valor}>
                {r.texto}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-humo">
          Ordenar
          <select
            className={clsx(select, "mt-1")}
            value={valores.orden ?? ""}
            onChange={(e) => cambiar("orden", e.target.value)}
          >
            <option value="">Recientes</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
          </select>
        </label>
      </div>
    </div>
  );
}
