// src/pages/NuevoProducto.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { repo } from "../lib/repo";

export default function NuevoProducto() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState<string>("");
  const [stock, setStock] = useState<string>("0");
  const [activo, setActivo] = useState(true);
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const p = Number(precio);
    const s = Number(stock);

    if (!nombre.trim()) return alert("Ingresa el nombre.");
    if (!Number.isFinite(p) || p <= 0) return alert("Precio inválido.");
    if (!Number.isInteger(s) || s < 0) return alert("Stock inválido.");

    try {
      setSaving(true);
      await repo.crearProducto({
        nombre: nombre.trim(),
        precio: p,
        stock: s,
        activo: activo ? 1 : 0,
      });
      alert("Producto creado");
      nav("/productos");
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.error ?? "No se pudo crear el producto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="grid gap-4 max-w-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Nuevo producto</h1>
        <Link to="/productos" className="text-sm underline">Volver</Link>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
        <div className="grid">
          <label className="text-sm text-gray-600">Nombre</label>
          <input
            className="border rounded px-3 py-2"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Bola de Vainilla"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid">
            <label className="text-sm text-gray-600">Precio</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="border rounded px-3 py-2"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="grid">
            <label className="text-sm text-gray-600">Stock</label>
            <input
              type="number"
              step="1"
              min="0"
              className="border rounded px-3 py-2"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
          />
          <span>Activo</span>
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded border"
            onClick={() => nav("/productos")}
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
