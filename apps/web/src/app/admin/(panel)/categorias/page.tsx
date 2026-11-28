import type { Metadata } from "next";
import { FormularioCategoria } from "@/components/admin/FormularioCategoria";
import { OrdenCategoria } from "@/components/admin/OrdenCategoria";
import { apiAdmin, type CategoriaAdmin } from "@/lib/admin/api";

export const metadata: Metadata = { title: "Categorías" };

export default async function Categorias() {
  const categorias = await apiAdmin<CategoriaAdmin[]>("/admin/categorias");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-marfil">Categorías</h1>
        <p className="mt-1 text-sm text-humo">Se muestran en el catálogo en este orden. Usa las flechas para moverlas.</p>
      </div>

      <details className="rounded-2xl border border-oro/40 bg-carbon/60 p-4 sm:p-6" open={categorias.length === 0}>
        <summary className="cursor-pointer text-sm font-semibold text-oro">+ Nueva categoría</summary>
        <div className="mt-4">
          <FormularioCategoria />
        </div>
      </details>

      <ul className="space-y-3">
        {categorias.map((c, i) => (
          <li key={c.id} className="flex items-start gap-2">
            <OrdenCategoria actual={c} anterior={categorias[i - 1]} siguiente={categorias[i + 1]} />
            <details className="flex-1 rounded-2xl border border-borde bg-carbon/60 p-4">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-marfil">{c.nombre}</p>
                    <p className="mt-0.5 text-sm text-humo">
                      Códigos <span className="font-mono text-oro">{c.prefijoCodigo}-###</span>
                    </p>
                  </div>
                  <p className="text-xs text-humo">{c._count.productos === 1 ? "1 pieza" : `${c._count.productos} piezas`}</p>
                </div>
              </summary>
              <div className="mt-4 border-t border-borde pt-4">
                <FormularioCategoria categoria={{ ...c, piezas: c._count.productos }} />
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
