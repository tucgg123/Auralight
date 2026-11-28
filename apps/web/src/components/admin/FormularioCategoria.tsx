"use client";

import { useActionState, useState, useTransition } from "react";
import { eliminarCategoria, guardarCategoria, type EstadoFormulario } from "@/app/admin/acciones";
import { Aviso, BotonEnviar, Campo, claseBoton, claseCampo } from "./ui";

interface Categoria {
  id?: number;
  nombre?: string;
  singular?: string;
  articulo?: string;
  prefijoCodigo?: string;
  piezas?: number;
  consecutivo?: number;
}

export function FormularioCategoria({ categoria = {} }: { categoria?: Categoria }) {
  const [estado, accion, cargando] = useActionState(guardarCategoria, {});
  const [borrado, setBorrado] = useState<EstadoFormulario>();
  const [borrando, iniciar] = useTransition();
  const conPiezas = Boolean(categoria.piezas);

  return (
    <form action={accion} className="space-y-3">
      {categoria.id && <input type="hidden" name="id" value={categoria.id} />}
      {/* Al crear una, la clave cambia y los campos quedan vacíos para la siguiente. */}
      <Campos key={categoria.id ? undefined : estado.ok} categoria={categoria} valores={estado.valores} />
      <Aviso estado={estado} />
      <Aviso estado={borrado} />
      <div className="flex flex-wrap gap-2">
        <BotonEnviar cargando={cargando}>{categoria.id ? "Guardar" : "Crear categoría"}</BotonEnviar>
        {categoria.id && !conPiezas && (
          <button
            type="button"
            disabled={borrando}
            onClick={() => iniciar(async () => setBorrado(await eliminarCategoria(categoria.id!)))}
            className={claseBoton("peligro")}
          >
            Eliminar
          </button>
        )}
      </div>
    </form>
  );
}

function Campos({ categoria, valores }: { categoria: Categoria; valores?: Record<string, string> }) {
  const v = { ...categoria, ...valores };
  const [singular, setSingular] = useState(v.singular ?? "");
  const [articulo, setArticulo] = useState(v.articulo ?? "el");
  const [prefijo, setPrefijo] = useState(v.prefijoCodigo ?? "");
  const conPiezas = Boolean(categoria.piezas);
  const siguiente = String((categoria.consecutivo ?? 0) + 1).padStart(3, "0");

  return (
    <>
      <Campo etiqueta="Nombre (en plural)">
        <input name="nombre" required minLength={2} maxLength={40} defaultValue={v.nombre} placeholder="Tobilleras" className={claseCampo} />
      </Campo>
      <div className="grid grid-cols-[6rem_1fr] gap-3">
        <Campo etiqueta="Artículo">
          <select name="articulo" value={articulo} onChange={(e) => setArticulo(e.target.value)} className={claseCampo}>
            {["el", "la", "los", "las"].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Una pieza se llama…">
          <input
            name="singular"
            required
            minLength={2}
            maxLength={40}
            value={singular}
            onChange={(e) => setSingular(e.target.value)}
            placeholder="tobillera"
            className={claseCampo}
          />
        </Campo>
      </div>
      <Campo
        etiqueta="Letra de los códigos"
        ayuda={
          conPiezas
            ? "No se puede cambiar: ya hay piezas con códigos de esta categoría."
            : "De 1 a 3 letras que no use otra categoría."
        }
      >
        <input
          name="prefijoCodigo"
          required={!conPiezas}
          disabled={conPiezas}
          pattern="[A-Za-z]{1,3}"
          maxLength={3}
          value={prefijo}
          onChange={(e) => setPrefijo(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())}
          placeholder="T"
          className={`${claseCampo} uppercase disabled:opacity-60`}
        />
      </Campo>

      {(singular || prefijo) && (
        <p className="rounded-xl bg-noche/60 px-4 py-3 text-xs text-humo">
          {prefijo && (
            <>
              Próximo código: <span className="font-mono text-oro">{prefijo}-{siguiente}</span>
              <br />
            </>
          )}
          {singular && (
            <>
              En WhatsApp: «Hola, quiero {articulo} <span className="text-marfil">{singular}</span>…»
            </>
          )}
        </p>
      )}
    </>
  );
}
