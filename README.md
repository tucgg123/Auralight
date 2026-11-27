# Auralight

Tienda web de **piezas únicas** (anillos, manillas, collares, cadenas y aretes) de Auralight.
Cada pieza existe una sola vez: cuando se vende, no vuelve. La compra se cierra por WhatsApp.

- **Sitio público:** https://auralightt.vercel.app
- **Panel de administración:** `/admin` (subir piezas con fotos desde el celular, registrar ventas y ferias)
- **API:** NestJS con documentación Swagger en `/docs`

## Arquitectura

```
Cliente ──► Next.js (Vercel) ──REST──► NestJS (Render) ──Prisma──► PostgreSQL (Neon)
                │                          │
                │  fotos directo            └─ firma de subida
                └──────────────────────────────► Cloudinary
```

- El **sitio público** se genera en el servidor (SSG/ISR) para SEO y vista previa al compartir.
  Lee la API con caché y se actualiza al instante cuando el panel cambia algo (revalidación por etiquetas).
- El **panel** usa Server Actions de Next.js. Los tokens JWT viven en cookies `httpOnly`; el navegador nunca los ve.
  El middleware renueva el token de acceso con el refresh token sin pedir login de nuevo.
- Las **fotos** se suben del navegador directo a Cloudinary con una firma que genera la API
  (se comprimen en el celular antes de subir). La base de datos solo guarda el `public_id`.
- Sin `API_URL`, el sitio usa **datos de ejemplo**: así funciona la demo aunque la API no exista.

### Decisiones clave

| Problema | Solución |
|---|---|
| Vender dos veces la misma pieza | Actualización condicional (`estado != VENDIDA`) en una transacción **y** `venta.producto_id` único en la base de datos. Probado con dos ventas simultáneas. |
| Códigos legibles sin repetir (`A-042`) | Consecutivo por categoría incrementado de forma atómica dentro de la transacción que crea la pieza. |
| Fuerza bruta en el login | Límite de 5 intentos por minuto, hash **argon2** y respuesta de igual duración exista o no el correo. |
| Cerrar sesión en todos lados | `versionToken` por administrador: al cerrar sesión, todos los refresh tokens anteriores dejan de servir. |
| API gratuita que "se duerme" | El sitio público sirve páginas en caché (ISR); si la API no responde durante el build, el despliegue no se cae. |

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 (App Router, Server Actions, ISR), React 19, Tailwind CSS 4, TypeScript estricto |
| Backend | NestJS 11 (módulos, DTOs con class-validator, guards, filtros de excepciones, throttling, Swagger) |
| Base de datos | PostgreSQL + Prisma (migraciones versionadas, seed) |
| Imágenes | Cloudinary (subida firmada directa desde el navegador) |
| Pruebas | Jest (unitarias) + Supertest contra PostgreSQL real (integración) |
| CI | GitHub Actions: lint, tipos, pruebas y build de la web y la API |
| Despliegue | Vercel (web) + Render (API) + Neon (base de datos) |

## Estructura

```
apps/
  web/                         # Next.js
    src/app/(publico)/         # Inicio, catálogo, pieza/[codigo], vendidas, ferias
    src/app/admin/             # Login y panel (piezas, ventas, ferias) + Server Actions
    src/lib/datos.ts           # Capa de datos: API o datos de ejemplo
    src/middleware.ts          # Protege /admin y renueva la sesión
  api/                         # NestJS
    src/modules/               # auth, productos, ventas, ferias, imagenes, categorias, salud
    prisma/                    # schema.prisma, migraciones y seed
    test/                      # Pruebas de integración
docker-compose.yml             # PostgreSQL local
render.yaml                    # Blueprint de la API para Render
```

Cada módulo de la API separa **controlador** (HTTP) → **servicio** (reglas del negocio) → **repositorio** (Prisma).

## Correr en local

Requisitos: Node 22, pnpm y Docker (o un PostgreSQL propio).

```bash
pnpm install
docker compose up -d                         # PostgreSQL en localhost:5432

cp apps/api/.env.example apps/api/.env       # revisa los valores
pnpm --filter api db:migrate                 # crea las tablas
SEED_EJEMPLOS=1 pnpm --filter api db:seed    # categorías, admin y piezas de ejemplo
pnpm dev:api                                 # API en http://localhost:4000 (docs en /docs)

cp apps/web/.env.example apps/web/.env.local
pnpm dev                                     # Web en http://localhost:3000, panel en /admin
```

### Pruebas

```bash
pnpm --filter api test        # unitarias
pnpm --filter api test:e2e    # integración (usa la base auralight_test y la borra)
pnpm lint && pnpm typecheck
```

## Variables de entorno

**API** (`apps/api/.env`, ver `.env.example`)

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL (en producción, la de Neon) |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Secretos largos y aleatorios para firmar los tokens |
| `WEB_ORIGIN` | Dominio del sitio, para CORS |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NOMBRE` | Administrador que crea el seed |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Fotos. Sin ellas, las piezas se muestran con ilustración |

**Web** (`apps/web/.env.local`)

| Variable | Para qué |
|---|---|
| `API_URL` | Dirección de la API. Vacío = datos de ejemplo |
| `NEXT_PUBLIC_WHATSAPP` | Número del negocio, con indicativo y sin `+` |
| `NEXT_PUBLIC_SITE_URL` | Opcional. En Vercel se detecta sola; úsala con un dominio propio |

## Despliegue

1. **Neon:** crea un proyecto y copia la cadena de conexión (`DATABASE_URL`).
2. **Cloudinary:** copia *Cloud name*, *API key* y *API secret* del panel.
3. **Render:** *New → Blueprint* con este repositorio (usa `render.yaml`). Llena `DATABASE_URL`, las de Cloudinary,
   `ADMIN_EMAIL` y `ADMIN_PASSWORD`. Al arrancar, la API aplica las migraciones y crea las categorías y el
   administrador si no existen (no cambia la contraseña de un administrador que ya existe).
   Con Neon, usa la conexión directa (sin `-pooler` en el host) para que las migraciones funcionen.
4. **Vercel:** en el proyecto web agrega `API_URL` con la dirección de Render y vuelve a desplegar.

## Próximos pasos (Fase 2)

- Reservas temporales de 30 minutos al tocar «Lo quiero».
- Sugerencias de nombre, categoría y descripción con Google Gemini al subir la foto.
- Estadísticas: ventas por mes, categoría, canal y feria.
- Pruebas E2E con Playwright.
