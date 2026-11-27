import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { Response } from "express";

/**
 * Devuelve todos los errores con el mismo formato:
 * { statusCode, error, mensaje }
 */
@Catch()
export class FiltroExcepciones implements ExceptionFilter {
  private readonly logger = new Logger("Errores");

  catch(excepcion: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let mensaje: string | string[] = "Ocurrió un error inesperado.";

    if (excepcion instanceof HttpException) {
      status = excepcion.getStatus();
      const cuerpo = excepcion.getResponse();
      mensaje =
        typeof cuerpo === "string" ? cuerpo : ((cuerpo as { message?: string | string[] }).message ?? excepcion.message);
    } else if (excepcion instanceof Prisma.PrismaClientKnownRequestError) {
      if (excepcion.code === "P2002") {
        status = HttpStatus.CONFLICT;
        mensaje = "Ya existe un registro con ese valor único.";
      } else if (excepcion.code === "P2025") {
        status = HttpStatus.NOT_FOUND;
        mensaje = "No se encontró el registro.";
      } else {
        this.logger.error(excepcion);
      }
    } else {
      this.logger.error(excepcion);
    }

    res.status(status).json({ statusCode: status, error: HttpStatus[status] ?? "Error", mensaje });
  }
}
