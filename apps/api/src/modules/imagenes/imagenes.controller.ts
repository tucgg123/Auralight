import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../../prisma/prisma.service";
import { AdminGuard } from "../auth/admin.guard";
import { CloudinaryService } from "./cloudinary.service";
import { AgregarImagenDto } from "./dto/imagen.dto";

const MAX_IMAGENES = 8;

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller("admin")
export class ImagenesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  /** Firma para subir una foto directo a Cloudinary desde el navegador. */
  @Post("imagenes/firma")
  @HttpCode(200)
  firma() {
    return this.cloudinary.firmarSubida();
  }

  @Post("productos/:id/imagenes")
  async agregar(@Param("id", ParseUUIDPipe) productoId: string, @Body() dto: AgregarImagenDto) {
    if (!this.cloudinary.publicIdValido(dto.publicId)) throw new BadRequestException("public_id inválido.");
    const producto = await this.prisma.producto.findUnique({
      where: { id: productoId },
      include: { imagenes: { select: { orden: true } } },
    });
    if (!producto) throw new NotFoundException("La pieza no existe.");
    if (producto.imagenes.length >= MAX_IMAGENES) {
      throw new BadRequestException(`Cada pieza admite máximo ${MAX_IMAGENES} fotos.`);
    }
    const orden = Math.max(-1, ...producto.imagenes.map((i) => i.orden)) + 1;
    const img = await this.prisma.imagen.create({ data: { productoId, publicId: dto.publicId, orden } });
    return { ...img, url: this.cloudinary.url(img.publicId) };
  }

  /** Pone la foto de primera (es la que se ve en el catálogo). */
  @Patch("imagenes/:id/principal")
  async principal(@Param("id", ParseUUIDPipe) id: string) {
    const img = await this.prisma.imagen.findUnique({ where: { id } });
    if (!img) throw new NotFoundException("La foto no existe.");
    const minimo = await this.prisma.imagen.aggregate({ where: { productoId: img.productoId }, _min: { orden: true } });
    return this.prisma.imagen.update({ where: { id }, data: { orden: (minimo._min.orden ?? 0) - 1 } });
  }

  @Delete("imagenes/:id")
  @HttpCode(204)
  async eliminar(@Param("id", ParseUUIDPipe) id: string) {
    const img = await this.prisma.imagen.delete({ where: { id } });
    await this.cloudinary.eliminar(img.publicId);
  }
}
