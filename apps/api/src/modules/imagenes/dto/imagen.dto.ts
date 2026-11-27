import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class AgregarImagenDto {
  @ApiProperty({ example: "auralight/a042-frente", description: "public_id que devolvió Cloudinary" })
  @IsString()
  @MaxLength(200)
  publicId: string;
}
