-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "EstadoProducto" AS ENUM ('DISPONIBLE', 'RESERVADA', 'VENDIDA', 'OCULTA');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('ACTIVA', 'CONFIRMADA', 'VENCIDA', 'CANCELADA', 'CONVERTIDA');

-- CreateEnum
CREATE TYPE "CanalVenta" AS ENUM ('WEB', 'FERIA', 'WHATSAPP', 'INSTAGRAM', 'OTRO');

-- CreateTable
CREATE TABLE "admin" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash_contrasena" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'ADMIN',
    "version_token" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "singular" TEXT NOT NULL,
    "articulo" TEXT NOT NULL DEFAULT 'el',
    "prefijo_codigo" TEXT NOT NULL,
    "consecutivo" INTEGER NOT NULL DEFAULT 0,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producto" (
    "id" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL DEFAULT '',
    "material" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "estado" "EstadoProducto" NOT NULL DEFAULT 'DISPONIBLE',
    "reservado_hasta" TIMESTAMP(3),
    "categoria_id" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagen" (
    "id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "public_id" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "imagen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserva" (
    "id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'ACTIVA',
    "expira_en" TIMESTAMP(3) NOT NULL,
    "ip_hash" TEXT,
    "creada_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feria" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "lugar" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "horario" TEXT,

    CONSTRAINT "feria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venta" (
    "id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "precio_final" INTEGER NOT NULL,
    "canal" "CanalVenta" NOT NULL,
    "feria_id" UUID,
    "registrada_por" UUID,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "venta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_nombre_key" ON "categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_slug_key" ON "categoria"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_prefijo_codigo_key" ON "categoria"("prefijo_codigo");

-- CreateIndex
CREATE UNIQUE INDEX "producto_codigo_key" ON "producto"("codigo");

-- CreateIndex
CREATE INDEX "producto_estado_creado_en_idx" ON "producto"("estado", "creado_en");

-- CreateIndex
CREATE INDEX "imagen_producto_id_orden_idx" ON "imagen"("producto_id", "orden");

-- CreateIndex
CREATE INDEX "reserva_producto_id_estado_idx" ON "reserva"("producto_id", "estado");

-- CreateIndex
CREATE INDEX "feria_fecha_idx" ON "feria"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "venta_producto_id_key" ON "venta"("producto_id");

-- CreateIndex
CREATE INDEX "venta_fecha_idx" ON "venta"("fecha");

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagen" ADD CONSTRAINT "imagen_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venta" ADD CONSTRAINT "venta_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venta" ADD CONSTRAINT "venta_feria_id_fkey" FOREIGN KEY ("feria_id") REFERENCES "feria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venta" ADD CONSTRAINT "venta_registrada_por_fkey" FOREIGN KEY ("registrada_por") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
