import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { repo } from "../../lib/repo";
import Modal from "../../components/Modal";
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
    const nav = useNavigate();

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
        nav(`/productos/editar/${producto._id}`);
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
        } catch (e) {
            alert("No se pudo eliminar el producto");
            console.error(e);
        } finally {
            setShowModal(false);
            setSelected(null);
        }
    };

    return (
        <section className="productos">
            <div className="productos-header">
                <input
                    className="productos-input"
                    placeholder="Buscar producto..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />

                <Link to="/productos/nuevo" className="productos-nuevo">
                    Nuevo producto
                </Link>
            </div>

            <div className="productos-tabla-contenedor">
                <table className="productos-tabla">
                    <thead>
                        <tr>
                            <th>ID</th>
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
                            <td>{r._id}</td>
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
    );
}
