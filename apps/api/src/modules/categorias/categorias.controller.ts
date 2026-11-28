import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "../auth/admin.guard";
import { CategoriasService } from "./categorias.service";
import { ActualizarCategoriaDto, CrearCategoriaDto } from "./dto/categoria.dto";

@ApiTags("público")
@Controller("categorias")
export class CategoriasController {
  constructor(private readonly categorias: CategoriasService) {}

  @Get()
  listar() {
    return this.categorias.publicas();
  }
}

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller("admin/categorias")
export class AdminCategoriasController {
  constructor(private readonly categorias: CategoriasService) {}

  @Get()
  listar() {
    return this.categorias.todas();
  }

  @Post()
  crear(@Body() dto: CrearCategoriaDto) {
    return this.categorias.crear(dto);
  }

  @Patch(":id")
  actualizar(@Param("id", ParseIntPipe) id: number, @Body() dto: ActualizarCategoriaDto) {
    return this.categorias.actualizar(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  eliminar(@Param("id", ParseIntPipe) id: number) {
    return this.categorias.eliminar(id);
  }
}
