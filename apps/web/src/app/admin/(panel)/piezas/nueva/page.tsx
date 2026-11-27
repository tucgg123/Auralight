import type { Metadata } from "next";
import { FormularioPieza } from "@/components/admin/FormularioPieza";
import { categorias } from "@/lib/datos";

export const metadata: Metadata = { title: "Nueva pieza" };

export default async function NuevaPieza() {
  const cats = await categorias();
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl text-marfil">Nueva pieza</h1>
      <p className="mt-1 text-sm text-humo">Foto, precio y listo. El código (como #A-043) se asigna solo.</p>
      <div className="mt-6">
        <FormularioPieza categorias={cats} />
      </div>
    </div>
  );
}
