import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../../prisma/prisma.service";

@ApiTags("público")
@Controller("categorias")
export class CategoriasController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  listar() {
    return this.prisma.categoria.findMany({
      orderBy: { orden: "asc" },
      select: { id: true, nombre: true, slug: true, singular: true, articulo: true, prefijoCodigo: true },
    });
  }
}
