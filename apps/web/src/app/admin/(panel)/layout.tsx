import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { cerrarSesion } from "@/app/admin/acciones";
import { NavAdmin, NavAdminMovil } from "@/components/admin/NavAdmin";
import { urlApi } from "@/lib/admin/sesion";

export const dynamic = "force-dynamic";

export default function LayoutPanel({ children }: { children: React.ReactNode }) {
  if (!urlApi()) {
    return (
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-2xl text-marfil">Falta conectar la API</h1>
        <p className="mt-3 text-sm text-humo">
          El panel necesita la variable <code className="text-oro">API_URL</code> con la dirección de la API de Auralight.
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-dvh pb-24 md:pb-10">
      <header className="sticky top-0 z-30 border-b border-borde bg-noche/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <Link href="/admin/piezas" className="flex items-center gap-2">
            <Image src="/logo-pavo.png" alt="" width={24} height={31} className="h-7 w-auto" />
            <span className="font-display text-sm tracking-[0.18em] texto-oro">PANEL</span>
          </Link>
          <NavAdmin />
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-xs text-humo hover:text-oro">
              Ver tienda
            </Link>
            <form action={cerrarSesion}>
              <button type="submit" className="flex items-center gap-1 text-xs text-humo hover:text-oro" aria-label="Cerrar sesión">
                <LogOut size={16} /> <span className="hidden sm:inline">Salir</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <NavAdminMovil />
      <div className="mx-auto max-w-5xl px-4 pt-6">{children}</div>
    </div>
  );
}
