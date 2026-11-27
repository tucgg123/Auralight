import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminGuard, AdminId } from "../auth/admin.guard";
import { RegistrarVentaDto } from "./dto/venta.dto";
import { VentasService } from "./ventas.service";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller("admin")
export class VentasController {
  constructor(private readonly ventas: VentasService) {}

  @Post("productos/:id/venta")
  registrar(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: RegistrarVentaDto,
    @AdminId() adminId: string,
  ) {
    return this.ventas.registrar(id, dto, adminId);
  }

  @Delete("productos/:id/venta")
  @HttpCode(204)
  deshacer(@Param("id", ParseUUIDPipe) id: string) {
    return this.ventas.deshacer(id);
  }

  @Get("ventas")
  listar() {
    return this.ventas.listar();
  }
}
