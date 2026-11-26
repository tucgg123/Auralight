import type { Acento, Categoria } from "@/lib/tipos";

/**
 * Ilustración provisional para la demo, mientras se cargan las fotos reales.
 * Cuando haya fotos, este componente se reemplaza por <Image> de Cloudinary.
 */
const colores: Record<Acento, { piedra: string; brillo: string; fondo: string }> = {
  esmeralda: { piedra: "#1fa39a", brillo: "#7fe6da", fondo: "#0d2a28" },
  zafiro: { piedra: "#3d63d8", brillo: "#9fb6ff", fondo: "#111a33" },
  rubi: { piedra: "#c2334d", brillo: "#ff9aac", fondo: "#2a0f16" },
  oro: { piedra: "#d4af6a", brillo: "#fff0c4", fondo: "#2a2111" },
  onix: { piedra: "#2b2b33", brillo: "#8a8a99", fondo: "#16161b" },
  perla: { piedra: "#e9e4f0", brillo: "#ffffff", fondo: "#1f1d24" },
};

export function ImagenPieza({
  forma,
  acento,
  className,
  etiqueta,
}: {
  forma: Categoria["forma"];
  acento: Acento;
  className?: string;
  etiqueta: string;
}) {
  const c = colores[acento];
  const id = `${forma}-${acento}`;
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label={etiqueta} className={className}>
      <defs>
        <radialGradient id={`f-${id}`} cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor={c.fondo} stopOpacity="1" />
          <stop offset="100%" stopColor="#08080a" />
        </radialGradient>
        <linearGradient id={`o-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6e2ae" />
          <stop offset="50%" stopColor="#d4af6a" />
          <stop offset="100%" stopColor="#8f6c30" />
        </linearGradient>
        <radialGradient id={`p-${id}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={c.brillo} />
          <stop offset="60%" stopColor={c.piedra} />
          <stop offset="100%" stopColor="#050507" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#f-${id})`} />
      <g fill="none" stroke={`url(#o-${id})`} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        {forma === "anillo" && (
          <>
            <ellipse cx="200" cy="235" rx="88" ry="78" strokeWidth="14" />
            <path d="M172 160 L200 128 L228 160" strokeWidth="6" />
            <polygon points="200,98 232,128 200,170 168,128" fill={`url(#p-${id})`} strokeWidth="5" />
          </>
        )}
        {forma === "collar" && (
          <>
            <path d="M92 70 C 100 220, 300 220, 308 70" strokeDasharray="2 12" strokeWidth="8" />
            <line x1="200" y1="182" x2="200" y2="208" strokeWidth="5" />
            <path d="M200 208 C 170 250, 170 290, 200 305 C 230 290, 230 250, 200 208 Z" fill={`url(#p-${id})`} strokeWidth="5" />
          </>
        )}
        {forma === "manilla" && (
          <>
            <ellipse cx="200" cy="210" rx="130" ry="62" strokeWidth="9" strokeDasharray="14 8" />
            <ellipse cx="200" cy="210" rx="130" ry="62" strokeWidth="3" opacity="0.5" />
            <circle cx="200" cy="272" r="26" fill={`url(#p-${id})`} strokeWidth="5" />
          </>
        )}
        {forma === "cadena" && (
          <g strokeWidth="9">
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={70 + i * 52}
                y={i % 2 === 0 ? 170 : 182}
                width="68"
                height={i % 2 === 0 ? 60 : 36}
                rx="30"
                transform={`rotate(${i % 2 === 0 ? -8 : 8} ${104 + i * 52} 200)`}
              />
            ))}
          </g>
        )}
        {forma === "aretes" && (
          <>
            {[140, 260].map((x) => (
              <g key={x}>
                <path d={`M${x} 90 C ${x + 22} 90, ${x + 22} 128, ${x} 132`} strokeWidth="6" />
                <line x1={x} y1="132" x2={x} y2="180" strokeWidth="5" />
                <path
                  d={`M${x} 180 C ${x - 28} 220, ${x - 28} 262, ${x} 276 C ${x + 28} 262, ${x + 28} 220, ${x} 180 Z`}
                  fill={`url(#p-${id})`}
                  strokeWidth="5"
                />
              </g>
            ))}
          </>
        )}
      </g>
      <circle cx="160" cy="120" r="3" fill="#fff" opacity="0.6" />
      <circle cx="285" cy="300" r="2" fill="#fff" opacity="0.4" />
      <circle cx="110" cy="310" r="2.5" fill="#fff" opacity="0.35" />
    </svg>
  );
}
