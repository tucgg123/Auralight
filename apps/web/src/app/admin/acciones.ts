"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { apiAdmin, ErrorApi, type FirmaSubida, type PiezaAdmin } from "@/lib/admin/api";
import {
  COOKIE_ACCESO,
  COOKIE_REFRESH,
  DURACION_ACCESO,
  DURACION_REFRESH,
  opcionesCookie,
  urlApi,
} from "@/lib/admin/sesion";
import { ETIQUETA_CATALOGO, ETIQUETA_FERIAS } from "@/lib/datos";

export interface EstadoFormulario {
  error?: string;
  ok?: string;
  /** Lo que se envió, para no borrarle al usuario lo que escribió si hubo un error. */
  valores?: Record<string, string>;
}

/** React limpia el formulario después de enviarlo; devolvemos los valores para volver a llenarlo. */
const conValores = (f: FormData, estado: EstadoFormulario): EstadoFormulario => ({
  ...estado,
  valores: Object.fromEntries([...f.entries()].filter(([k, v]) => typeof v === "string" && k !== "contrasena" && !k.startsWith("$")) as [string, string][]),
});

const texto = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const mensaje = (e: unknown) => (e instanceof ErrorApi ? e.message : "No se pudo completar. Intenta de nuevo.");

/** Las redirecciones de Next.js (por ejemplo, sesión vencida) se lanzan como errores: hay que dejarlas pasar. */
const relanzarRedireccion = unstable_rethrow;

function refrescarCatalogo() {
  revalidateTag(ETIQUETA_CATALOGO);
  revalidatePath("/admin", "layout");
}

// ---- Sesión ----

