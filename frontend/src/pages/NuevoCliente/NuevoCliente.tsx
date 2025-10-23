import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { repo } from "../../lib/repo";
import "./NuevoCliente.css";

export default function NuevoCliente() {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombres.trim()) return alert("Ingresa los nombres.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Email inválido.");
    if (telefono && !/^[0-9+\-\s]{7,20}$/.test(telefono)) return alert("Teléfono inválido.");

    try {
      setSaving(true);
      await repo.crearCliente({
        nombres: nombres.trim(),
        apellidos: apellidos.trim() || null,
        email: email.trim() || null,
        telefono: telefono.trim() || null,
      });
      alert("Cliente creado");
      nav("/clientes");
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.error ?? "No se pudo crear el cliente");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="nuevo-cliente">
      <div className="nuevo-cliente-header">
        <h1 className="nuevo-cliente-titulo">Nuevo cliente</h1>
        <Link to="/clientes" className="nuevo-cliente-volver">Volver</Link>
      </div>

      <form onSubmit={onSubmit} className="nuevo-cliente-form">
        <div className="nuevo-cliente-campo">
          <label className="nuevo-cliente-label">Nombres *</label>
          <input
            className="nuevo-cliente-input"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            placeholder="Ej. Ana Lucía"
            autoFocus
          />
        </div>

        <div className="nuevo-cliente-campo">
          <label className="nuevo-cliente-label">Apellidos</label>
          <input
            className="nuevo-cliente-input"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            placeholder="Ej. López Pérez"
          />
        </div>

        <div className="nuevo-cliente-campo">
          <label className="nuevo-cliente-label">Email</label>
          <input
            type="email"
            className="nuevo-cliente-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="nuevo-cliente-campo">
          <label className="nuevo-cliente-label">Teléfono</label>
          <input
            className="nuevo-cliente-input"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="5555-5555"
          />
        </div>

        <div className="nuevo-cliente-botones">
          <button
            type="submit"
            className="nuevo-cliente-guardar"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            className="nuevo-cliente-cancelar"
            onClick={() => nav("/clientes")}
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
