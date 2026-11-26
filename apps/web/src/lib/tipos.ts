export type EstadoPieza = "DISPONIBLE" | "RESERVADA" | "VENDIDA" | "OCULTA";

export type Acento = "esmeralda" | "zafiro" | "rubi" | "oro" | "onix" | "perla";

export interface Categoria {
  slug: string;
  nombre: string;
  /** Nombre en singular para el mensaje de WhatsApp ("quiero el anillo…") */
  singular: string;
  articulo: "el" | "la";
  prefijo: string;
  forma: "anillo" | "manilla" | "collar" | "aretes" | "cadena";
}

export interface Pieza {
  codigo: string;
  nombre: string;
  categoria: Categoria["slug"];
  material: string;
  /** Pesos colombianos, entero sin decimales */
  precio: number;
  descripcion: string;
  estado: EstadoPieza;
  acento: Acento;
  /** Fecha ISO de publicación */
  creadaEn: string;
  /** Fecha ISO de venta, solo si estado = VENDIDA */
  vendidaEn?: string;
}

export interface Feria {
  id: string;
  nombre: string;
  lugar: string;
  /** Fecha ISO (día) */
  fecha: string;
  horario?: string;
  /** true si es un dato inventado para la demo */
  ejemplo?: boolean;
}
