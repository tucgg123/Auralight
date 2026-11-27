import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { ENTORNO, type Entorno } from "../../config/entorno";
import { PrismaService } from "../../prisma/prisma.service";

export interface PayloadAcceso {
  sub: string;
  rol: "ADMIN";
  tipo: "acceso";
}

interface PayloadRefresh {
  sub: string;
  ver: number;
  tipo: "refresh";
}

export const DURACION_ACCESO_SEG = 15 * 60;
export const DURACION_REFRESH_SEG = 7 * 24 * 60 * 60;


@Injectable()
export class AuthService {
  /** Hash usado cuando el correo no existe, para que la respuesta tarde lo mismo y no revele qué correos existen. */
  private hashFalso?: Promise<string>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    @Inject(ENTORNO) private readonly entorno: Entorno,
  ) {}

  async login(email: string, contrasena: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email: email.toLowerCase().trim() } });
    this.hashFalso ??= argon2.hash("correo-que-no-existe");
    const hash = admin?.hashContrasena ?? (await this.hashFalso);
    const valida = await argon2.verify(hash, contrasena).catch(() => false);
    if (!admin || !valida) throw new UnauthorizedException("Correo o contraseña incorrectos.");
    return this.emitirTokens(admin.id, admin.versionToken);
  }

  async refrescar(refreshToken: string) {
    let payload: PayloadRefresh;
    try {
      payload = await this.jwt.verifyAsync<PayloadRefresh>(refreshToken, { secret: this.entorno.jwtRefreshSecret });
    } catch {
      throw new UnauthorizedException("La sesión expiró. Inicia sesión de nuevo.");
    }
    if (payload.tipo !== "refresh") throw new UnauthorizedException("Token inválido.");
    const admin = await this.prisma.admin.findUnique({ where: { id: payload.sub } });
    if (!admin || admin.versionToken !== payload.ver) {
      throw new UnauthorizedException("La sesión fue cerrada. Inicia sesión de nuevo.");
    }
    return this.emitirTokens(admin.id, admin.versionToken);
  }

  /** Invalida todos los refresh tokens emitidos para este administrador. */
  async cerrarSesion(adminId: string) {
    await this.prisma.admin.update({ where: { id: adminId }, data: { versionToken: { increment: 1 } } });
  }

  async perfil(adminId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, nombre: true, email: true, rol: true },
    });
    if (!admin) throw new UnauthorizedException();
    return admin;
  }

  async verificarAcceso(token: string): Promise<PayloadAcceso> {
    const payload = await this.jwt.verifyAsync<PayloadAcceso>(token, { secret: this.entorno.jwtAccessSecret });
    if (payload.tipo !== "acceso") throw new Error("Tipo de token inválido");
    return payload;
  }

  private async emitirTokens(adminId: string, version: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync({ sub: adminId, rol: "ADMIN", tipo: "acceso" } satisfies PayloadAcceso, {
        secret: this.entorno.jwtAccessSecret,
        expiresIn: DURACION_ACCESO_SEG,
      }),
      this.jwt.signAsync({ sub: adminId, ver: version, tipo: "refresh" } satisfies PayloadRefresh, {
        secret: this.entorno.jwtRefreshSecret,
        expiresIn: DURACION_REFRESH_SEG,
      }),
    ]);
    return { accessToken, refreshToken, expiraEn: DURACION_ACCESO_SEG };
  }
}
