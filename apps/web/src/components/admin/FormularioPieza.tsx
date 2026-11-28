"use client";

import { useActionState, useState } from "react";
import { X } from "lucide-react";
import { guardarPieza } from "@/app/admin/acciones";
import { fotoCloudinary } from "@/lib/formas";
import { SubidorFotos } from "./SubidorFotos";
import { Aviso, BotonEnviar, Campo, claseCampo } from "./ui";

interface Valores {
  id?: string;
  nombre?: string;
  categoria?: string;
  material?: string;
  precio?: number;
  descripcion?: string;
}

const materialesSugeridos = [
  "Acero inoxidable",
  "Acero inoxidable dorado",
  "Acero inoxidable negro",
  "Baño de oro",
  "Plata 925",
  "Aleación plateada",
  "Hilo trenzado",
  "Hilo encerado",
];

export function FormularioPieza({
  categorias,
  valores = {},
}: {
  categorias: { slug: string; nombre: string }[];
  valores?: Valores;
}) {
  const [estado, accion, cargando] = useActionState(guardarPieza, {});
  const [fotos, setFotos] = useState<{ publicId: string; url: string }[]>([]);
  const nueva = !valores.id;
  // Si hubo un error, se vuelve a llenar con lo que se envió.
  const v = { ...valores, ...estado.valores, precio: estado.valores?.precio ?? valores.precio?.toLocaleString("es-CO") };

  return (
    <form action={accion} className="space-y-5">
      {valores.id && <input type="hidden" name="id" value={valores.id} />}

      {nueva && (
        <div>
          <input type="hidden" name="fotos" value={JSON.stringify(fotos.map((f) => f.publicId))} />
          {fotos.length > 0 && (
            <ul className="mb-3 grid grid-cols-4 gap-2">
              {fotos.map((f, i) => (
                <li key={f.publicId} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fotoCloudinary(f.url, 200)} alt={`Foto ${i + 1}`} className="aspect-square w-full rounded-xl object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-noche/80 px-1.5 text-[10px] text-oro">Principal</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setFotos((l) => l.filter((x) => x.publicId !== f.publicId))}
                    className="absolute right-1 top-1 rounded-full bg-noche/80 p-1 text-marfil"
                    aria-label={`Quitar foto ${i + 1}`}
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <SubidorFotos
            grande={fotos.length === 0}
            actuales={fotos.length}
            onSubida={(f) => setFotos((l) => [...l, f])}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Precio">
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-humo">$</span>
            <input
              name="precio"
              inputMode="numeric"
              pattern="[0-9.]*"
              required
              defaultValue={v.precio ?? ""}
              placeholder="25.000"
              className={`${claseCampo} pl-7`}
              onChange={(e) => {
                const n = e.target.value.replace(/\D/g, "");
                e.target.value = n ? Number(n).toLocaleString("es-CO") : "";
              }}
            />
          </div>
        </Campo>
        <Campo etiqueta="Categoría">
          <select name="categoria" required defaultValue={v.categoria ?? ""} className={claseCampo}>
            <option value="" disabled>
              Elegir…
            </option>
            {categorias.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nombre}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <Campo etiqueta="Nombre" ayuda="Así aparece en el catálogo. Ej.: Anillo Serpiente Esmeralda">
        <input name="nombre" required minLength={2} maxLength={80} defaultValue={v.nombre} className={claseCampo} />
      </Campo>

      <Campo etiqueta="Material">
        <input
          name="material"
          required
          minLength={2}
          maxLength={80}
          list="materiales"
          defaultValue={v.material}
          className={claseCampo}
        />
        <datalist id="materiales">
          {materialesSugeridos.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
      </Campo>

      <Campo etiqueta="Descripción (opcional)">
        <textarea
          name="descripcion"
          rows={3}
          maxLength={1000}
          defaultValue={v.descripcion}
          className={claseCampo}
          placeholder="Detalles, medidas, para quién es ideal…"
        />
      </Campo>

      <Aviso estado={estado} />
      <BotonEnviar cargando={cargando} className="w-full sm:w-auto sm:px-10">{nueva ? "Publicar pieza" : "Guardar cambios"}</BotonEnviar>
    </form>
  );
}
