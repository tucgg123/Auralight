import { Module } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
import { ImagenesController } from "./imagenes.controller";

@Module({ controllers: [ImagenesController], providers: [CloudinaryService], exports: [CloudinaryService] })
export class ImagenesModule {}
