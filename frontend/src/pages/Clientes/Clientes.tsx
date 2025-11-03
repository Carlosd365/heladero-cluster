import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { repo } from "../../lib/repo";
import Modal from "../../components/Modal";
import "./Clientes.css";

export default function Clientes() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<any[]>([]);const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [action, setAction] = useState<"delete" | "edit" | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    repo.clientes(q).then(setRows).catch(console.error);
  }, [q]);

  const handleDelete = (cliente: any) => {
    setSelected(cliente);
    setAction("delete");
    setShowModal(true);
  };

  const handleEdit = (cliente: any) => {
    nav(`/clientes/editar/${cliente.id_cliente}`);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    try {
      await repo.eliminarCliente(selected.id_cliente);
      setRows(rows.filter((r) => r.id_cliente !== selected.id_cliente));
    } catch (e) {
      alert("No se pudo eliminar el cliente");
      console.error(e);
    } finally {
      setShowModal(false);
      setSelected(null);
    }
  };

  return (
    <section className="clientes">
      <div className="clientes-header">
        <input className="clientes-busqueda" placeholder="Buscar cliente..." value={q} onChange={(e) => setQ(e.target.value)}/>
        <Link to="/clientes/nuevo" className="clientes-nuevo">
          Nuevo cliente
        </Link>
      </div>

      <div className="clientes-tabla-contenedor">
        <table className="clientes-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id_cliente}>
                <td>{r.id_cliente}</td>
                <td>{`${r.nombres ?? ""} ${r.apellidos ?? ""}`.trim()}</td>
                <td>{r.email ?? "-"}</td>
                <td>
                  <div className="clientes-acciones">
                    <button
                      className="btn-editar"
                      onClick={() => handleEdit(r)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleDelete(r)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td className="clientes-sin-datos" colSpan={3}>
                  Sin datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal
          title={
            action === "delete"
              ? "Confirmar eliminación"
              : "Confirmar acción"
          }
          message={`¿Estás seguro de que deseas eliminar al cliente "${selected?.nombres}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
