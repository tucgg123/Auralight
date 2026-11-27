/**
 * Datos iniciales: categorías, administrador y (solo si se pide) piezas de ejemplo.
 *
 *   pnpm --filter api db:seed                 → categorías + administrador
 *   SEED_EJEMPLOS=1 pnpm --filter api db:seed → además, piezas y ferias de ejemplo
 *
 * Es idempotente: se puede correr varias veces sin duplicar nada.
 */
import { CanalVenta, EstadoProducto, PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

const categorias = [
  { slug: "anillos", nombre: "Anillos", singular: "anillo", articulo: "el", prefijoCodigo: "A", orden: 1 },
  { slug: "manillas", nombre: "Manillas", singular: "manilla", articulo: "la", prefijoCodigo: "M", orden: 2 },
  { slug: "collares", nombre: "Collares", singular: "collar", articulo: "el", prefijoCodigo: "C", orden: 3 },
  { slug: "cadenas", nombre: "Cadenas", singular: "cadena", articulo: "la", prefijoCodigo: "K", orden: 4 },
  { slug: "aretes", nombre: "Aretes", singular: "par de aretes", articulo: "el", prefijoCodigo: "R", orden: 5 },
];

type Ejemplo = {
  codigo: string;
  nombre: string;
  categoria: string;
  material: string;
  precio: number;
  descripcion: string;
  estado: EstadoProducto;
  creado: string;
  venta?: { fecha: string; canal: CanalVenta; feria?: string };
};

const ejemplos: Ejemplo[] = [
  { codigo: "C-021", nombre: "Collar Punto de Luz", categoria: "collares", material: "Acero inoxidable con circón", precio: 32000, descripcion: "Cadena delgada con un dije de circón en forma de gota. Sencillo, lindo y va con todo: de diario o para una salida.", estado: "DISPONIBLE", creado: "2026-11-24" },
  { codigo: "C-020", nombre: "Collares Cósmicos (pareja)", categoria: "collares", material: "Acero dorado con imán", precio: 45000, descripcion: "Dos collares con astronautas que se unen por un corazón imantado. Para regalar uno y quedarse con el otro: amores tan grandes como galaxias.", estado: "DISPONIBLE", creado: "2026-11-22" },
  { codigo: "A-042", nombre: "Anillo Negro Mate", categoria: "anillos", material: "Acero inoxidable negro", precio: 18000, descripcion: "Anillo de líneas limpias en negro mate. Esencial para él, resistente al agua y al uso diario.", estado: "DISPONIBLE", creado: "2026-11-20" },
  { codigo: "M-013", nombre: "Manilla Telaraña", categoria: "manillas", material: "Hilo trenzado y dije de acero", precio: 15000, descripcion: "Manilla de hilo trenzado a mano con un dije de telaraña en acero. Ajustable con nudo corredizo.", estado: "DISPONIBLE", creado: "2026-11-18" },
  { codigo: "C-019", nombre: "Collar Corazón Rubí", categoria: "collares", material: "Aleación plateada con cristal", precio: 28000, descripcion: "Dije de corazón con cristal rojo y un moño delicado en la parte superior.", estado: "DISPONIBLE", creado: "2026-11-15" },
  { codigo: "A-041", nombre: "Anillo Serpiente Esmeralda", categoria: "anillos", material: "Baño de oro con cristales verdes", precio: 25000, descripcion: "Anillo abierto en forma de serpiente con cristales color esmeralda. Ajustable a varias tallas.", estado: "DISPONIBLE", creado: "2026-11-12" },
  { codigo: "R-007", nombre: "Aretes Gota Zafiro", categoria: "aretes", material: "Acero inoxidable con cristal azul", precio: 22000, descripcion: "Aretes colgantes en forma de gota con cristal azul profundo, como la pluma del pavo real.", estado: "DISPONIBLE", creado: "2026-11-10" },
  { codigo: "K-005", nombre: "Cadena Eslabón Cubano", categoria: "cadenas", material: "Acero inoxidable dorado", precio: 38000, descripcion: "Cadena de eslabón cubano de 4 mm, 50 cm de largo. No se oscurece con el agua.", estado: "DISPONIBLE", creado: "2026-11-08" },
  { codigo: "C-018", nombre: "Collar Luna", categoria: "collares", material: "Acero dorado con esmalte azul", precio: 26000, descripcion: "Dije de media luna en esmalte azul noche con una pequeña estrella.", estado: "RESERVADA", creado: "2026-11-05" },
  { codigo: "M-012", nombre: "Manilla Hilo Azul Marino", categoria: "manillas", material: "Hilo encerado trenzado", precio: 12000, descripcion: "Manilla tejida a mano en azul marino, cierre ajustable. Unisex.", estado: "DISPONIBLE", creado: "2026-11-02" },
  { codigo: "A-040", nombre: "Anillo Turquesa", categoria: "anillos", material: "Acero plateado con piedra turquesa", precio: 24000, descripcion: "Anillo con piedra turquesa ovalada y engaste trabajado.", estado: "DISPONIBLE", creado: "2026-10-28" },
  { codigo: "R-006", nombre: "Aretes Argolla Dorada", categoria: "aretes", material: "Acero con baño de oro", precio: 20000, descripcion: "Argollas medianas de acabado brillante. Livianas para usar todo el día.", estado: "DISPONIBLE", creado: "2026-10-25" },
  { codigo: "C-017", nombre: "Collar Sol", categoria: "collares", material: "Acero dorado", precio: 26000, descripcion: "Dije de sol radiante en acero dorado.", estado: "VENDIDA", creado: "2026-10-10", venta: { fecha: "2026-10-14", canal: "WHATSAPP" } },
  { codigo: "C-016", nombre: "Collar Rosa Plateada", categoria: "collares", material: "Aleación plateada", precio: 24000, descripcion: "Dije de rosa de tallo largo.", estado: "VENDIDA", creado: "2026-09-30", venta: { fecha: "2026-10-03", canal: "INSTAGRAM" } },
  { codigo: "M-011", nombre: "Manilla Telaraña Roja", categoria: "manillas", material: "Hilo trenzado y dije de acero", precio: 15000, descripcion: "Manilla de hilo rojo con dije de telaraña.", estado: "VENDIDA", creado: "2026-09-15", venta: { fecha: "2026-09-18", canal: "FERIA", feria: "Feria de Emprendimiento CUC Connections" } },
  { codigo: "A-039", nombre: "Anillo Negro Liso", categoria: "anillos", material: "Acero inoxidable negro", precio: 18000, descripcion: "Anillo liso negro mate de 6 mm.", estado: "VENDIDA", creado: "2026-09-10", venta: { fecha: "2026-09-18", canal: "FERIA", feria: "Feria de Emprendimiento CUC Connections" } },
];

const ferias = [
  { nombre: "Feria de Emprendimiento CUC Connections", lugar: "Cafetería Central (Zona Coworking), Universidad de la Costa", fecha: "2026-09-18", horario: "9:00 a. m. – 4:00 p. m." },
  { nombre: "Feria Navideña de Emprendedores (ejemplo)", lugar: "Lugar por confirmar", fecha: "2026-12-12", horario: "10:00 a. m. – 6:00 p. m." },
];

const fecha = (d: string) => new Date(`${d}T12:00:00Z`);

async function main() {
  for (const c of categorias) {
    await prisma.categoria.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  console.log(`✓ ${categorias.length} categorías`);

  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NOMBRE } = process.env;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    if (ADMIN_PASSWORD.length < 8) throw new Error("ADMIN_PASSWORD debe tener al menos 8 caracteres.");
    const email = ADMIN_EMAIL.toLowerCase().trim();
    const existe = await prisma.admin.findUnique({ where: { email } });
    if (!existe) {
      await prisma.admin.create({
        data: { email, nombre: ADMIN_NOMBRE || "Administrador", hashContrasena: await argon2.hash(ADMIN_PASSWORD) },
      });
      console.log(`✓ Administrador creado: ${email}`);
    } else {
      console.log(`• El administrador ${email} ya existe (no se cambió su contraseña)`);
    }
  } else {
    console.log("• Sin ADMIN_EMAIL/ADMIN_PASSWORD: no se creó administrador");
  }

  if (process.env.SEED_EJEMPLOS !== "1") return;

  const feriasPorNombre = new Map<string, string>();
  for (const f of ferias) {
    const existente = await prisma.feria.findFirst({ where: { nombre: f.nombre } });
    const feria = existente ?? (await prisma.feria.create({ data: { ...f, fecha: new Date(`${f.fecha}T00:00:00Z`) } }));
    feriasPorNombre.set(f.nombre, feria.id);
  }

  const cats = new Map((await prisma.categoria.findMany()).map((c) => [c.slug, c]));
  for (const e of ejemplos) {
    if (await prisma.producto.findUnique({ where: { codigo: e.codigo } })) continue;
    const cat = cats.get(e.categoria)!;
    const p = await prisma.producto.create({
      data: {
        codigo: e.codigo,
        nombre: e.nombre,
        descripcion: e.descripcion,
        material: e.material,
        precio: e.precio,
        estado: e.estado,
        categoriaId: cat.id,
        creadoEn: fecha(e.creado),
      },
    });
    if (e.venta) {
      await prisma.venta.create({
        data: {
          productoId: p.id,
          canal: e.venta.canal,
          precioFinal: e.precio,
          fecha: fecha(e.venta.fecha),
          feriaId: e.venta.feria ? feriasPorNombre.get(e.venta.feria) : undefined,
        },
      });
    }
  }

  // Que los próximos códigos sigan después de los de ejemplo (A-043, C-022, …).
  for (const c of cats.values()) {
    const usados = ejemplos
      .filter((e) => e.categoria === c.slug)
      .map((e) => Number(e.codigo.split("-")[1]));
    const maximo = Math.max(0, ...usados);
    if (c.consecutivo < maximo) await prisma.categoria.update({ where: { id: c.id }, data: { consecutivo: maximo } });
  }
  console.log(`✓ ${ejemplos.length} piezas y ${ferias.length} ferias de ejemplo`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
