// src/pages/NuevoCliente.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { repo } from "../lib/repo";

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

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return alert("Email inválido.");
    }
    if (telefono && !/^[0-9+\-\s]{7,20}$/.test(telefono)) {
      return alert("Teléfono inválido.");
    }

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
    <section className="grid gap-4 max-w-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Nuevo cliente</h1>
        <Link to="/clientes" className="text-sm underline">Volver</Link>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
        <div className="grid">
          <label className="text-sm text-gray-600">Nombres *</label>
          <input
            className="border rounded px-3 py-2"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            placeholder="Ej. Ana Lucía"
            autoFocus
          />
        </div>

        <div className="grid">
          <label className="text-sm text-gray-600">Apellidos</label>
          <input
            className="border rounded px-3 py-2"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            placeholder="Ej. López Pérez"
          />
        </div>

        <div className="grid">
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            className="border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="grid">
          <label className="text-sm text-gray-600">Teléfono</label>
          <input
            className="border rounded px-3 py-2"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="5555-5555"
          />
        </div>

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
