import { Injectable } from "@nestjs/common";
import { EstadoProducto, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { formatearCodigo } from "./codigo";

export const incluirProducto = {
  categoria: { select: { slug: true, nombre: true, singular: true, articulo: true } },
  imagenes: { orderBy: { orden: "asc" }, select: { id: true, publicId: true, orden: true } },
  venta: {
    select: { id: true, fecha: true, canal: true, precioFinal: true, feria: { select: { id: true, nombre: true } } },
  },
} satisfies Prisma.ProductoInclude;

export type ProductoCompleto = Prisma.ProductoGetPayload<{ include: typeof incluirProducto }>;

export interface Filtro {
  estados: EstadoProducto[];
  categoria?: string;
  precioMin?: number;
  precioMax?: number;
  q?: string;
  orden?: "recientes" | "precio-asc" | "precio-desc" | "vendidas";
}

/** Único lugar de este módulo que habla con la base de datos. */
@Injectable()
export class ProductosRepository {
  constructor(private readonly prisma: PrismaService) {}

  listar(f: Filtro): Promise<ProductoCompleto[]> {
    const where: Prisma.ProductoWhereInput = {
      estado: { in: f.estados },
      ...(f.categoria && { categoria: { slug: f.categoria } }),
      ...((f.precioMin !== undefined || f.precioMax !== undefined) && {
        precio: { gte: f.precioMin, lte: f.precioMax },
      }),
      ...(f.q && {
        OR: [
          { nombre: { contains: f.q, mode: "insensitive" } },
          { codigo: { contains: f.q, mode: "insensitive" } },
          { material: { contains: f.q, mode: "insensitive" } },
        ],
      }),
    };
    const orderBy: Prisma.ProductoOrderByWithRelationInput[] =
      f.orden === "precio-asc"
        ? [{ precio: "asc" }]
        : f.orden === "precio-desc"
          ? [{ precio: "desc" }]
          : f.orden === "vendidas"
            ? [{ venta: { fecha: "desc" } }, { actualizadoEn: "desc" }]
            : [{ creadoEn: "desc" }];
    return this.prisma.producto.findMany({ where, orderBy, include: incluirProducto });
  }

  porCodigo(codigo: string) {
    return this.prisma.producto.findUnique({ where: { codigo: codigo.toUpperCase() }, include: incluirProducto });
  }

  porId(id: string) {
    return this.prisma.producto.findUnique({ where: { id }, include: incluirProducto });
  }

  categoriaPorSlug(slug: string) {
    return this.prisma.categoria.findUnique({ where: { slug } });
  }

  /**
   * Crea la pieza con un código nuevo. El consecutivo se incrementa de forma atómica
   * dentro de la transacción, así dos piezas creadas a la vez nunca comparten código.
   */
  crear(datos: { nombre: string; material: string; precio: number; descripcion: string; categoriaId: number }) {
    return this.prisma.$transaction(async (tx) => {
      const cat = await tx.categoria.update({
        where: { id: datos.categoriaId },
        data: { consecutivo: { increment: 1 } },
      });
      return tx.producto.create({
        data: { ...datos, codigo: formatearCodigo(cat.prefijoCodigo, cat.consecutivo) },
        include: incluirProducto,
      });
    });
  }

  actualizar(id: string, datos: Prisma.ProductoUncheckedUpdateInput) {
    return this.prisma.producto.update({ where: { id }, data: datos, include: incluirProducto });
  }

  /** Cambia el estado solo si la pieza no está vendida. Devuelve cuántas filas cambió (0 o 1). */
  async cambiarEstadoSiNoVendida(id: string, estado: "DISPONIBLE" | "OCULTA") {
    const r = await this.prisma.producto.updateMany({
      where: { id, estado: { not: "VENDIDA" } },
      data: { estado, reservadoHasta: null },
    });
    return r.count;
  }

  eliminar(id: string) {
    return this.prisma.producto.delete({ where: { id } });
  }
}
