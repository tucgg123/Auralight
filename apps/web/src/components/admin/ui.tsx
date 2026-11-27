"use client";

import clsx from "clsx";
import { useFormStatus } from "react-dom";
import type { ComponentProps, ReactNode } from "react";
import { claseBoton } from "@/lib/admin/estilos";

export { claseBoton, claseCampo } from "@/lib/admin/estilos";

export function Campo({ etiqueta, ayuda, children }: { etiqueta: string; ayuda?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-marfil/90">{etiqueta}</span>
      {children}
      {ayuda && <span className="mt-1 block text-xs text-humo">{ayuda}</span>}
    </label>
  );
}

export function BotonEnviar({
  children,
  textoCargando = "Guardando…",
  variante = "principal",
  className,
  ...props
}: ComponentProps<"button"> & { textoCargando?: string; variante?: "principal" | "secundario" | "peligro" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      className={clsx(claseBoton(variante), className)}
      {...props}
    >
      {pending ? textoCargando : children}
    </button>
  );
}


export function Aviso({ estado }: { estado?: { error?: string; ok?: string } }) {
  if (!estado?.error && !estado?.ok) return null;
  return (
    <p
      role={estado.error ? "alert" : "status"}
      className={clsx(
        "rounded-xl px-4 py-3 text-sm",
        estado.error ? "bg-red-500/15 text-red-200" : "bg-pavo/15 text-pavo-claro",
      )}
    >
      {estado.error ?? estado.ok}
    </p>
  );
}
