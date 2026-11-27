import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

const recortar = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);

export class CrearFeriaDto {
  @ApiProperty({ example: "Feria de Emprendimiento CUC Connections" })
  @Transform(recortar)
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  nombre: string;

  @ApiProperty({ example: "Cafetería Central, Universidad de la Costa" })
  @Transform(recortar)
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  lugar: string;

  @ApiProperty({ example: "2026-12-12" })
  @IsDateString({ strict: true }, { message: "La fecha debe tener formato AAAA-MM-DD." })
  fecha: string;

  @ApiPropertyOptional({ example: "9:00 a. m. – 4:00 p. m." })
  @IsOptional()
  @Transform(recortar)
  @IsString()
  @MaxLength(60)
  horario?: string;
}

export class ActualizarFeriaDto extends PartialType(CrearFeriaDto) {}
