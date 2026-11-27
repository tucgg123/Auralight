import clsx from "clsx";
import { fotoCloudinary, formaDeCategoria } from "@/lib/formas";
import type { Pieza } from "@/lib/tipos";
import { ImagenPieza } from "./ImagenPieza";

/** Muestra la foto principal de la pieza, o una ilustración si todavía no tiene fotos. */
export function FotoPieza({
  pieza,
  ancho,
  className,
  indice = 0,
  prioridad,
}: {
  pieza: Pick<Pieza, "nombre" | "imagenes" | "acento" | "categoria">;
  ancho: number;
  className?: string;
  indice?: number;
  prioridad?: boolean;
}) {
  const url = pieza.imagenes[indice];
  if (!url) {
    return (
      <ImagenPieza
        forma={formaDeCategoria(pieza.categoria.slug)}
        acento={pieza.acento}
        etiqueta={pieza.nombre}
        className={className}
      />
    );
  }
  return (
    // Cloudinary ya entrega la imagen optimizada (formato, calidad y tamaño), por eso no usamos next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fotoCloudinary(url, ancho)}
      srcSet={`${fotoCloudinary(url, ancho)} 1x, ${fotoCloudinary(url, ancho * 2)} 2x`}
      alt={pieza.nombre}
      width={ancho}
      height={ancho}
      loading={prioridad ? "eager" : "lazy"}
      className={clsx("aspect-square object-cover", className)}
    />
  );
}
