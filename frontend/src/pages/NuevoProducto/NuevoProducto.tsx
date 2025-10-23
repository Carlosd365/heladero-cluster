import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { repo } from "../../lib/repo";
import "./NuevoProducto.css";

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
    <section className="nuevo-producto">
      <div className="nuevo-producto-header">
        <h1 className="nuevo-producto-titulo">Nuevo producto</h1>
        <Link to="/productos" className="nuevo-producto-volver">Volver</Link>
      </div>

      <form onSubmit={onSubmit} className="nuevo-producto-form">
        <div className="nuevo-producto-campo">
          <label className="nuevo-producto-label">Nombre</label>
          <input
            className="nuevo-producto-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Bola de Vainilla"
            autoFocus
          />
        </div>

        <div className="nuevo-producto-grid">
          <div className="nuevo-producto-campo">
            <label className="nuevo-producto-label">Precio</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="nuevo-producto-input"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="nuevo-producto-campo">
            <label className="nuevo-producto-label">Stock</label>
            <input
              type="number"
              step="1"
              min="0"
              className="nuevo-producto-input"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <label className="nuevo-producto-check">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
          />
          <span>Activo</span>
        </label>

        <div className="nuevo-producto-botones">
          <button
            type="submit"
            className="nuevo-producto-guardar"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            className="nuevo-producto-cancelar"
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
