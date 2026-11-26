import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Gem, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { BotonWhatsApp } from "@/components/BotonWhatsApp";
import { ImagenPieza } from "@/components/ImagenPieza";
import { TarjetaPieza } from "@/components/TarjetaPieza";
import { categorias, feriasOrdenadas, novedades, piezasPublicas, piezasVendidas } from "@/data/catalogo";
import { sitio } from "@/lib/config";
import { formatearFecha } from "@/lib/formato";

export const revalidate = 3600;

const pasos = [
  { icono: Gem, titulo: "Elige tu pieza", texto: "Cada pieza existe una sola vez. Mira el catálogo y encuentra la tuya." },
  {
    icono: MessageCircle,
    titulo: "Toca «Lo quiero»",
    texto: "Se abre WhatsApp con el código de la pieza ya escrito. Solo envías el mensaje.",
  },
  { icono: Sparkles, titulo: "Es tuya", texto: "Acordamos el pago y la entrega. Cuando se vende, no vuelve." },
];

export default function Inicio() {
  const nuevas = novedades(4);
  const { proximas } = feriasOrdenadas();
  const proxima = proximas[0];
  const vendidas = piezasVendidas().slice(0, 4);
  const disponibles = piezasPublicas().filter((p) => p.estado === "DISPONIBLE").length;

  return (
    <>
      {/* Portada */}
      <section className="fondo-pavo">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-14 text-center md:pt-20">
          <Image
            src="/logo-pavo.png"
            alt="Pavo real de Auralight"
            width={460}
            height={590}
            priority
            className="h-44 w-auto drop-shadow-[0_10px_40px_rgba(31,163,154,0.35)] md:h-56"
          />
          <h1 className="mt-6 font-display text-4xl tracking-[0.2em] texto-oro sm:text-6xl">AURALIGHT</h1>
          <p className="mt-4 max-w-xl text-balance text-lg text-marfil/90 sm:text-xl">{sitio.lema}</p>
          <p className="mt-2 text-sm text-humo">
            Anillos, manillas, collares, cadenas y aretes. {disponibles} piezas disponibles hoy.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-oro-claro to-oro px-7 py-3 text-sm font-semibold text-noche transition hover:brightness-110"
            >
              Ver catálogo <ArrowRight size={16} />
            </Link>
            <BotonWhatsApp mensaje="Hola Auralight, quiero ver qué piezas tienen disponibles." variante="secundario">
              Escríbenos
            </BotonWhatsApp>
          </div>
        </div>
      </section>

      {/* Novedades */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-pavo-claro">Recién llegadas</p>
            <h2 className="mt-1 font-display text-2xl text-marfil sm:text-3xl">Novedades</h2>
          </div>
          <Link href="/catalogo" className="shrink-0 text-sm text-oro hover:underline">
            Ver todo
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {nuevas.map((p) => (
            <TarjetaPieza key={p.codigo} pieza={p} />
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <h2 className="font-display text-2xl text-marfil sm:text-3xl">Explora por categoría</h2>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {categorias.map((c, i) => (
            <Link
              key={c.slug}
              href={`/catalogo?categoria=${c.slug}`}
              className="group overflow-hidden rounded-2xl border border-borde bg-carbon text-center transition hover:border-oro/50"
            >
              <ImagenPieza
                forma={c.forma}
                acento={(["esmeralda", "zafiro", "oro", "rubi", "perla"] as const)[i % 5]}
                etiqueta=""
                className="aspect-square w-full transition group-hover:scale-105"
              />
              <p className="py-3 text-sm text-marfil group-hover:text-oro">{c.nombre}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cómo comprar */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <div className="rounded-3xl border border-borde bg-carbon p-6 sm:p-10">
          <h2 className="text-center font-display text-2xl text-marfil sm:text-3xl">Cómo comprar</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {pasos.map((p, i) => (
              <li key={p.titulo} className="flex gap-4 sm:flex-col sm:items-center sm:text-center">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-oro/40 text-oro">
                  <p.icono size={22} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-marfil">
                    {i + 1}. {p.titulo}
                  </p>
                  <p className="mt-1 text-sm text-humo">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Próxima feria */}
      {proxima && (
        <section className="mx-auto max-w-6xl px-4 pt-16">
          <div className="flex flex-col gap-4 rounded-3xl border border-pavo/40 bg-gradient-to-br from-pavo/15 to-zafiro/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-pavo-claro">Nos vemos en persona</p>
              <h2 className="mt-1 font-display text-xl text-marfil sm:text-2xl">{proxima.nombre}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-marfil/85">
                <CalendarDays size={16} aria-hidden="true" /> <span>{formatearFecha(proxima.fecha)}</span>
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-marfil/85">
                <MapPin size={16} aria-hidden="true" /> {proxima.lugar}
              </p>
            </div>
            <Link href="/ferias" className="shrink-0 text-sm font-medium text-pavo-claro hover:underline">
              Ver todas las ferias →
            </Link>
          </div>
        </section>
      )}

      {/* Vendidas */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-humo">Ya encontraron dueño</p>
            <h2 className="mt-1 font-display text-2xl text-marfil sm:text-3xl">Piezas vendidas</h2>
          </div>
          <Link href="/vendidas" className="shrink-0 text-sm text-oro hover:underline">
            Ver galería
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {vendidas.map((p) => (
            <TarjetaPieza key={p.codigo} pieza={p} />
          ))}
        </div>
      </section>
    </>
  );
}
