import { type INestApplication, ValidationPipe } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { FiltroExcepciones } from "./common/filtro-excepciones";
import { ENTORNO, type Entorno } from "./config/entorno";

/** Configuración compartida por main.ts y las pruebas de integración. */
export function configurarApp(app: INestApplication) {
  const entorno = app.get<Entorno>(ENTORNO);
  (app as NestExpressApplication).set("trust proxy", 1);
  app.enableCors({ origin: entorno.webOrigins, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new FiltroExcepciones());

  const doc = new DocumentBuilder()
    .setTitle("API de Auralight")
    .setDescription("Catálogo de piezas únicas, ventas y ferias.")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  SwaggerModule.setup("docs", app, () => SwaggerModule.createDocument(app, doc));
  return app;
}
