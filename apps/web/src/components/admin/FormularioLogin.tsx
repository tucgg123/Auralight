"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { iniciarSesion } from "@/app/admin/acciones";
import { Aviso, BotonEnviar, Campo, claseCampo } from "./ui";

export function FormularioLogin({ volver, vencida }: { volver?: string; vencida?: boolean }) {
  const [estado, accion, cargando] = useActionState(iniciarSesion, vencida ? { error: "Tu sesión venció. Entra de nuevo." } : {});
  return (
    <form action={accion} className="space-y-4">
      <input type="hidden" name="volver" value={volver ?? ""} />
      <Campo etiqueta="Correo">
        <input name="email" type="email" autoComplete="username" required defaultValue={estado.valores?.email} className={claseCampo} />
      </Campo>
      <Campo etiqueta="Contraseña">
        <input name="contrasena" type="password" autoComplete="current-password" required minLength={8} className={claseCampo} />
      </Campo>
      <Aviso estado={estado} />
      <BotonEnviar className="w-full" textoCargando="Entrando…" cargando={cargando}>
        Entrar
      </BotonEnviar>
      <PantallaEntrando cargando={cargando} />
    </form>
  );
}

/**
 * Mientras se valida la contraseña (y se carga el panel) cubre la pantalla con el logo
 * animado. Si tarda, avisa que la API puede estar despertando: en el plan gratis de
 * Render la primera petición después de un rato tarda hasta un minuto.
 */
function PantallaEntrando({ cargando }: { cargando: boolean }) {
  const [lento, setLento] = useState(false);

  useEffect(() => {
    if (!cargando) return setLento(false);
    const t = setTimeout(() => setLento(true), 6000);
    return () => clearTimeout(t);
  }, [cargando]);

  if (!cargando) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-noche/90 px-6 text-center backdrop-blur-sm animate-[aparecer_200ms_ease-out]"
    >
      <div className="relative grid size-32 place-items-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-oro/15 border-t-oro [animation-duration:1.4s]" />
        <span className="absolute inset-3 animate-ping rounded-full bg-pavo/10 [animation-duration:2s]" />
        <Image src="/logo-pavo.png" alt="" width={56} height={72} className="relative h-16 w-auto animate-pulse" />
      </div>
      <p className="mt-6 font-display text-lg tracking-[0.18em] texto-oro">Entrando al panel</p>
      <p className="mt-2 max-w-xs text-sm text-humo">
        {lento ? "El servidor se está despertando. Puede tardar hasta un minuto, no cierres la página." : "Verificando tus datos…"}
      </p>
    </div>
  );
}
