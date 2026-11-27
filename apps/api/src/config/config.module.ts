import { Global, Module } from "@nestjs/common";
import { cargarEntorno, ENTORNO } from "./entorno";

@Global()
@Module({
  providers: [{ provide: ENTORNO, useFactory: () => cargarEntorno() }],
  exports: [ENTORNO],
})
export class EntornoModule {}
