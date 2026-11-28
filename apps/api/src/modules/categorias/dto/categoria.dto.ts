import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from "class-validator";

const recortar = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);
const mayusculas = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim().toUpperCase() : value);

export const ARTICULOS = ["el", "la", "los", "las"] as const;

export class CrearCategoriaDto {
  @ApiProperty({ example: "Tobilleras", description: "Nombre en plural, como se ve en el catálogo." })
  @Transform(recortar)
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  nombre: string;

  @ApiProperty({ example: "tobillera", description: "Para el mensaje de WhatsApp: «quiero la tobillera…»." })
  @Transform(recortar)
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  singular: string;

  @ApiProperty({ enum: ARTICULOS, example: "la" })
  @IsIn(ARTICULOS, { message: "El artículo debe ser el, la, los o las." })
  articulo: (typeof ARTICULOS)[number];

  @ApiProperty({ example: "T", description: "Letras con que empiezan los códigos (T-001)." })
  @Transform(mayusculas)
  @Matches(/^[A-Z]{1,3}$/, { message: "El prefijo debe tener de 1 a 3 letras, sin tildes ni ñ." })
  prefijoCodigo: string;
}

export class ActualizarCategoriaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(recortar)
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  nombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(recortar)
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  singular?: string;

  @ApiPropertyOptional({ enum: ARTICULOS })
  @IsOptional()
  @IsIn(ARTICULOS, { message: "El artículo debe ser el, la, los o las." })
  articulo?: (typeof ARTICULOS)[number];

  @ApiPropertyOptional({ description: "Solo se puede cambiar si la categoría no tiene piezas." })
  @IsOptional()
  @Transform(mayusculas)
  @Matches(/^[A-Z]{1,3}$/, { message: "El prefijo debe tener de 1 a 3 letras, sin tildes ni ñ." })
  prefijoCodigo?: string;

  @ApiPropertyOptional({ description: "Posición en el catálogo (1 = primera)." })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(999)
  orden?: number;
}
