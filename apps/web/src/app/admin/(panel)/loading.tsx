import { Girando } from "@/components/admin/ui";

/** Se muestra mientras carga cualquier página del panel (por ejemplo, justo después de entrar). */
export default function Cargando() {
  return (
    <div role="status" className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-humo">
      <Girando className="size-8 text-oro" />
      <p className="text-sm">Cargando…</p>
    </div>
  );
}
