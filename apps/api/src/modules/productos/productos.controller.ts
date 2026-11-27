import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "../auth/admin.guard";
import {
  ActualizarProductoDto,
  CambiarEstadoDto,
  CrearProductoDto,
  FiltroAdminDto,
  FiltroProductosDto,
} from "./dto/producto.dto";
import { ProductosService } from "./productos.service";

@ApiTags("público")
@Controller("productos")
export class ProductosController {
  constructor(private readonly productos: ProductosService) {}

  /** Piezas disponibles y reservadas, con filtros. */
  @Get()
  catalogo(@Query() filtro: FiltroProductosDto) {
    return this.productos.catalogo(filtro);
  }

  @Get("vendidas")
  vendidas() {
    return this.productos.vendidas();
  }

  @Get(":codigo")
  detalle(@Param("codigo") codigo: string) {
    return this.productos.detallePublico(codigo);
  }
}

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller("admin/productos")
export class AdminProductosController {
  constructor(private readonly productos: ProductosService) {}

  @Get()
  listar(@Query() filtro: FiltroAdminDto) {
    return this.productos.listarAdmin(filtro);
  }

  @Get(":id")
  detalle(@Param("id", ParseUUIDPipe) id: string) {
    return this.productos.detalleAdmin(id);
  }

  @Post()
  crear(@Body() dto: CrearProductoDto) {
    return this.productos.crear(dto);
  }

  @Patch(":id")
  actualizar(@Param("id", ParseUUIDPipe) id: string, @Body() dto: ActualizarProductoDto) {
    return this.productos.actualizar(id, dto);
  }

  /** Ocultar o volver a mostrar una pieza. */
  @Patch(":id/estado")
  cambiarEstado(@Param("id", ParseUUIDPipe) id: string, @Body() dto: CambiarEstadoDto) {
    return this.productos.cambiarEstado(id, dto.estado);
  }

  @Delete(":id")
  @HttpCode(204)
  eliminar(@Param("id", ParseUUIDPipe) id: string) {
    return this.productos.eliminar(id);
  }
}
