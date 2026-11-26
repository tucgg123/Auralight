import type { Metadata } from "next";
import { TarjetaPieza } from "@/components/TarjetaPieza";
import { piezasVendidas } from "@/data/catalogo";

export const metadata: Metadata = {
  title: "Piezas vendidas",
  description: "Piezas de Auralight que ya encontraron dueño. Cuando se vende, no vuelve.",
};

export default function Vendidas() {
  const lista = piezasVendidas();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="font-display text-3xl text-marfil sm:text-4xl">Piezas vendidas</h1>
      <p className="mt-2 max-w-2xl text-sm text-humo">
        Estas piezas ya encontraron dueño. Las dejamos aquí como recuerdo… y como aviso: lo que te gusta hoy puede no
        estar mañana.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {lista.map((p) => (
          <TarjetaPieza key={p.codigo} pieza={p} />
        ))}
      </div>
    </div>
  );
}
