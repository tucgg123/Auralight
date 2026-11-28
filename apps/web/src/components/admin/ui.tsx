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
  cargando,
  className,
  ...props
}: ComponentProps<"button"> & {
  textoCargando?: string;
  variante?: "principal" | "secundario" | "peligro";
  /** El `isPending` de useActionState. useFormStatus no siempre se entera del envío, así que se pasa explícito. */
  cargando?: boolean;
}) {
  const { pending: enviando } = useFormStatus();
  const pending = cargando || enviando;
  return (
    <button
      type="submit"
      {...props}
      disabled={pending || props.disabled}
      aria-busy={pending}
      className={clsx(claseBoton(variante), className)}
    >
      {pending ? (
        <>
          <Girando />
          {textoCargando}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Círculo que gira, para mostrar que algo está pasando. */
export function Girando({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={clsx("size-4 animate-spin", className)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
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
