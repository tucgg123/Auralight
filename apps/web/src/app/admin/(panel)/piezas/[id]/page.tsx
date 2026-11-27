import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { AccionesPieza } from "@/components/admin/AccionesPieza";
import { FormularioPieza } from "@/components/admin/FormularioPieza";
import { GestorFotos } from "@/components/admin/GestorFotos";
import { PanelVenta } from "@/components/admin/PanelVenta";
import { PublicacionInstagram } from "@/components/admin/PublicacionInstagram";
import { Aviso } from "@/components/admin/ui";
import { InsigniaEstado } from "@/components/InsigniaEstado";
import { apiAdmin, ErrorApi, type FeriaAdmin, type PiezaAdmin } from "@/lib/admin/api";
import { textoPublicacion } from "@/lib/admin/instagram";
import { sitio } from "@/lib/config";
import { categorias } from "@/lib/datos";

export const metadata: Metadata = { title: "Editar pieza" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ nueva?: string; fotos?: string }> };

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-borde bg-carbon/60 p-4 sm:p-6">
      <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-pavo-claro">{titulo}</h2>
      {children}
    </section>
  );
}

export default async function EditarPieza({ params, searchParams }: Props) {
  const { id } = await params;
  const { nueva, fotos } = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const [pieza, cats, ferias] = await Promise.all([
    apiAdmin<PiezaAdmin>(`/admin/productos/${id}`).catch((e) => {
      if (e instanceof ErrorApi && e.status === 404) notFound();
      throw e;
    }),
    categorias(),
    apiAdmin<FeriaAdmin[]>("/admin/ferias"),
  ]);
  const publica = pieza.estado !== "OCULTA";

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/admin/piezas" className="inline-flex items-center gap-1 text-sm text-humo hover:text-oro">
        <ChevronLeft size={16} /> Piezas
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl text-marfil">{pieza.nombre}</h1>
        <InsigniaEstado estado={pieza.estado} admin />
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="font-mono text-humo">#{pieza.codigo}</span>
        {publica && (
          <Link href={`/pieza/${pieza.codigo}`} target="_blank" className="inline-flex items-center gap-1 text-oro hover:underline">
            Ver en la tienda <ExternalLink size={14} />
          </Link>
        )}
      </div>

      {nueva && <Aviso estado={{ ok: `¡Listo! La pieza #${pieza.codigo} ya está publicada.` }} />}
      {fotos === "error" && <Aviso estado={{ error: "La pieza se creó, pero alguna foto no se pudo agregar. Súbela de nuevo abajo." }} />}

      <Seccion titulo="Fotos">
        <GestorFotos productoId={pieza.id} imagenes={pieza.imagenes} />
      </Seccion>

      <Seccion titulo="Publicación para Instagram">
        <PublicacionInstagram
          productoId={pieza.id}
          codigo={pieza.codigo}
          fotos={pieza.imagenes.length}
          texto={textoPublicacion(pieza, sitio.url)}
        />
      </Seccion>

      <Seccion titulo={pieza.venta ? "Venta" : "Registrar venta"}>
        <PanelVenta pieza={pieza} ferias={ferias} />
      </Seccion>

      <Seccion titulo="Datos">
        <FormularioPieza
          key={pieza.actualizadoEn}
          categorias={cats}
          valores={{
            id: pieza.id,
            nombre: pieza.nombre,
            categoria: pieza.categoria.slug,
            material: pieza.material,
            precio: pieza.precio,
            descripcion: pieza.descripcion,
          }}
        />
      </Seccion>

      <Seccion titulo="Visibilidad">
        <AccionesPieza pieza={pieza} />
      </Seccion>
    </div>
  );
}
