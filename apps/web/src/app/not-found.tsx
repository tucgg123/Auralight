import Link from "next/link";

export default function NoEncontrada() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-5xl texto-oro">404</p>
      <h1 className="mt-4 text-xl text-marfil">Esta pieza no está (o ya voló)</h1>
      <p className="mt-2 text-sm text-humo">Puede que el enlace esté mal escrito o que la pieza ya no se muestre.</p>
      <Link href="/catalogo" className="mt-6 inline-block text-oro hover:underline">
        Ir al catálogo
      </Link>
    </div>
  );
}
