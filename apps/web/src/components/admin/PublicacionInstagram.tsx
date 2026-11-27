"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Copy, Download, Share2 } from "lucide-react";
import type { FormatoInstagram } from "@/lib/admin/instagram";
import { claseBoton } from "./ui";

/**
 * Genera la imagen y el texto para publicar la pieza en Instagram.
 * En el celular, «Compartir» abre el menú del sistema y desde ahí se elige Instagram.
 */
export function PublicacionInstagram({
  productoId,
  codigo,
  texto,
  fotos,
}: {
  productoId: string;
  codigo: string;
  texto: string;
  fotos: number;
}) {
  const [formato, setFormato] = useState<FormatoInstagram>("post");
  const [foto, setFoto] = useState(0);
  const [copiado, setCopiado] = useState(false);
  const [compartiendo, setCompartiendo] = useState(false);
  const [aviso, setAviso] = useState<string>();
  const url = `/admin/instagram/${productoId}?formato=${formato}&foto=${foto}`;

  async function copiar() {
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  async function compartir() {
    setAviso(undefined);
    setCompartiendo(true);
    try {
      const blob = await (await fetch(url)).blob();
      const archivo = new File([blob], `auralight-${codigo}-${formato}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [archivo] })) {
        // Instagram ignora el texto al compartir, por eso lo dejamos copiado.
        await navigator.clipboard.writeText(texto).catch(() => undefined);
        await navigator.share({ files: [archivo] });
        setAviso("El texto quedó copiado: pégalo como descripción en Instagram.");
      } else {
        setAviso("Tu navegador no permite compartir archivos. Usa «Descargar» y súbela desde Instagram.");
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setAviso("No se pudo compartir. Intenta con «Descargar».");
    } finally {
      setCompartiendo(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["post", "historia"] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={formato === f}
            onClick={() => setFormato(f)}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm",
              formato === f ? "border-oro bg-oro text-noche" : "border-borde text-marfil/85",
            )}
          >
            {f === "post" ? "Post (4:5)" : "Historia (9:16)"}
          </button>
        ))}
        {fotos > 1 && (
          <select
            value={foto}
            onChange={(e) => setFoto(Number(e.target.value))}
            className="rounded-full border border-borde bg-carbon px-3 py-2 text-sm text-marfil"
            aria-label="Foto"
          >
            {Array.from({ length: fotos }, (_, i) => (
              <option key={i} value={i}>
                Foto {i + 1}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,240px)_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={url}
          src={url}
          alt="Vista previa de la publicación"
          className={clsx(
            "w-full rounded-xl border border-borde bg-grafito",
            formato === "post" ? "aspect-[4/5]" : "mx-auto aspect-[9/16] max-w-[200px]",
          )}
        />
        <div className="space-y-3">
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-borde bg-noche p-3 font-sans text-sm text-marfil/90">
            {texto}
          </pre>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={compartir} disabled={compartiendo} className={claseBoton("principal")}>
              <Share2 size={16} /> {compartiendo ? "Preparando…" : "Compartir"}
            </button>
            <a href={`${url}&descargar=1`} download className={claseBoton("secundario")}>
              <Download size={16} /> Descargar
            </a>
            <button type="button" onClick={copiar} className={claseBoton("secundario")}>
              {copiado ? <Check size={16} /> : <Copy size={16} />} {copiado ? "Copiado" : "Copiar texto"}
            </button>
          </div>
          {aviso && <p className="text-sm text-pavo-claro">{aviso}</p>}
        </div>
      </div>
    </div>
  );
}
