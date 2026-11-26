# Auralight

Tienda web de **piezas únicas** (anillos, manillas, collares, cadenas y aretes) de Auralight.
Cada pieza existe una sola vez: cuando se vende, no vuelve. La compra se cierra por WhatsApp.

> **Estado:** demo del sitio público con datos de ejemplo. El backend (NestJS + PostgreSQL) y el panel de
> administración llegan en la siguiente etapa.

## Qué incluye la demo

- **Inicio:** portada con el logo, novedades, categorías, cómo comprar, próxima feria y piezas vendidas.
- **Catálogo** (`/catalogo`): filtros por categoría, material y precio, y orden por fecha o precio. Los filtros
  viven en la URL, así que un enlace filtrado se puede compartir.
- **Detalle de pieza** (`/pieza/A-042`): precio, material, etiqueta «Pieza única» y botón **Lo quiero** que abre
  WhatsApp con el código de la pieza ya escrito. Muestra estados `DISPONIBLE`, `RESERVADA` y `VENDIDA`.
- **Vista previa al compartir:** cada pieza genera su propia imagen Open Graph con nombre, código y precio.
- **Piezas vendidas** (`/vendidas`) y **Ferias** (`/ferias`, próximas y pasadas).
- Diseño pensado primero para celular, con la paleta del pavo real (negro, oro, turquesa y zafiro).

## Tecnologías

Next.js 15 (App Router, SSG/ISR) · React 19 · TypeScript estricto · Tailwind CSS 4 · lucide-react ·
pnpm workspaces (monorepo) · GitHub Actions (lint, tipos y build).

## Estructura

```
apps/
  web/                 # Next.js (sitio público)
    src/app/           # Rutas: inicio, catalogo, pieza/[codigo], vendidas, ferias
    src/components/    # Tarjetas, filtros, botón de WhatsApp, etc.
    src/data/          # Datos de ejemplo (se reemplazan por la API)
    src/lib/           # Tipos, formato de precios y enlaces de WhatsApp
packages/              # (próximamente) tipos y esquemas compartidos
```

## Correr en local

Requisitos: Node 22 y pnpm.

```bash
pnpm install
cp .env.example apps/web/.env.local   # opcional
pnpm dev                              # http://localhost:3000
```

Otros comandos: `pnpm build`, `pnpm lint`, `pnpm typecheck`.

## Variables de entorno

| Variable | Para qué | Ejemplo |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP` | Número del negocio, con indicativo y sin `+` | `573043139986` |
| `NEXT_PUBLIC_SITE_URL` | Opcional. URL pública para los enlaces y la vista previa al compartir. En Vercel se detecta sola; úsala solo con un dominio propio | `https://auralightt.vercel.app` |

## Publicar en Vercel

1. En Vercel: **Add New → Project** e importa este repositorio.
2. En **Root Directory** elige `apps/web`. Vercel detecta Next.js y pnpm solo.
3. Agrega las variables de entorno de la tabla de arriba y pulsa **Deploy**.

Cada merge a `main` vuelve a publicar el sitio.

## Próximos pasos

1. API con NestJS + Prisma + PostgreSQL (Neon), con el mismo modelo de datos.
2. Panel de administración con carga rápida de piezas desde el celular y fotos en Cloudinary.
3. Reservas temporales con actualización atómica para que nadie compre dos veces la misma pieza.
4. Registro de ventas por canal y feria, y estadísticas.
