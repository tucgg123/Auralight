import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CloudinaryService } from "../imagenes/cloudinary.service";
import type { ActualizarProductoDto, CrearProductoDto, FiltroAdminDto, FiltroProductosDto } from "./dto/producto.dto";
import { ProductosRepository, type ProductoCompleto } from "./productos.repository";

const ESTADOS_PUBLICOS = ["DISPONIBLE", "RESERVADA"] as const;

@Injectable()
export class ProductosService {
  constructor(
    private readonly repo: ProductosRepository,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // ---- Público ----

  async catalogo(f: FiltroProductosDto) {
    const lista = await this.repo.listar({ ...f, estados: [...ESTADOS_PUBLICOS] });
    return lista.map((p) => this.aPublico(p));
  }

  async vendidas() {
    const lista = await this.repo.listar({ estados: ["VENDIDA"], orden: "vendidas" });
    return lista.map((p) => this.aPublico(p));
  }

  async detallePublico(codigo: string) {
    const p = await this.repo.porCodigo(codigo);
    if (!p || p.estado === "OCULTA") throw new NotFoundException("La pieza no existe.");
    return this.aPublico(p);
  }

  // ---- Administración ----

  async listarAdmin(f: FiltroAdminDto) {
    const estados = f.estado ? [f.estado] : (["DISPONIBLE", "RESERVADA", "VENDIDA", "OCULTA"] as const);
    const lista = await this.repo.listar({ ...f, estados: [...estados] });
    return lista.map((p) => this.aAdmin(p));
  }

  async detalleAdmin(id: string) {
    return this.aAdmin(await this.obtener(id));
  }

  async crear(dto: CrearProductoDto) {
    const cat = await this.repo.categoriaPorSlug(dto.categoria);
    if (!cat) throw new BadRequestException("La categoría no existe.");
    const p = await this.repo.crear({
      nombre: dto.nombre,
      material: dto.material,
      precio: dto.precio,
      descripcion: dto.descripcion ?? "",
      categoriaId: cat.id,
    });
    return this.aAdmin(p);
  }

  /** Cambiar la categoría no cambia el código: el cliente ya pudo haberlo visto o compartido. */
  async actualizar(id: string, dto: ActualizarProductoDto) {
    await this.obtener(id);
    let categoriaId: number | undefined;
    if (dto.categoria) {
      const cat = await this.repo.categoriaPorSlug(dto.categoria);
      if (!cat) throw new BadRequestException("La categoría no existe.");
      categoriaId = cat.id;
    }
    const p = await this.repo.actualizar(id, {
      nombre: dto.nombre,
      material: dto.material,
      precio: dto.precio,
      descripcion: dto.descripcion,
      categoriaId,
    });
    return this.aAdmin(p);
  }

  async cambiarEstado(id: string, estado: "DISPONIBLE" | "OCULTA") {
    await this.obtener(id);
    const cambiadas = await this.repo.cambiarEstadoSiNoVendida(id, estado);
    if (cambiadas === 0) {
      throw new ConflictException("La pieza está vendida. Deshaz la venta antes de cambiar su estado.");
    }
    return this.detalleAdmin(id);
  }

  async eliminar(id: string) {
    const p = await this.obtener(id);
    if (p.venta) throw new ConflictException("No se puede eliminar una pieza vendida: hace parte del historial.");
    await this.repo.eliminar(id);
  }

  async obtener(id: string) {
    const p = await this.repo.porId(id);
    if (!p) throw new NotFoundException("La pieza no existe.");
    return p;
  }

  // ---- Formato de respuesta ----

  private imagenes(p: ProductoCompleto) {
    return p.imagenes.map((i) => ({ id: i.id, publicId: i.publicId, url: this.cloudinary.url(i.publicId) }));
  }

  aPublico(p: ProductoCompleto) {
    return {
      codigo: p.codigo,
      nombre: p.nombre,
      descripcion: p.descripcion,
      material: p.material,
      precio: p.precio,
      estado: p.estado,
      categoria: p.categoria,
      imagenes: this.imagenes(p),
      creadoEn: p.creadoEn,
      vendidaEn: p.venta?.fecha ?? null,
    };
  }

  aAdmin(p: ProductoCompleto) {
    return { ...this.aPublico(p), id: p.id, actualizadoEn: p.actualizadoEn, venta: p.venta };
  }
}
