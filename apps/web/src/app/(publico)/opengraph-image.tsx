import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Auralight · Piezas únicas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Imagen() {
  const logo = await readFile(join(process.cwd(), "public/logo-pavo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 20%, #0f3a37 0%, #08080a 65%)",
          color: "#d4af6a",
        }}
      >
        <img src={logoSrc} width={260} height={334} alt="" />
        <div style={{ fontSize: 84, letterSpacing: 18, marginTop: 20 }}>AURALIGHT</div>
        <div style={{ fontSize: 32, color: "#f3ede1", marginTop: 10 }}>Piezas únicas. Cuando se vende, no vuelve.</div>
      </div>
    ),
    size,
  );
}
