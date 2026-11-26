import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, Gem, Truck } from "lucide-react";
import { BotonWhatsApp } from "@/components/BotonWhatsApp";
import { ImagenPieza } from "@/components/ImagenPieza";
import { InsigniaEstado } from "@/components/InsigniaEstado";
import { TarjetaPieza } from "@/components/TarjetaPieza";
import { categoriaPorSlug, piezaPorCodigo, relacionadas, todasLasPiezas } from "@/data/catalogo";
import { formatearPrecio, mensajePieza } from "@/lib/formato";

type Props = { params: Promise<{ codigo: string }> };

export const revalidate = 300;

export function generateStaticParams() {
  return todasLasPiezas().map((p) => ({ codigo: p.codigo }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codigo } = await params;
  const pieza = piezaPorCodigo(codigo);
  if (!pieza) return { title: "Pieza no encontrada" };
  const titulo = `${pieza.nombre} · ${formatearPrecio(pieza.precio)}`;
  return {
    title: pieza.nombre,
    description: `${pieza.descripcion} Pieza única #${pieza.codigo}.`,
    openGraph: { title: titulo, description: pieza.descripcion, url: `/pieza/${pieza.codigo}` },
    twitter: { card: "summary_large_image", title: titulo, description: pieza.descripcion },
  };
}

export default async function DetallePieza({ params }: Props) {
  const { codigo } = await params;
  const pieza = piezaPorCodigo(codigo);
  if (!pieza) notFound();

  const cat = categoriaPorSlug(pieza.categoria);
  const otras = relacionadas(pieza);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <Link
        href={pieza.estado === "VENDIDA" ? "/vendidas" : "/catalogo"}
        className="inline-flex items-center gap-1 text-sm text-humo hover:text-oro"
      >
        <ChevronLeft size={16} /> {pieza.estado === "VENDIDA" ? "Piezas vendidas" : "Catálogo"}
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative overflow-hidden rounded-3xl border border-borde">
          <ImagenPieza
            forma={cat?.forma ?? "collar"}
            acento={pieza.acento}
            etiqueta={`Imagen de ${pieza.nombre}`}
            className={pieza.estado === "VENDIDA" ? "w-full opacity-50 grayscale" : "w-full"}
          />
          <InsigniaEstado estado={pieza.estado} className="absolute left-4 top-4 text-xs" />
        </div>

        <div className="md:py-4">
          <p className="text-xs uppercase tracking-[0.25em] text-pavo-claro">
            {cat?.nombre} · <span className="font-mono">#{pieza.codigo}</span>
          </p>
          <h1 className="mt-2 font-display text-3xl text-marfil sm:text-4xl">{pieza.nombre}</h1>
          <p className={pieza.estado === "VENDIDA" ? "mt-3 text-2xl text-humo line-through" : "mt-3 font-display text-3xl text-oro"}>
            {formatearPrecio(pieza.precio)}
          </p>

          <p className="mt-5 leading-relaxed text-marfil/85">{pieza.descripcion}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-borde bg-carbon p-3">
              <dt className="text-humo">Material</dt>
              <dd className="mt-0.5 text-marfil">{pieza.material}</dd>
            </div>
            <div className="rounded-xl border border-borde bg-carbon p-3">
              <dt className="text-humo">Unidades</dt>
              <dd className="mt-0.5 text-marfil">1 (pieza única)</dd>
            </div>
          </dl>

          <div className="mt-8">
            {pieza.estado === "DISPONIBLE" && (
              <>
                <BotonWhatsApp mensaje={mensajePieza(pieza)} className="w-full py-4 text-base sm:w-auto sm:px-10">
                  Lo quiero
                </BotonWhatsApp>
                <p className="mt-3 text-xs text-humo">
                  Se abre WhatsApp con el código <span className="font-mono">#{pieza.codigo}</span> ya escrito.
                </p>
              </>
            )}
            {pieza.estado === "RESERVADA" && (
              <div className="rounded-2xl border border-zafiro/50 bg-zafiro/10 p-4">
                <p className="flex items-center gap-2 font-medium text-marfil">
                  <Clock size={18} aria-hidden="true" /> Alguien la está apartando
                </p>
                <p className="mt-1 text-sm text-humo">
                  Si la reserva vence, vuelve a estar disponible. Puedes pedir que te avisemos.
                </p>
                <BotonWhatsApp
                  variante="secundario"
                  className="mt-4"
                  mensaje={`Hola Auralight, si se libera la pieza #${pieza.codigo} (${pieza.nombre}), ¿me avisan?`}
                >
                  Avísame si se libera
                </BotonWhatsApp>
              </div>
            )}
            {pieza.estado === "VENDIDA" && (
              <div className="rounded-2xl border border-borde bg-carbon p-4">
                <p className="font-medium text-marfil">Esta pieza ya encontró dueño.</p>
                <p className="mt-1 text-sm text-humo">Pero hay más esperando por ti.</p>
                <Link href="/catalogo" className="mt-3 inline-block text-sm text-oro hover:underline">
                  Ver piezas disponibles →
                </Link>
              </div>
            )}
          </div>

          <ul className="mt-8 space-y-3 border-t border-borde pt-6 text-sm text-humo">
            <li className="flex gap-3">
              <Gem size={18} className="shrink-0 text-oro" aria-hidden="true" />
              Cuando se vende, no vuelve: no hay otra igual.
            </li>
            <li className="flex gap-3">
              <Truck size={18} className="shrink-0 text-oro" aria-hidden="true" />
              Entrega y forma de pago se acuerdan por WhatsApp.
            </li>
          </ul>
        </div>
      </div>

      {otras.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl text-marfil">También te puede gustar</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {otras.map((p) => (
              <TarjetaPieza key={p.codigo} pieza={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
