import Link from "next/link";
import { sitio } from "@/lib/config";
import { enlaceWhatsApp } from "@/lib/formato";

export function Pie() {
  return (
    <footer className="mt-24 border-t border-borde">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg tracking-[0.18em] texto-oro">AURALIGHT</p>
          <p className="mt-2 text-sm text-humo">{sitio.lema}</p>
        </div>
        <nav className="flex flex-col gap-2 text-sm" aria-label="Pie de página">
          <Link href="/catalogo" className="text-marfil/80 hover:text-oro">Catálogo</Link>
          <Link href="/vendidas" className="text-marfil/80 hover:text-oro">Piezas vendidas</Link>
          <Link href="/ferias" className="text-marfil/80 hover:text-oro">Próximas ferias</Link>
        </nav>
        <div className="text-sm">
          <p className="text-humo">¿Preguntas o encargos?</p>
          <a
            href={enlaceWhatsApp("Hola Auralight, tengo una pregunta.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-pavo-claro hover:underline"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-humo/70">
        © {new Date().getFullYear()} Auralight. Hecho con dedicación en Colombia.
      </p>
    </footer>
  );
}
