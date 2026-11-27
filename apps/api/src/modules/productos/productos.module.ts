import { Module } from "@nestjs/common";
import { ImagenesModule } from "../imagenes/imagenes.module";
import { AdminProductosController, ProductosController } from "./productos.controller";
import { ProductosRepository } from "./productos.repository";
import { ProductosService } from "./productos.service";

@Module({
  imports: [ImagenesModule],
  controllers: [ProductosController, AdminProductosController],
  providers: [ProductosService, ProductosRepository],
  exports: [ProductosService],
})
export class ProductosModule {}
