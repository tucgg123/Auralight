"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { CalendarDays, Gem, Plus, Receipt } from "lucide-react";

const enlaces = [
  { href: "/admin/piezas", texto: "Piezas", icono: Gem, exacto: true },
  { href: "/admin/piezas/nueva", texto: "Nueva", icono: Plus, exacto: true },
  { href: "/admin/ventas", texto: "Ventas", icono: Receipt },
  { href: "/admin/ferias", texto: "Ferias", icono: CalendarDays },
];

function useActivo() {
  const ruta = usePathname();
  return (e: (typeof enlaces)[number]) =>
    e.exacto ? ruta === e.href || (e.href === "/admin/piezas" && /^\/admin\/piezas\/(?!nueva)/.test(ruta)) : ruta.startsWith(e.href);
}

/** Escritorio: enlaces en el encabezado. */
export function NavAdmin() {
  const activo = useActivo();
  return (
    <>
      <nav className="hidden items-center gap-6 md:flex" aria-label="Panel">
        {enlaces.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className={clsx("text-sm transition hover:text-oro", activo(e) ? "text-oro" : "text-marfil/80")}
          >
            {e.texto}
          </Link>
        ))}
      </nav>
    </>
  );
}

/**
 * Celular: barra fija abajo, a la mano del pulgar.
 * Va fuera del encabezado: su backdrop-blur haría que "fixed" se posicione dentro de él.
 */
export function NavAdminMovil() {
  const activo = useActivo();
  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-borde bg-noche/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Panel móvil"
      >
        {enlaces.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className={clsx(
              "flex flex-col items-center gap-1 py-2.5 text-[11px]",
              activo(e) ? "text-oro" : "text-humo",
            )}
          >
            <e.icono size={22} aria-hidden="true" />
            {e.texto}
          </Link>
        ))}
      </nav>
    </>
  );
}
