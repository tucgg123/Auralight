import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { RegistrarVentaDto } from "./dto/venta.dto";

@Injectable()
export class VentasService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Marca la pieza como vendida y registra la venta en una sola transacción.
   * La actualización es condicional (solo si no estaba vendida) y además
   * VENTA.producto_id es único, así que una pieza nunca se vende dos veces.
   */
  async registrar(productoId: string, dto: RegistrarVentaDto, adminId?: string) {
    if (dto.canal !== "FERIA" && dto.feriaId) {
      throw new BadRequestException("Solo las ventas en feria llevan feria.");
    }
    try {
      return await this.prisma.$transaction(async (tx) => {
        const producto = await tx.producto.findUnique({ where: { id: productoId } });
        if (!producto) throw new NotFoundException("La pieza no existe.");

        if (dto.feriaId && !(await tx.feria.findUnique({ where: { id: dto.feriaId } }))) {
          throw new BadRequestException("La feria no existe.");
        }

        const { count } = await tx.producto.updateMany({
          where: { id: productoId, estado: { not: "VENDIDA" } },
          data: { estado: "VENDIDA", reservadoHasta: null },
        });
        if (count === 0) throw new ConflictException("Esta pieza ya está vendida.");

        await tx.reserva.updateMany({
          where: { productoId, estado: { in: ["ACTIVA", "CONFIRMADA"] } },
          data: { estado: "CONVERTIDA" },
        });

        return tx.venta.create({
          data: {
            productoId,
            canal: dto.canal,
            feriaId: dto.feriaId,
            precioFinal: dto.precioFinal ?? producto.precio,
            registradaPor: adminId,
          },
          include: { feria: { select: { id: true, nombre: true } } },
        });
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && (e.code === "P2002" || e.code === "P2034")) {
        throw new ConflictException("Esta pieza ya está vendida.");
      }
      throw e;
    }
  }

  /** Deshace una venta registrada por error: la pieza vuelve a estar disponible. */
  async deshacer(productoId: string) {
    return this.prisma.$transaction(async (tx) => {
      const venta = await tx.venta.findUnique({ where: { productoId } });
      if (!venta) throw new NotFoundException("Esta pieza no tiene una venta registrada.");
      await tx.venta.delete({ where: { productoId } });
      await tx.producto.update({ where: { id: productoId }, data: { estado: "DISPONIBLE" } });
    });
  }

  listar(limite = 50) {
    return this.prisma.venta.findMany({
      orderBy: { fecha: "desc" },
      take: limite,
      include: {
        producto: { select: { id: true, codigo: true, nombre: true, precio: true } },
        feria: { select: { id: true, nombre: true } },
      },
    });
  }
}
