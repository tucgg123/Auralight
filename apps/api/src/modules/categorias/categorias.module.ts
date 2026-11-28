import { Module } from "@nestjs/common";
import { AdminCategoriasController, CategoriasController } from "./categorias.controller";
import { CategoriasService } from "./categorias.service";

@Module({ controllers: [CategoriasController, AdminCategoriasController], providers: [CategoriasService] })
export class CategoriasModule {}
