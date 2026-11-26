import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { categoriaPorSlug, piezaPorCodigo, todasLasPiezas } from "@/data/catalogo";
import { formatearPrecio } from "@/lib/formato";

export const alt = "Pieza única de Auralight";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return todasLasPiezas().map((p) => ({ codigo: p.codigo }));
}

export default async function Imagen({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const pieza = piezaPorCodigo(codigo);
  const logo = await readFile(join(process.cwd(), "public/logo-pavo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const cat = pieza ? categoriaPorSlug(pieza.categoria) : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "radial-gradient(circle at 20% 30%, #0f3a37 0%, #08080a 60%)",
          color: "#f3ede1",
          padding: 70,
          gap: 60,
        }}
      >
        <img src={logoSrc} width={300} height={385} alt="" />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 28, letterSpacing: 8, color: "#d4af6a" }}>AURALIGHT</div>
          <div style={{ fontSize: 26, color: "#5fd3c6", marginTop: 30 }}>
            {`${cat ? `${cat.nombre} · ` : ""}#${pieza?.codigo ?? codigo}`}
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, marginTop: 10, lineHeight: 1.1 }}>
            {pieza?.nombre ?? "Pieza única"}
          </div>
          {pieza && (
            <div style={{ fontSize: 54, color: "#ecd29a", marginTop: 24 }}>{formatearPrecio(pieza.precio)}</div>
          )}
          <div style={{ fontSize: 26, color: "#a7a3a0", marginTop: 30 }}>
            {pieza?.estado === "VENDIDA" ? "Vendida" : "Pieza única · cuando se vende, no vuelve"}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
