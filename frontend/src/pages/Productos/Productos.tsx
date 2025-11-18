import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { repo } from "../../lib/repo";
import Modal from "../../components/Modal";
import PushPanel from "../../components/PushPanel";
import NuevoProductoInline from "../../components/NuevoProductoInline";
import EditarProductoInline from "../../components/EditarProductoInline";
import "./Productos.css";

const fmtQ = (n: number) =>
    new Intl.NumberFormat("es-GT", {
        style: "currency",
        currency: "GTQ",
    }).format(n);

export default function Productos() {
    const [q, setQ] = useState("");
    const [rows, setRows] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);
    const [action, setAction] = useState<"delete" | "edit" | null>(null);
    const [showPanel, setShowPanel] = useState(false);
    const [panelMode, setPanelMode] = useState<"new" | "edit" | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const query = q.trim();
                if (query.length === 0) {
                const result = await repo.productos();
                setRows(result);
                return;
                }
                const filtered = await repo.buscarProductos(query);
                setRows(filtered);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [q]);

    const handleEdit = (producto: any) => {
        setEditingId(producto._id);
        setPanelMode("edit");
        setShowPanel(true);
    };

    const handleDelete = (producto: any) => {
        setSelected(producto);
        setAction("delete");
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!selected) return;
        try {
            await repo.eliminarProducto(selected._id);
            setRows(rows.filter((r) => r._id !== selected._id));
            toast.success("Producto eliminado");
        } catch (err) {
            console.error(err);
            toast.error("No se pudo eliminar el producto");
        } finally {
            setShowModal(false);
            setSelected(null);
        }
    };

    return (
        <div className="productos-layout">
            <PushPanel open={showPanel} width={350}>
                {panelMode === "new" && (
                    <NuevoProductoInline
                        open={showPanel}
                        onClose={() => {
                            setShowPanel(false);
                            setPanelMode(null);
                        }}
                        onSaved={async () => {
                            setShowPanel(false);
                            setPanelMode(null);
                            const result = await repo.productos();
                            setRows(result);
                            toast.success("Producto creado exitosamente");
                        }}
                    />
                )}

                {panelMode === "edit" && (
                    <EditarProductoInline
                        open={showPanel}
                        productoId={editingId}
                        onClose={() => {
                            setShowPanel(false);
                            setPanelMode(null);
                            setEditingId(null);
                        }}
                        onSaved={async () => {
                            setShowPanel(false);
                            setPanelMode(null);
                            setEditingId(null);
                            const result = await repo.productos();
                            setRows(result);
                            toast.success("Cambios guardados");
                        }}
                    />
                )}
            </PushPanel>

            <section className={`productos ${showPanel ? "sidebar-abierto" : ""}`}>
                <div className="productos-header">
                    <input
                        className="productos-input"
                        placeholder="Buscar producto..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />

                    <button
                        className="productos-nuevo"
                        onClick={() => {
                            setPanelMode("new");
                            setShowPanel(true);
                        }}
                    >
                        Nuevo producto
                    </button>
                </div>

                <div className="productos-tabla-contenedor">
                    <table className="productos-tabla">
                        <thead>
                            <tr>
                                {/* <th>ID</th> */}
                                <th>Nombre</th>
                                <th className="productos-th-right">Precio</th>
                                <th className="productos-th-center">Stock</th>
                                <th className="productos-th-center">Estado</th>
                                <th className="productos-th-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r: any) => (
                            <tr key={r._id}>
                                {/* <td>{r._id}</td> */}
                                <td>{r.name}</td>
                                <td className="productos-td-right">{fmtQ(Number(r.price))}</td>
                                <td className="productos-td-center">{r.stock}</td>
                                <td className="productos-td-center"> {r.active ? "Activo" : "Inactivo"}</td>
                                <td className="productos-td-center">
                                    <div className="productos-acciones">
                                        <button className="btn-editar" onClick={() => handleEdit(r)} >
                                            Editar
                                        </button>
                                        <button className="btn-eliminar" onClick={() => handleDelete(r)} >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ))}
                            {!rows.length && (
                                <tr>
                                    <td className="productos-sin-datos" colSpan={6}>
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
                    message={`¿Estás seguro de eliminar el producto "${selected?.name}"?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowModal(false)}
                    />
                )}

            </section>
        </div>
    );
}
