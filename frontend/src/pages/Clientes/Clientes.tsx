import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { repo } from "../../lib/repo";
import Modal from "../../components/Modal";
import "./Clientes.css";

export default function Clientes() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [action, setAction] = useState<"delete" | "edit" | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = q.trim();

        if (query.length === 0) {
          // Mostrar todos los clientes activos
          const result = await repo.clientes();
          setRows(result);
          return;
        }

        // Buscar solo si hay texto
        const filtered = await repo.buscarClientes(query);
        setRows(filtered);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [q]);


  const handleDelete = (cliente: any) => {
    setSelected(cliente);
    setAction("delete");
    setShowModal(true);
  };

  const handleEdit = (cliente: any) => {
    nav(`/clientes/editar/${cliente._id}`);
  };

  const confirmDelete = async () => {
    if (!selected) return;

    try {
      await repo.eliminarCliente(selected._id);

      // Quitar de la tabla
      setRows(rows.filter((r) => r._id !== selected._id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el cliente");
    } finally {
      setShowModal(false);
      setSelected(null);
    }
  };

  return (
    <section className="clientes">
      <div className="clientes-header">
        <input
          className="clientes-busqueda"
          placeholder="Buscar cliente..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

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
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((c: any) => (
              <tr key={c._id}>
                <td>{c._id}</td>
                <td>{c.name}</td>
                <td>{c.email || "-"}</td>
                <td>{c.phoneNumber || "-"}</td>

                <td>
                  <div className="clientes-acciones">
                    <button className="btn-editar" onClick={() => handleEdit(c)}>
                      Editar
                    </button>

                    <button className="btn-eliminar" onClick={() => handleDelete(c)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!rows.length && (
              <tr>
                <td className="clientes-sin-datos" colSpan={5}>
                  Sin datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal
          title={action === "delete" ? "Confirmar eliminación" : "Confirmar acción"}
          message={`¿Estás seguro de que deseas eliminar al cliente "${selected?.name}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </section>
  );
}