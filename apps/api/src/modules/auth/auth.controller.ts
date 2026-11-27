import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { AdminGuard, AdminId } from "./admin.guard";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshDto } from "./dto/login.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /** Máximo 5 intentos por minuto para frenar ataques de fuerza bruta. */
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post("login")
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.contrasena);
  }

  @Post("refresh")
  @HttpCode(200)
  refrescar(@Body() dto: RefreshDto) {
    return this.auth.refrescar(dto.refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post("logout")
  @HttpCode(204)
  async cerrarSesion(@AdminId() adminId: string) {
    await this.auth.cerrarSesion(adminId);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get("yo")
  perfil(@AdminId() adminId: string) {
    return this.auth.perfil(adminId);
  }
}
