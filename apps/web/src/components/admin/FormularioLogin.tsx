"use client";

import { useActionState } from "react";
import { iniciarSesion } from "@/app/admin/acciones";
import { Aviso, BotonEnviar, Campo, claseCampo } from "./ui";

export function FormularioLogin({ volver, vencida }: { volver?: string; vencida?: boolean }) {
  const [estado, accion] = useActionState(iniciarSesion, vencida ? { error: "Tu sesión venció. Entra de nuevo." } : {});
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
      <BotonEnviar className="w-full" textoCargando="Entrando…">
        Entrar
      </BotonEnviar>
    </form>
  );
}
