import { ApiPropertyOptional, ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

const recortar = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);

export class CrearProductoDto {
  @ApiProperty({ example: "Anillo Negro Mate" })
  @Transform(recortar)
  @IsString()
  @MinLength(2, { message: "El nombre es muy corto." })
  @MaxLength(80)
  nombre: string;

  @ApiProperty({ example: "anillos", description: "Slug de la categoría" })
  @IsString()
  categoria: string;

  @ApiProperty({ example: "Acero inoxidable negro" })
  @Transform(recortar)
  @IsString()
  @MinLength(2, { message: "Escribe el material." })
  @MaxLength(80)
  material: string;

  @ApiProperty({ example: 18000, description: "Pesos colombianos, sin decimales" })
  @Type(() => Number)
  @IsInt({ message: "El precio debe ser un número entero." })
  @Min(1000, { message: "El precio mínimo es $1.000." })
  @Max(50_000_000)
  precio: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(recortar)
  @IsString()
  @MaxLength(1000)
  descripcion?: string;
}

export class ActualizarProductoDto extends PartialType(CrearProductoDto) {}

export class CambiarEstadoDto {
  @ApiProperty({ enum: ["DISPONIBLE", "OCULTA"] })
  @IsIn(["DISPONIBLE", "OCULTA"], { message: "Solo se puede cambiar a DISPONIBLE u OCULTA." })
  estado: "DISPONIBLE" | "OCULTA";
}

export class FiltroProductosDto {
  @ApiPropertyOptional() @IsOptional() @IsString() categoria?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() precioMin?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() precioMax?: number;
  @ApiPropertyOptional({ description: "Texto a buscar en nombre, código o material" })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  q?: string;

  @ApiPropertyOptional({ enum: ["recientes", "precio-asc", "precio-desc"] })
  @IsOptional()
  @IsIn(["recientes", "precio-asc", "precio-desc"])
  orden?: "recientes" | "precio-asc" | "precio-desc";
}

export class FiltroAdminDto extends FiltroProductosDto {
  @ApiPropertyOptional({ enum: ["DISPONIBLE", "RESERVADA", "VENDIDA", "OCULTA"] })
  @IsOptional()
  @IsIn(["DISPONIBLE", "RESERVADA", "VENDIDA", "OCULTA"])
  estado?: "DISPONIBLE" | "RESERVADA" | "VENDIDA" | "OCULTA";
}
