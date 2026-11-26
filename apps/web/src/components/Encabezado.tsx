"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const enlaces = [
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/vendidas", texto: "Vendidas" },
  { href: "/ferias", texto: "Ferias" },
];

export function Encabezado() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-borde/70 bg-noche/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setAbierto(false)}>
          <Image src="/logo-pavo.png" alt="" width={32} height={41} priority className="h-9 w-auto" />
          <span className="font-display text-xl tracking-[0.18em] texto-oro">AURALIGHT</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className={clsx(
                "text-sm tracking-wide transition-colors hover:text-oro",
                ruta.startsWith(e.href) ? "text-oro" : "text-marfil/80",
              )}
            >
              {e.texto}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="-mr-2 rounded-md p-2 text-marfil md:hidden"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
        >
          {abierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {abierto && (
        <nav className="border-t border-borde bg-noche md:hidden" aria-label="Principal móvil">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              onClick={() => setAbierto(false)}
              className={clsx(
                "block px-4 py-4 text-base",
                ruta.startsWith(e.href) ? "text-oro" : "text-marfil",
              )}
            >
              {e.texto}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
