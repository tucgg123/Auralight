import { Module } from "@nestjs/common";
import { AdminFeriasController, FeriasController } from "./ferias.controller";
import { FeriasService } from "./ferias.service";

@Module({ controllers: [FeriasController, AdminFeriasController], providers: [FeriasService] })
export class FeriasModule {}
