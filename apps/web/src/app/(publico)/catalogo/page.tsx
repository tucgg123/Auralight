import type { Metadata } from "next";
import Link from "next/link";
import { Filtros, type ValoresFiltro } from "@/components/Filtros";
import { TarjetaPieza } from "@/components/TarjetaPieza";
import { categorias, piezasPublicas } from "@/lib/datos";
import { familiaMaterial, familiasMaterial } from "@/lib/formas";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Todas las piezas únicas disponibles de Auralight: anillos, manillas, collares, cadenas y aretes.",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const texto = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function Catalogo({ searchParams }: Props) {
  const sp = await searchParams;
  const valores: ValoresFiltro = {
    categoria: texto(sp.categoria),
    material: texto(sp.material),
    precio: texto(sp.precio),
    orden: texto(sp.orden),
  };

  const [todas, cats] = await Promise.all([piezasPublicas(), categorias()]);
  let lista = todas;
  if (valores.categoria) lista = lista.filter((p) => p.categoria.slug === valores.categoria);
  if (valores.material) lista = lista.filter((p) => familiaMaterial(p.material) === valores.material);
  if (valores.precio) {
    const [min, max] = valores.precio.split("-").map(Number);
    if (!Number.isNaN(min) && !Number.isNaN(max)) lista = lista.filter((p) => p.precio >= min && p.precio <= max);
  }
  if (valores.orden === "precio-asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
  if (valores.orden === "precio-desc") lista = [...lista].sort((a, b) => b.precio - a.precio);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="font-display text-3xl text-marfil sm:text-4xl">Catálogo</h1>
      <p className="mt-2 max-w-2xl text-sm text-humo">
        Cada pieza es única: cuando alguien se la lleva, no vuelve. Si una te gusta, no la dejes pasar.
      </p>

      <div className="mt-6">
        <Filtros valores={valores} categorias={cats} materiales={familiasMaterial} />
      </div>

      <p className="mt-6 text-sm text-humo" aria-live="polite">
        {lista.length === 1 ? "1 pieza" : `${lista.length} piezas`}
      </p>

      {lista.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {lista.map((p) => (
            <TarjetaPieza key={p.codigo} pieza={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-borde p-10 text-center">
          <p className="text-marfil">No hay piezas con esos filtros.</p>
          <Link href="/catalogo" className="mt-2 inline-block text-sm text-oro hover:underline">
            Ver todas las piezas
          </Link>
        </div>
      )}
    </div>
  );
}
