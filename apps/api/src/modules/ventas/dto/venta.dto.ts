import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from "class-validator";
import { CanalVenta } from "@prisma/client";

export class RegistrarVentaDto {
  @ApiProperty({ enum: CanalVenta })
  @IsEnum(CanalVenta, { message: "Canal de venta inválido." })
  canal: CanalVenta;

  @ApiPropertyOptional({ description: "Feria donde se vendió, si aplica" })
  @IsOptional()
  @IsUUID()
  feriaId?: string;

  @ApiPropertyOptional({ description: "Precio cobrado. Si no se envía, se usa el precio publicado." })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(50_000_000)
  precioFinal?: number;
}
