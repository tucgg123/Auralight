/**
 * Lee y valida las variables de entorno al arrancar.
 * Si falta algo obligatorio, la API no inicia y dice qué falta.
 */
export interface Entorno {
  puerto: number;
  databaseUrl: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  webOrigins: string[];
  cloudinary: { cloudName: string; apiKey: string; apiSecret: string; folder: string } | null;
}

export function cargarEntorno(env: NodeJS.ProcessEnv = process.env): Entorno {
  const faltan = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"].filter((k) => !env[k]);
  if (faltan.length) {
    throw new Error(`Faltan variables de entorno: ${faltan.join(", ")}. Revisa .env.example.`);
  }
  for (const k of ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"]) {
    if ((env[k] ?? "").length < 16) throw new Error(`${k} debe tener al menos 16 caracteres.`);
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = env;
  const cloudinary =
    CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET
      ? {
          cloudName: CLOUDINARY_CLOUD_NAME,
          apiKey: CLOUDINARY_API_KEY,
          apiSecret: CLOUDINARY_API_SECRET,
          folder: env.CLOUDINARY_FOLDER || "auralight",
        }
      : null;

  return {
    puerto: Number(env.PORT ?? 4000),
    databaseUrl: env.DATABASE_URL!,
    jwtAccessSecret: env.JWT_ACCESS_SECRET!,
    jwtRefreshSecret: env.JWT_REFRESH_SECRET!,
    webOrigins: (env.WEB_ORIGIN ?? "http://localhost:3000")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
    cloudinary,
  };
}

export const ENTORNO = Symbol("ENTORNO");
