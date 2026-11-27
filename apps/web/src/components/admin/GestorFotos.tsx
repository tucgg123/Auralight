"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import clsx from "clsx";
import { Star, Trash2 } from "lucide-react";
import { agregarImagen, eliminarImagen, hacerPrincipal } from "@/app/admin/acciones";
import { fotoCloudinary } from "@/lib/formas";
import { SubidorFotos } from "./SubidorFotos";

export function GestorFotos({
  productoId,
  imagenes,
}: {
  productoId: string;
  imagenes: { id: string; url: string | null }[];
}) {
  const router = useRouter();
  const [ocupado, iniciar] = useTransition();
  const hacer = (fn: () => Promise<unknown>) => iniciar(async () => {
    await fn();
    router.refresh();
  });

  return (
    <div className={clsx(ocupado && "pointer-events-none opacity-60")}>
      {imagenes.length > 0 && (
        <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {imagenes.map((img, i) => (
            <li key={img.id} className="relative overflow-hidden rounded-xl border border-borde">
              {img.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fotoCloudinary(img.url, 240)} alt={`Foto ${i + 1}`} className="aspect-square w-full object-cover" />
              ) : (
                <div className="aspect-square bg-grafito" />
              )}
              {i === 0 ? (
                <span className="absolute bottom-1 left-1 rounded bg-noche/80 px-1.5 text-[10px] text-oro">Principal</span>
              ) : (
                <button
                  type="button"
                  onClick={() => hacer(() => hacerPrincipal(img.id))}
                  className="absolute bottom-1 left-1 rounded-full bg-noche/80 p-1.5 text-marfil"
                  aria-label={`Usar foto ${i + 1} como principal`}
                >
                  <Star size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => hacer(() => eliminarImagen(img.id))}
                className="absolute right-1 top-1 rounded-full bg-noche/80 p-1.5 text-red-300"
                aria-label={`Eliminar foto ${i + 1}`}
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <SubidorFotos
        actuales={imagenes.length}
        onSubida={async ({ publicId }) => {
          await agregarImagen(productoId, publicId);
          router.refresh();
        }}
      />
    </div>
  );
}
