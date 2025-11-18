import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { repo } from "../../lib/repo";
import "./NuevoCliente.css";

export default function NuevoCliente() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return alert("Ingresa el nombre del cliente.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return alert("Email inválido.");
    if (phoneNumber && !/^[0-9+\-\s]{7,20}$/.test(phoneNumber))
      return alert("Teléfono inválido.");

    try {
      setSaving(true);

      await repo.crearCliente({
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
      });

      alert("Cliente creado correctamente");
      nav("/clientes");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message ?? "No se pudo crear el cliente");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="nuevo-cliente">

      <div className="nuevo-cliente-card">

        <div className="nuevo-cliente-header">
          <h1 className="nuevo-cliente-titulo">Nuevo cliente</h1>
          <Link to="/clientes" className="nuevo-cliente-volver">Volver</Link>
        </div>

        <div className="nuevo-cliente-subtitulo">
          Ingresa la información requerida para registrar un nuevo cliente.
        </div>

        <form onSubmit={onSubmit} className="nuevo-cliente-form">

          <div className="nuevo-cliente-campo">
            <label className="nuevo-cliente-label">Nombres:</label>
            <input
              className="nuevo-cliente-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Ana Lucía"
              autoFocus
            />
          </div>

          <div className="nuevo-cliente-campo">
            <label className="nuevo-cliente-label">Email:</label>
            <input
              type="email"
              className="nuevo-cliente-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="nuevo-cliente-campo">
            <label className="nuevo-cliente-label">Teléfono:</label>
            <input
              className="nuevo-cliente-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
      </div>
    </section>
  );
}
