import { AvisoDemo } from "@/components/AvisoDemo";
import { Encabezado } from "@/components/Encabezado";
import { Pie } from "@/components/Pie";
import { usaApi } from "@/lib/datos";

export default function LayoutPublico({ children }: { children: React.ReactNode }) {
  return (
    <>
      {!usaApi && <AvisoDemo />}
      <Encabezado />
      <main>{children}</main>
      <Pie />
    </>
  );
}
