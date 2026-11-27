import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { EntornoModule } from "./config/config.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CategoriasModule } from "./modules/categorias/categorias.module";
import { FeriasModule } from "./modules/ferias/ferias.module";
import { ImagenesModule } from "./modules/imagenes/imagenes.module";
import { ProductosModule } from "./modules/productos/productos.module";
import { SaludController } from "./modules/salud/salud.controller";
import { VentasModule } from "./modules/ventas/ventas.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    EntornoModule,
    PrismaModule,
    // Límite general: 120 peticiones por minuto por IP.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    AuthModule,
    CategoriasModule,
    ProductosModule,
    ImagenesModule,
    VentasModule,
    FeriasModule,
  ],
  controllers: [SaludController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
