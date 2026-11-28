import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { ActualizarCategoriaDto, CrearCategoriaDto } from "./dto/categoria.dto";

/** "Cadenas y Dijes" → "cadenas-y-dijes". El slug va en la URL del catálogo y no cambia después. */
export function slugDe(nombre: string) {
  return nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  publicas() {
    return this.prisma.categoria.findMany({
      orderBy: [{ orden: "asc" }, { id: "asc" }],
      select: { id: true, nombre: true, slug: true, singular: true, articulo: true, prefijoCodigo: true },
    });
  }

  todas() {
    return this.prisma.categoria.findMany({
      orderBy: [{ orden: "asc" }, { id: "asc" }],
      include: { _count: { select: { productos: true } } },
    });
  }

  async crear(dto: CrearCategoriaDto) {
    const slug = slugDe(dto.nombre);
    if (!slug) throw new ConflictException("El nombre debe tener letras o números.");
    await this.validarUnicos({ nombre: dto.nombre, slug, prefijoCodigo: dto.prefijoCodigo });
    const ultima = await this.prisma.categoria.aggregate({ _max: { orden: true } });
    return this.prisma.categoria.create({
      data: { ...dto, slug, orden: (ultima._max.orden ?? 0) + 1 },
    });
  }

  async actualizar(id: number, dto: ActualizarCategoriaDto) {
    const actual = await this.obtener(id);
    if (dto.prefijoCodigo && dto.prefijoCodigo !== actual.prefijoCodigo && actual._count.productos > 0) {
      throw new ConflictException("No se puede cambiar el prefijo: ya hay piezas con códigos de esta categoría.");
    }
    await this.validarUnicos({ nombre: dto.nombre, prefijoCodigo: dto.prefijoCodigo }, id);
    return this.prisma.categoria.update({ where: { id }, data: dto });
  }

  async eliminar(id: number) {
    const cat = await this.obtener(id);
    if (cat._count.productos > 0) {
      throw new ConflictException("Esta categoría tiene piezas; muévelas a otra categoría antes de eliminarla.");
    }
    await this.prisma.categoria.delete({ where: { id } });
  }

  private async obtener(id: number) {
    const c = await this.prisma.categoria.findUnique({ where: { id }, include: { _count: { select: { productos: true } } } });
    if (!c) throw new NotFoundException("La categoría no existe.");
    return c;
  }

  /** Mensajes claros en vez del error genérico de valor único. */
  private async validarUnicos(v: { nombre?: string; slug?: string; prefijoCodigo?: string }, excepto?: number) {
    const otras = await this.prisma.categoria.findMany({
      where: {
        id: excepto ? { not: excepto } : undefined,
        OR: [
          ...(v.nombre ? [{ nombre: { equals: v.nombre, mode: "insensitive" as const } }] : []),
          ...(v.slug ? [{ slug: v.slug }] : []),
          ...(v.prefijoCodigo ? [{ prefijoCodigo: v.prefijoCodigo }] : []),
        ],
      },
    });
    if (otras.some((o) => o.prefijoCodigo === v.prefijoCodigo)) {
      throw new ConflictException(`El prefijo ${v.prefijoCodigo} ya lo usa otra categoría.`);
    }
    if (otras.length > 0) throw new ConflictException("Ya existe una categoría con ese nombre.");
  }
}