export async function iniciarSesion(_: EstadoFormulario, f: FormData): Promise<EstadoFormulario> {
  const api = urlApi();
  if (!api) return conValores(f, { error: "El panel necesita la API. Configura API_URL en el sitio." });

  const res = await fetch(`${api}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: texto(f, "email"), contrasena: String(f.get("contrasena") ?? "") }),
    cache: "no-store",
  }).catch(() => null);

  if (!res) {
    return conValores(f, { error: "No se pudo conectar con la API. Si estaba dormida, intenta de nuevo en unos segundos." });
  }
  if (res.status === 429) return conValores(f, { error: "Demasiados intentos. Espera un minuto." });
  if (!res.ok) {
    const cuerpo = (await res.json().catch(() => ({}))) as { mensaje?: string | string[] };
    const m = Array.isArray(cuerpo.mensaje) ? cuerpo.mensaje[0] : cuerpo.mensaje;
    return conValores(f, { error: m ?? "No se pudo iniciar sesión." });
  }

  const { accessToken, refreshToken } = (await res.json()) as { accessToken: string; refreshToken: string };
  const c = await cookies();
  c.set(COOKIE_ACCESO, accessToken, opcionesCookie(DURACION_ACCESO));
  c.set(COOKIE_REFRESH, refreshToken, opcionesCookie(DURACION_REFRESH));

  const volver = texto(f, "volver");
  redirect(volver.startsWith("/admin/") && !volver.startsWith("//") ? volver : "/admin/piezas");
}

export async function cerrarSesion() {
  await apiAdmin("/auth/logout", { method: "POST" }).catch(relanzarRedireccion);
  const c = await cookies();
  c.delete(COOKIE_ACCESO);
  c.delete(COOKIE_REFRESH);
  redirect("/admin/login");
}

// ---- Piezas ----

export async function guardarPieza(_: EstadoFormulario, f: FormData): Promise<EstadoFormulario> {
  const id = texto(f, "id");
  const datos = {
    nombre: texto(f, "nombre"),
    categoria: texto(f, "categoria"),
    material: texto(f, "material"),
    precio: Number(texto(f, "precio").replace(/\D/g, "")),
    descripcion: texto(f, "descripcion"),
  };

  let pieza: PiezaAdmin;
  try {
    pieza = await apiAdmin<PiezaAdmin>(id ? `/admin/productos/${id}` : "/admin/productos", {
      method: id ? "PATCH" : "POST",
      body: JSON.stringify(datos),
    });
  } catch (e) {
    relanzarRedireccion(e);
    return conValores(f, { error: mensaje(e) });
  }

  // Fotos que se subieron a Cloudinary antes de crear la pieza. Si alguna falla, la pieza
  // ya existe: se sigue a su página para no crearla dos veces.
  let fallaronFotos = false;
  const fotos = JSON.parse(texto(f, "fotos") || "[]") as string[];
  for (const publicId of fotos) {
    try {
      await apiAdmin(`/admin/productos/${pieza.id}/imagenes`, { method: "POST", body: JSON.stringify({ publicId }) });
    } catch (e) {
      relanzarRedireccion(e);
      fallaronFotos = true;
    }
  }

  refrescarCatalogo();
  if (!id) redirect(`/admin/piezas/${pieza.id}?${fallaronFotos ? "fotos=error" : "nueva=1"}`);
  return conValores(f, fallaronFotos ? { error: "Se guardó, pero alguna foto no se pudo agregar." } : { ok: "Cambios guardados." });
}

export async function firmarSubida(): Promise<FirmaSubida | { error: string }> {
  try {
    return await apiAdmin<FirmaSubida>("/admin/imagenes/firma", { method: "POST" });
  } catch (e) {
    relanzarRedireccion(e);
    if (e instanceof ErrorApi && e.status === 503) {
      return { error: "Las fotos se activan cuando Cloudinary esté configurado en la API." };
    }
    return { error: mensaje(e) };
  }
}

export async function agregarImagen(productoId: string, publicId: string) {
  try {
    await apiAdmin(`/admin/productos/${productoId}/imagenes`, { method: "POST", body: JSON.stringify({ publicId }) });
  } catch (e) {
    relanzarRedireccion(e);
    return { error: mensaje(e) };
  }
  refrescarCatalogo();
  return {};
}

export async function eliminarImagen(imagenId: string) {
  await apiAdmin(`/admin/imagenes/${imagenId}`, { method: "DELETE" });
  refrescarCatalogo();
}

export async function hacerPrincipal(imagenId: string) {
  await apiAdmin(`/admin/imagenes/${imagenId}/principal`, { method: "PATCH" });
  refrescarCatalogo();
}

export async function cambiarEstado(id: string, estado: "DISPONIBLE" | "OCULTA"): Promise<EstadoFormulario> {
  try {
    await apiAdmin(`/admin/productos/${id}/estado`, { method: "PATCH", body: JSON.stringify({ estado }) });
  } catch (e) {
    relanzarRedireccion(e);
    return { error: mensaje(e) };
  }
  refrescarCatalogo();
  return { ok: estado === "OCULTA" ? "La pieza ya no se ve en el sitio." : "La pieza volvió al catálogo." };
}

export async function registrarVenta(_: EstadoFormulario, f: FormData): Promise<EstadoFormulario> {
  const id = texto(f, "id");
  const canal = texto(f, "canal");
  const precio = texto(f, "precioFinal").replace(/\D/g, "");
  try {
    await apiAdmin(`/admin/productos/${id}/venta`, {
      method: "POST",
      body: JSON.stringify({
        canal,
        feriaId: canal === "FERIA" ? texto(f, "feriaId") || undefined : undefined,
        precioFinal: precio ? Number(precio) : undefined,
      }),
    });
  } catch (e) {
    relanzarRedireccion(e);
    return conValores(f, { error: mensaje(e) });
  }
  refrescarCatalogo();
  return { ok: "¡Venta registrada! La pieza pasó a la galería de vendidas." };
}

export async function deshacerVenta(id: string): Promise<EstadoFormulario> {
  try {
    await apiAdmin(`/admin/productos/${id}/venta`, { method: "DELETE" });
  } catch (e) {
    relanzarRedireccion(e);
    return { error: mensaje(e) };
  }
  refrescarCatalogo();
  return { ok: "Venta deshecha. La pieza está disponible otra vez." };
}

export async function eliminarPieza(id: string): Promise<EstadoFormulario> {
  try {
    await apiAdmin(`/admin/productos/${id}`, { method: "DELETE" });
  } catch (e) {
    relanzarRedireccion(e);
    return { error: mensaje(e) };
  }
  refrescarCatalogo();
  redirect("/admin/piezas");
}

// ---- Ferias ----

function refrescarFerias() {
  revalidateTag(ETIQUETA_FERIAS);
  revalidatePath("/admin/ferias");
}

export async function guardarFeria(_: EstadoFormulario, f: FormData): Promise<EstadoFormulario> {
  const id = texto(f, "id");
  const datos = {
    nombre: texto(f, "nombre"),
    lugar: texto(f, "lugar"),
    fecha: texto(f, "fecha"),
    horario: texto(f, "horario") || undefined,
  };
  try {
    await apiAdmin(id ? `/admin/ferias/${id}` : "/admin/ferias", {
      method: id ? "PATCH" : "POST",
      body: JSON.stringify(datos),
    });
  } catch (e) {
    relanzarRedireccion(e);
    return conValores(f, { error: mensaje(e) });
  }
  refrescarFerias();
  return id ? conValores(f, { ok: "Feria actualizada." }) : { ok: "Feria creada." };
}

export async function eliminarFeria(id: string): Promise<EstadoFormulario> {
  try {
    await apiAdmin(`/admin/ferias/${id}`, { method: "DELETE" });
  } catch (e) {
    relanzarRedireccion(e);
    return { error: mensaje(e) };
  }
  refrescarFerias();
  return { ok: "Feria eliminada." };
}
