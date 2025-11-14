import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { repo } from "../../lib/repo";
import Modal from "../../components/Modal";
import "../NuevoProducto/NuevoProducto.css";

export default function EditarProducto() {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState("");
    const [price, setPrice] = useState<string>("");
    const [stock, setStock] = useState<string>("0");
    const [active, setActive] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        if (!id) return;
        repo
            .producto(id)
            .then((p) => {
                setName(p.name);
                setPrice(String(p.price));
                setStock(String(p.stock));
                setActive(!!p.active);
            })
        .catch(() => alert("No se pudo cargar el producto"))
        .finally(() => setLoading(false));
    }, [id]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const p = Number(price);
        const s = Number(stock);

        if (!name.trim()) return alert("Ingresa el nombre.");
        if (!Number.isFinite(p) || p <= 0) return alert("Precio inválido.");
        if (!Number.isInteger(s) || s < 0) return alert("Stock inválido.");

        setShowModal(true);
    };

    const confirmUpdate = async () => {
        try {
            setSaving(true);
            await repo.actualizarProducto(id!, {
                name: name.trim(),
                price: Number(price),
                stock: Number(stock),
                active: active ? true : false,
            });
            // alert("Producto actualizado correctamente");
            nav("/productos");
        } catch (e) {
            console.error(e);
            // alert("No se pudo actualizar el producto");
        } finally {
            setSaving(false);
            setShowModal(false);
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <section className="nuevo-producto">
            <div className="nuevo-producto-header">
                <h1 className="nuevo-producto-titulo">Editar producto</h1>
                <Link to="/productos" className="nuevo-producto-volver">
                    Volver
                </Link>
            </div>

            <form onSubmit={onSubmit} className="nuevo-producto-form">
                <div className="nuevo-producto-campo">
                    <label className="nuevo-producto-label">Nombre:</label>
                    <input
                        className="nuevo-producto-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="nuevo-producto-grid">
                    <div className="nuevo-producto-campo">
                        <label className="nuevo-producto-label">Precio:</label>
                        <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="nuevo-producto-input"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="nuevo-producto-campo">
                        <label className="nuevo-producto-label">Stock:</label>
                        <input
                        type="number"
                        step="1"
                        min="0"
                        className="nuevo-producto-input"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        />
                    </div>
                </div>

                <label className="nuevo-producto-check">
                    <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                    />
                    <span>Activo</span>
                </label>

                <div className="nuevo-producto-botones">
                    <button
                        type="submit"
                        className="nuevo-producto-guardar"
                        disabled={saving}
                    >
                        {saving ? "Guardando..." : "Actualizar"}
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
            {showModal && (
                <Modal
                title="Confirmar actualización"
                message={`¿Deseas guardar los cambios en el producto "${name}"?`}
                onConfirm={confirmUpdate}
                onCancel={() => setShowModal(false)}
                />
            )}
        </section>
    );
}
