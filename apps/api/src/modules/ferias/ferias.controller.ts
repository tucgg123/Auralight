import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "../auth/admin.guard";
import { ActualizarFeriaDto, CrearFeriaDto } from "./dto/feria.dto";
import { FeriasService } from "./ferias.service";

@ApiTags("público")
@Controller("ferias")
export class FeriasController {
  constructor(private readonly ferias: FeriasService) {}

  @Get()
  listar() {
    return this.ferias.publicas();
  }
}

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller("admin/ferias")
export class AdminFeriasController {
  constructor(private readonly ferias: FeriasService) {}

  @Get()
  listar() {
    return this.ferias.todas();
  }

  @Post()
  crear(@Body() dto: CrearFeriaDto) {
    return this.ferias.crear(dto);
  }

  @Patch(":id")
  actualizar(@Param("id", ParseUUIDPipe) id: string, @Body() dto: ActualizarFeriaDto) {
    return this.ferias.actualizar(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  eliminar(@Param("id", ParseUUIDPipe) id: string) {
    return this.ferias.eliminar(id);
  }
}
