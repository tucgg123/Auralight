"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import clsx from "clsx";
import { firmarSubida } from "@/app/admin/acciones";
import { subirACloudinary } from "@/lib/admin/subir";

/**
 * Botón para tomar o elegir fotos. Las sube a Cloudinary y avisa con onSubida.
 * En el celular, el selector ofrece la cámara directamente.
 */
export function SubidorFotos({
  onSubida,
  maximo = 8,
  actuales = 0,
  grande,
}: {
  onSubida: (foto: { publicId: string; url: string }) => Promise<void> | void;
  maximo?: number;
  actuales?: number;
  grande?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(0);
  const [error, setError] = useState<string>();
  const lleno = actuales >= maximo;

  async function alElegir(archivos: FileList | null) {
    if (!archivos?.length) return;
    setError(undefined);
    const lista = Array.from(archivos).slice(0, maximo - actuales);
    const firma = await firmarSubida();
    if ("error" in firma) {
      setError(firma.error);
      return;
    }
    setSubiendo(lista.length);
    for (const archivo of lista) {
      try {
        await onSubida(await subirACloudinary(archivo, firma));
      } catch {
        setError(`No se pudo subir ${archivo.name}. Revisa la conexión e intenta otra vez.`);
      }
      setSubiendo((n) => n - 1);
    }
    if (input.current) input.current.value = "";
  }

  return (
    <div>
      <button
        type="button"
        disabled={lleno || subiendo > 0}
        onClick={() => input.current?.click()}
        className={clsx(
          "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-oro/40 bg-carbon text-oro transition hover:border-oro disabled:opacity-50",
          grande ? "aspect-[4/3] sm:aspect-[2/1]" : "py-6",
        )}
      >
        {subiendo > 0 ? (
          <>
            <Loader2 className="animate-spin" size={28} />
            <span className="text-sm">Subiendo {subiendo === 1 ? "1 foto" : `${subiendo} fotos`}…</span>
          </>
        ) : (
          <>
            <Camera size={grande ? 36 : 26} />
            <span className="text-sm font-medium">{lleno ? `Máximo ${maximo} fotos` : "Tomar o elegir fotos"}</span>
            {grande && <span className="text-xs text-humo">La primera foto es la que se ve en el catálogo</span>}
          </>
        )}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => alElegir(e.target.files)}
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
