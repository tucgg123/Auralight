import { Inject, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { createHash } from "node:crypto";
import { ENTORNO, type Entorno } from "../../config/entorno";

/**
 * Firma subidas para que el navegador envíe la foto directo a Cloudinary,
 * sin pasar por la API. El secreto nunca sale del backend.
 */
@Injectable()
export class CloudinaryService {
  constructor(@Inject(ENTORNO) private readonly entorno: Entorno) {}

  get configurado() {
    return this.entorno.cloudinary !== null;
  }

  url(publicId: string) {
    const cloud = this.entorno.cloudinary?.cloudName;
    return cloud ? `https://res.cloudinary.com/${cloud}/image/upload/${publicId}` : null;
  }

  firmarSubida(ahora = Math.floor(Date.now() / 1000)) {
    const c = this.entorno.cloudinary;
    if (!c) throw new ServiceUnavailableException("Cloudinary no está configurado en la API.");
    const parametros = { folder: c.folder, timestamp: ahora };
    return {
      cloudName: c.cloudName,
      apiKey: c.apiKey,
      folder: c.folder,
      timestamp: ahora,
      signature: firmar(parametros, c.apiSecret),
      urlSubida: `https://api.cloudinary.com/v1_1/${c.cloudName}/image/upload`,
    };
  }

  /** Borra la foto en Cloudinary. Si falla, no bloquea: la foto solo queda huérfana. */
  async eliminar(publicId: string) {
    const c = this.entorno.cloudinary;
    if (!c) return;
    const timestamp = Math.floor(Date.now() / 1000);
    const cuerpo = new URLSearchParams({
      public_id: publicId,
      timestamp: String(timestamp),
      api_key: c.apiKey,
      signature: firmar({ public_id: publicId, timestamp }, c.apiSecret),
    });
    await fetch(`https://api.cloudinary.com/v1_1/${c.cloudName}/image/destroy`, { method: "POST", body: cuerpo }).catch(
      () => undefined,
    );
  }

  /** Solo se aceptan public_id dentro de la carpeta de Auralight. */
  publicIdValido(publicId: string) {
    const carpeta = this.entorno.cloudinary?.folder ?? "auralight";
    return publicId.startsWith(`${carpeta}/`) && /^[\w\-/]+$/.test(publicId);
  }
}

/** Firma de Cloudinary: parámetros ordenados alfabéticamente + secreto, en SHA-1. */
export function firmar(parametros: Record<string, string | number>, secreto: string) {
  const texto = Object.keys(parametros)
    .sort()
    .map((k) => `${k}=${parametros[k]}`)
    .join("&");
  return createHash("sha1").update(texto + secreto).digest("hex");
}
