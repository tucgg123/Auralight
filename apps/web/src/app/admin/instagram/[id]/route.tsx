import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { apiAdmin, type PiezaAdmin } from "@/lib/admin/api";
import { tamanos, type FormatoInstagram } from "@/lib/admin/instagram";
import { sitio } from "@/lib/config";
import { formatearPrecio } from "@/lib/formato";

/** Descarga la foto antes de dibujar: si Cloudinary falla, se usa el logo en vez de romper la imagen. */
async function comoDataUrl(url: string) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return null;
    const tipo = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${tipo};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Imagen lista para Instagram (post 4:5 o historia 9:16) con la foto de la pieza,
 * nombre, precio, código y logo. Solo para el panel (middleware exige sesión).
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("No encontrada", { status: 404 });
  const formato: FormatoInstagram = req.nextUrl.searchParams.get("formato") === "historia" ? "historia" : "post";
  const indice = Math.max(0, Number(req.nextUrl.searchParams.get("foto") ?? 0) || 0);
  const { width, height } = tamanos[formato];

  const pieza = await apiAdmin<PiezaAdmin>(`/admin/productos/${id}`);
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/logo-pavo.png"))).toString("base64")}`;
  const urlFoto = pieza.imagenes[indice]?.url ?? pieza.imagenes[0]?.url;
  const ladoFoto = 1080;
  const altoFoto = formato === "post" ? 1000 : 1350;
  const foto = urlFoto
    ? await comoDataUrl(urlFoto.replace("/image/upload/", `/image/upload/f_jpg,q_90,c_fill,g_auto,w_${ladoFoto},h_${altoFoto}/`))
    : null;
  const vendida = pieza.estado === "VENDIDA";
  const dominio = sitio.url.replace(/^https?:\/\//, "");

  const imagen = new ImageResponse(
    (
      <div style={{ width, height, display: "flex", flexDirection: "column", background: "#08080a", color: "#f3ede1" }}>
        <div style={{ position: "relative", display: "flex", width: ladoFoto, height: altoFoto }}>
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={foto} width={ladoFoto} height={altoFoto} alt="" style={{ objectFit: "cover" }} />
          ) : (
            <div
              style={{
                width: ladoFoto,
                height: altoFoto,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "radial-gradient(circle at 50% 40%, #0f3a37 0%, #08080a 70%)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} width={420} height={539} alt="" />
            </div>
          )}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 40,
              display: "flex",
              padding: "12px 26px",
              borderRadius: 999,
              border: "2px solid #d4af6a",
              background: vendida ? "#f3ede1" : "rgba(8,8,10,0.75)",
              color: vendida ? "#08080a" : "#ecd29a",
              fontSize: 30,
              letterSpacing: 4,
            }}
          >
            {vendida ? "VENDIDA" : "PIEZA ÚNICA"}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: ladoFoto,
              height: 220,
              display: "flex",
              background: "linear-gradient(180deg, rgba(8,8,10,0) 0%, #08080a 100%)",
            }}
          />
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center", padding: "0 56px", gap: 36 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={110} height={141} alt="" />
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontSize: 26, letterSpacing: 8, color: "#d4af6a" }}>{`AURALIGHT · #${pieza.codigo}`}</div>
            <div style={{ fontSize: pieza.nombre.length > 24 ? 50 : 60, fontWeight: 700, lineHeight: 1.1, marginTop: 8 }}>
              {pieza.nombre}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 10 }}>
              <div style={{ fontSize: 56, color: "#ecd29a", textDecoration: vendida ? "line-through" : "none" }}>
                {formatearPrecio(pieza.precio)}
              </div>
              <div style={{ fontSize: 26, color: "#a7a3a0" }}>{pieza.material}</div>
            </div>
            {formato === "historia" && (
              <div style={{ fontSize: 30, color: "#5fd3c6", marginTop: 28 }}>
                {vendida ? "Ya encontró dueño" : `Pídela por WhatsApp · ${dominio}`}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { width, height },
  );

  const descargar = req.nextUrl.searchParams.get("descargar") === "1";
  const headers = new Headers(imagen.headers);
  headers.set("Cache-Control", "private, no-store");
  if (descargar) headers.set("Content-Disposition", `attachment; filename="auralight-${pieza.codigo}-${formato}.png"`);
  return new Response(imagen.body, { status: 200, headers });
}
