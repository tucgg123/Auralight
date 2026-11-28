import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as argon2 from "argon2";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { configurarApp } from "../src/configurar-app";
import { PrismaService } from "../src/prisma/prisma.service";

const ADMIN = { email: "admin@prueba.co", contrasena: "clave-segura-123" };

describe("API de Auralight (integración)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let refresh: string;

  const http = () => request(app.getHttpServer());
  const auth = () => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = configurarApp(modulo.createNestApplication());
    await app.init();
    prisma = app.get(PrismaService);

    await prisma.$executeRawUnsafe(
      'TRUNCATE "venta","reserva","imagen","producto","feria","categoria","admin" RESTART IDENTITY CASCADE',
    );
    await prisma.categoria.createMany({
      data: [
        { slug: "anillos", nombre: "Anillos", singular: "anillo", prefijoCodigo: "A", consecutivo: 41 },
        { slug: "collares", nombre: "Collares", singular: "collar", prefijoCodigo: "C" },
      ],
    });
    await prisma.admin.create({
      data: { email: ADMIN.email, nombre: "Prueba", hashContrasena: await argon2.hash(ADMIN.contrasena) },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe("autenticación", () => {
    it("rechaza una contraseña incorrecta", async () => {
      const r = await http().post("/auth/login").send({ email: ADMIN.email, contrasena: "otra-clave-123" });
      expect(r.status).toBe(401);
      expect(r.body.mensaje).toMatch(/incorrectos/);
    });

    it("entrega tokens con credenciales válidas", async () => {
      const r = await http().post("/auth/login").send(ADMIN).expect(200);
      token = r.body.accessToken;
      refresh = r.body.refreshToken;
      expect(token).toBeTruthy();
      expect(refresh).toBeTruthy();
    });

    it("protege los endpoints de administración", async () => {
      await http().get("/admin/productos").expect(401);
      await http().get("/admin/productos").set({ Authorization: "Bearer basura" }).expect(401);
      await http().get("/auth/yo").set(auth()).expect(200);
    });

    it("no acepta un refresh token como token de acceso", async () => {
      await http().get("/auth/yo").set({ Authorization: `Bearer ${refresh}` }).expect(401);
    });
  });

  describe("piezas", () => {
    let id: string;

    it("valida los datos de entrada", async () => {
      const r = await http()
        .post("/admin/productos")
        .set(auth())
        .send({ nombre: "X", categoria: "anillos", material: "Acero", precio: 10.5, extra: true });
      expect(r.status).toBe(400);
      expect(Array.isArray(r.body.mensaje)).toBe(true);
    });

    it("crea una pieza con código consecutivo de su categoría", async () => {
      const r = await http()
        .post("/admin/productos")
        .set(auth())
        .send({ nombre: "Anillo Luna", categoria: "anillos", material: "Plata", precio: 30000 })
        .expect(201);
      expect(r.body.codigo).toBe("A-042");
      expect(r.body.estado).toBe("DISPONIBLE");
      id = r.body.id;
    });

    it("dos piezas creadas al mismo tiempo reciben códigos distintos", async () => {
      const datos = { nombre: "Collar", categoria: "collares", material: "Acero", precio: 20000 };
      const [a, b] = await Promise.all([
        http().post("/admin/productos").set(auth()).send(datos),
        http().post("/admin/productos").set(auth()).send(datos),
      ]);
      expect([a.body.codigo, b.body.codigo].sort()).toEqual(["C-001", "C-002"]);
    });

    it("aparece en el catálogo público y se encuentra por código", async () => {
      const lista = await http().get("/productos?categoria=anillos").expect(200);
      expect(lista.body.map((p: { codigo: string }) => p.codigo)).toContain("A-042");
      const det = await http().get("/productos/a-042").expect(200);
      expect(det.body.id).toBeUndefined(); // el público no ve ids internos
    });

    it("una pieza oculta desaparece del sitio público", async () => {
      await http().patch(`/admin/productos/${id}/estado`).set(auth()).send({ estado: "OCULTA" }).expect(200);
      await http().get("/productos/A-042").expect(404);
      await http().patch(`/admin/productos/${id}/estado`).set(auth()).send({ estado: "DISPONIBLE" }).expect(200);
    });

    it("agrega fotos solo dentro de la carpeta de Auralight", async () => {
      await http().post(`/admin/productos/${id}/imagenes`).set(auth()).send({ publicId: "otra/foto" }).expect(400);
      const r = await http()
        .post(`/admin/productos/${id}/imagenes`)
        .set(auth())
        .send({ publicId: "auralight/a042-frente" })
        .expect(201);
      expect(r.body.url).toBe("https://res.cloudinary.com/demo-auralight/image/upload/auralight/a042-frente");
    });

    it("firma subidas a Cloudinary", async () => {
      const r = await http().post("/admin/imagenes/firma").set(auth()).expect(200);
      expect(r.body).toMatchObject({ cloudName: "demo-auralight", folder: "auralight" });
      expect(r.body.signature).toMatch(/^[a-f0-9]{40}$/);
      expect(r.body.apiSecret).toBeUndefined();
    });

    describe("ventas", () => {
      it("si dos ventas llegan al mismo tiempo, solo una se registra", async () => {
        const [a, b] = await Promise.all([
          http().post(`/admin/productos/${id}/venta`).set(auth()).send({ canal: "WHATSAPP" }),
          http().post(`/admin/productos/${id}/venta`).set(auth()).send({ canal: "INSTAGRAM" }),
        ]);
        expect([a.status, b.status].sort()).toEqual([201, 409]);
        expect(await prisma.venta.count({ where: { productoId: id } })).toBe(1);
      });

      it("la pieza vendida pasa a la galería de vendidas", async () => {
        const catalogo = await http().get("/productos").expect(200);
        expect(catalogo.body.map((p: { codigo: string }) => p.codigo)).not.toContain("A-042");
        const vendidas = await http().get("/productos/vendidas").expect(200);
        expect(vendidas.body[0]).toMatchObject({ codigo: "A-042", estado: "VENDIDA" });
      });

      it("no deja ocultar ni eliminar una pieza vendida", async () => {
        await http().patch(`/admin/productos/${id}/estado`).set(auth()).send({ estado: "OCULTA" }).expect(409);
        await http().delete(`/admin/productos/${id}`).set(auth()).expect(409);
      });

      it("deshacer la venta la deja disponible otra vez", async () => {
        await http().delete(`/admin/productos/${id}/venta`).set(auth()).expect(204);
        const det = await http().get("/productos/A-042").expect(200);
        expect(det.body.estado).toBe("DISPONIBLE");
      });

      it("registra ventas en feria con precio final distinto", async () => {
        const feria = await http()
          .post("/admin/ferias")
          .set(auth())
          .send({ nombre: "Feria de prueba", lugar: "Barranquilla", fecha: "2026-12-12" })
          .expect(201);
        const r = await http()
          .post(`/admin/productos/${id}/venta`)
          .set(auth())
          .send({ canal: "FERIA", feriaId: feria.body.id, precioFinal: 25000 })
          .expect(201);
        expect(r.body).toMatchObject({ canal: "FERIA", precioFinal: 25000, feria: { nombre: "Feria de prueba" } });
        await http().delete(`/admin/ferias/${feria.body.id}`).set(auth()).expect(409);
      });
    });
  });

  it("cerrar sesión invalida el refresh token", async () => {
    await http().post("/auth/refresh").send({ refreshToken: refresh }).expect(200);
    await http().post("/auth/logout").set(auth()).expect(204);
    await http().post("/auth/refresh").send({ refreshToken: refresh }).expect(401);
  });

  describe("categorías", () => {
    beforeAll(async () => {
      token = (await http().post("/auth/login").send(ADMIN).expect(200)).body.accessToken;
    });

    it("crea una categoría con slug y orden automáticos", async () => {
      const r = await http()
        .post("/admin/categorias")
        .set(auth())
        .send({ nombre: "Tobilleras Únicas", singular: "tobillera", articulo: "la", prefijoCodigo: "t" })
        .expect(201);
      expect(r.body).toMatchObject({ slug: "tobilleras-unicas", prefijoCodigo: "T" });
      const lista = await http().get("/categorias").expect(200);
      expect(lista.body.at(-1).slug).toBe("tobilleras-unicas");
    });

    it("no repite prefijos ni nombres", async () => {
      const r = await http()
        .post("/admin/categorias")
        .set(auth())
        .send({ nombre: "Argollas", singular: "argolla", articulo: "la", prefijoCodigo: "A" })
        .expect(409);
      expect(r.body.mensaje).toMatch(/prefijo A/);
      await http()
        .post("/admin/categorias")
        .set(auth())
        .send({ nombre: "anillos", singular: "anillo", articulo: "el", prefijoCodigo: "N" })
        .expect(409);
    });

    it("las piezas nuevas usan el prefijo de la categoría", async () => {
      const r = await http()
        .post("/admin/productos")
        .set(auth())
        .send({ nombre: "Tobillera Sol", categoria: "tobilleras-unicas", material: "Acero", precio: 15000 })
        .expect(201);
      expect(r.body.codigo).toBe("T-001");
    });

    it("no deja cambiar el prefijo ni borrar una categoría con piezas", async () => {
      const cats = await http().get("/admin/categorias").set(auth()).expect(200);
      const tob = cats.body.find((c: { slug: string }) => c.slug === "tobilleras-unicas");
      expect(tob._count.productos).toBe(1);
      await http().patch(`/admin/categorias/${tob.id}`).set(auth()).send({ prefijoCodigo: "B" }).expect(409);
      await http().delete(`/admin/categorias/${tob.id}`).set(auth()).expect(409);
      await http().patch(`/admin/categorias/${tob.id}`).set(auth()).send({ nombre: "Tobilleras" }).expect(200);
    });

    it("borra una categoría vacía", async () => {
      const r = await http()
        .post("/admin/categorias")
        .set(auth())
        .send({ nombre: "Broches", singular: "broche", articulo: "el", prefijoCodigo: "B" })
        .expect(201);
      await http().delete(`/admin/categorias/${r.body.id}`).set(auth()).expect(204);
      await http().get("/admin/categorias").expect(401);
    });
  });
});
