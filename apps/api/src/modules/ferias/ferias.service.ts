import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { ActualizarFeriaDto, CrearFeriaDto } from "./dto/feria.dto";

/** Fecha de hoy en Colombia (UTC-5), como Date a medianoche UTC para comparar con columnas DATE. */
export function hoyEnColombia(ahora = new Date()) {
  const bogota = new Date(ahora.getTime() - 5 * 60 * 60 * 1000);
  return new Date(`${bogota.toISOString().slice(0, 10)}T00:00:00Z`);
}

const aFecha = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);

@Injectable()
export class FeriasService {
  constructor(private readonly prisma: PrismaService) {}

  async publicas() {
    const hoy = hoyEnColombia();
    const [proximas, pasadas] = await Promise.all([
      this.prisma.feria.findMany({ where: { fecha: { gte: hoy } }, orderBy: { fecha: "asc" } }),
      this.prisma.feria.findMany({ where: { fecha: { lt: hoy } }, orderBy: { fecha: "desc" }, take: 12 }),
    ]);
    return { proximas, pasadas };
  }

  todas() {
    return this.prisma.feria.findMany({
      orderBy: { fecha: "desc" },
      include: { _count: { select: { ventas: true } } },
    });
  }

  crear(dto: CrearFeriaDto) {
    return this.prisma.feria.create({ data: { ...dto, fecha: aFecha(dto.fecha) } });
  }

  async actualizar(id: string, dto: ActualizarFeriaDto) {
    await this.obtener(id);
    return this.prisma.feria.update({
      where: { id },
      data: { ...dto, fecha: dto.fecha ? aFecha(dto.fecha) : undefined },
    });
  }

  async eliminar(id: string) {
    const feria = await this.prisma.feria.findUnique({ where: { id }, include: { _count: { select: { ventas: true } } } });
    if (!feria) throw new NotFoundException("La feria no existe.");
    if (feria._count.ventas > 0) {
      throw new ConflictException("Esta feria tiene ventas registradas; no se puede eliminar.");
    }
    await this.prisma.feria.delete({ where: { id } });
  }

  private async obtener(id: string) {
    const f = await this.prisma.feria.findUnique({ where: { id } });
    if (!f) throw new NotFoundException("La feria no existe.");
    return f;
  }
}
