export type EstadoPieza = "DISPONIBLE" | "RESERVADA" | "VENDIDA" | "OCULTA";

export type Acento = "esmeralda" | "zafiro" | "rubi" | "oro" | "onix" | "perla";

export type Forma = "anillo" | "manilla" | "collar" | "aretes" | "cadena";

export interface Categoria {
  slug: string;
  nombre: string;
  /** Nombre en singular para el mensaje de WhatsApp ("quiero el anillo…") */
  singular: string;
  articulo: string;
}

export interface Pieza {
  codigo: string;
  nombre: string;
  categoria: Categoria;
  material: string;
  /** Pesos colombianos, entero sin decimales */
  precio: number;
  descripcion: string;
  estado: EstadoPieza;
  /** URLs de Cloudinary, la primera es la principal. Vacío = se muestra una ilustración. */
  imagenes: string[];
  /** Color de la ilustración cuando no hay foto */
  acento: Acento;
  /** Fecha ISO de publicación */
  creadaEn: string;
  /** Fecha ISO de venta, solo si estado = VENDIDA */
  vendidaEn?: string | null;
}

export interface Feria {
  id: string;
  nombre: string;
  lugar: string;
  /** Fecha ISO (día) */
  fecha: string;
  horario?: string | null;
  /** true si es un dato inventado para la demo */
  ejemplo?: boolean;
}
