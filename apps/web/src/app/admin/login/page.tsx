import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FormularioLogin } from "@/components/admin/FormularioLogin";

export const metadata: Metadata = { title: "Entrar" };

type Props = { searchParams: Promise<{ volver?: string; vencida?: string }> };

export default async function Login({ searchParams }: Props) {
  const { volver, vencida } = await searchParams;
  return (
    <main className="fondo-pavo flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image src="/logo-pavo.png" alt="" width={80} height={103} className="mx-auto h-20 w-auto" priority />
          <h1 className="mt-4 font-display text-2xl tracking-[0.18em] texto-oro">AURALIGHT</h1>
          <p className="mt-1 text-sm text-humo">Panel de administración</p>
        </div>
        <div className="rounded-3xl border border-borde bg-noche/80 p-6">
          <FormularioLogin volver={volver} vencida={vencida === "1"} />
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-humo hover:text-oro">
            ← Volver a la tienda
          </Link>
        </p>
      </div>
    </main>
  );
}
