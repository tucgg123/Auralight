import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configurarApp } from "./configurar-app";
import { ENTORNO, type Entorno } from "./config/entorno";

async function iniciar() {
  const app = await NestFactory.create(AppModule);
  configurarApp(app);
  app.enableShutdownHooks();
  const { puerto } = app.get<Entorno>(ENTORNO);
  await app.listen(puerto, "0.0.0.0");
  Logger.log(`API lista en http://localhost:${puerto} · documentación en /docs`, "Auralight");
}

void iniciar();
