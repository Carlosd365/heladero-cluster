import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { repo } from "../../lib/repo";
import Modal from "../../components/Modal";
import PushPanel from "../../components/PushPanel";
import NuevoClienteInline from "../../components/NuevoClienteInline";
import EditarClienteInline from "../../components/EditarClienteInline";
import "./Clientes.css";

export default function Clientes() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [action, setAction] = useState<"delete" | "edit" | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [panelMode, setPanelMode] = useState<"new" | "edit">("new");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingSaveAction, setPendingSaveAction] = useState<null | (() => void)>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = q.trim();

        if (query.length === 0) {
          const result = await repo.clientes();
          setRows(result);
          return;
        }

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

  const confirmDelete = async () => {
    if (!selected) return;

    try {
      await repo.eliminarCliente(selected._id);
      setRows(rows.filter((r) => r._id !== selected._id));
      toast.success("Cliente eliminado correctamente");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar el cliente");
    } finally {
      setShowModal(false);
      setSelected(null);
    }
  };

    return (
    <div className="clientes-layout">  
      <PushPanel open={showPanel} width={350}>

        {panelMode === "new" && (
          <NuevoClienteInline
            open={showPanel}
            onClose={() => setShowPanel(false)}
            onSaved={() => {
              setPendingSaveAction(() => async () => {
                const result = await repo.clientes();
                setRows(result);
                toast.success("Cliente guardado correctamente");
              });
              setShowSaveModal(true);
            }}
          />
        )}

        {panelMode === "edit" && (
          <EditarClienteInline
            open={showPanel}
            clientId={editingId}
            onClose={() => setShowPanel(false)}
            onSaved={() => {
              setPendingSaveAction(() => async () => {
                const result = await repo.clientes();
                setRows(result);
                toast.success("Cliente actualizado correctamente");
              });
              setShowSaveModal(true);
            }}
          />
        )}

      </PushPanel>
      <section className={`clientes ${showPanel ? "sidebar-abierto" : ""}`}>
        <div className="clientes-header">

          <input
            className="clientes-busqueda"
            placeholder="Buscar cliente..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className="clientes-nuevo"
            onClick={() => {
                setPanelMode("new");
                setEditingId(null);
                setShowPanel(true);
            }}
          >
            Nuevo cliente
          </button>
        </div>

        <div className="clientes-tabla-contenedor">
          <table className="clientes-tabla">
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((c: any) => (
                <tr key={c._id}>
                  {/* <td>{c._id}</td> */}
                  <td>{c.name}</td>
                  <td>{c.email || "-"}</td>
                  <td>{c.phoneNumber || "-"}</td>

                  <td>
                    <div className="clientes-acciones">
                      <button
                        className="btn-editar"
                        onClick={() => {
                            setPanelMode("edit");
                            setEditingId(c._id);
                            setShowPanel(true);
                        }}
                      >
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
        {showSaveModal && (
          <Modal
            title={panelMode === "new" ? "Confirmar creación" : "Confirmar actualización"}
            message={
              panelMode === "new"
                ? "¿Deseas guardar este nuevo cliente?"
                : "¿Deseas guardar los cambios de este cliente?"
            }
            onConfirm={async () => {
              setShowSaveModal(false);
              setShowPanel(false);

              if (pendingSaveAction) {
                await pendingSaveAction();
              }

              setPendingSaveAction(null);
            }}
            onCancel={() => {
              setShowSaveModal(false);
              setPendingSaveAction(null);
            }}
          />
        )}
      </section>
    </div>
  );
}
