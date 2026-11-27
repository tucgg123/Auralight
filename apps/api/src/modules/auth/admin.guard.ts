import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, createParamDecorator } from "@nestjs/common";
import type { Request } from "express";
import { AuthService, type PayloadAcceso } from "./auth.service";

type RequestConAdmin = Request & { admin?: PayloadAcceso };

/**
 * Protege los endpoints de administración.
 * Acepta el token de acceso como "Authorization: Bearer <token>".
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<RequestConAdmin>();
    const [tipo, token] = (req.headers.authorization ?? "").split(" ");
    if (tipo !== "Bearer" || !token) throw new UnauthorizedException("Falta el token de acceso.");
    try {
      req.admin = await this.auth.verificarAcceso(token);
    } catch {
      throw new UnauthorizedException("Token inválido o vencido.");
    }
    return true;
  }
}

/** Inyecta el id del administrador autenticado. */
export const AdminId = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest<RequestConAdmin>().admin?.sub;
});
