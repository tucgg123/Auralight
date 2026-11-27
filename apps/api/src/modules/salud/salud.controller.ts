import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import { PrismaService } from "../../prisma/prisma.service";

@ApiTags("salud")
@SkipThrottle()
@Controller("salud")
export class SaludController {
  constructor(private readonly prisma: PrismaService) {}

  /** Usado por Render para saber si la API está viva. */
  @Get()
  async salud() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  }
}
