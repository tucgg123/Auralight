import type { FirmaSubida } from "./api";

/** Reduce la foto en el celular antes de subirla (máx. 1600 px, JPEG): sube más rápido con datos móviles. */
export async function comprimir(archivo: File, ladoMax = 1600): Promise<Blob> {
  if (!archivo.type.startsWith("image/") || archivo.type === "image/gif") return archivo;
  try {
    const bitmap = await createImageBitmap(archivo);
    const escala = Math.min(1, ladoMax / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", 0.85));
    return blob && blob.size < archivo.size ? blob : archivo;
  } catch {
    return archivo;
  }
}

/** Sube la foto directo a Cloudinary con la firma que dio la API. Devuelve el public_id. */
export async function subirACloudinary(archivo: File, firma: FirmaSubida): Promise<{ publicId: string; url: string }> {
  const datos = new FormData();
  datos.append("file", await comprimir(archivo));
  datos.append("api_key", firma.apiKey);
  datos.append("timestamp", String(firma.timestamp));
  datos.append("signature", firma.signature);
  datos.append("folder", firma.folder);
  const res = await fetch(firma.urlSubida, { method: "POST", body: datos });
  if (!res.ok) throw new Error("Cloudinary rechazó la foto.");
  const cuerpo = (await res.json()) as { public_id: string; secure_url: string };
  return { publicId: cuerpo.public_id, url: cuerpo.secure_url };
}
