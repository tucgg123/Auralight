import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "admin@auralight.co" })
  @IsEmail({}, { message: "Escribe un correo válido." })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: "La contraseña tiene al menos 8 caracteres." })
  @MaxLength(200)
  contrasena: string;
}

export class RefreshDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
