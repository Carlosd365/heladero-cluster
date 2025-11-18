import { useEffect, useState } from "react";
import { repo } from "../lib/repo";
import Modal from "./Modal";
import "../styles/NuevoProductoInline.css";

interface EditarProductoInlineProps {
    open: boolean;
    productoId: string | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function EditarProductoInline({
    open,
    productoId,
    onClose,
    onSaved
}: EditarProductoInlineProps) {
    
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("0");
    const [active, setActive] = useState(true);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!open || !productoId) return;

        setLoading(true);

        repo.producto(productoId)
            .then((p) => {
                setName(p.name);
                setPrice(String(p.price));
                setStock(String(p.stock));
                setActive(!!p.active);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [open, productoId]);

    useEffect(() => {
        if (!open) {
            setName("");
            setPrice("");
            setStock("0");
            setActive(true);
            setShowModal(false);
        }
    }, [open]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const p = Number(price);
        const s = Number(stock);

        if (!name.trim()) return;
        if (!Number.isFinite(p) || p <= 0) return;
        if (!Number.isInteger(s) || s < 0) return;

        setShowModal(true);
    };

    const confirmUpdate = async () => {
        if (!productoId) return;

        try {
            setSaving(true);

            await repo.actualizarProducto(productoId, {
                name: name.trim(),
                price: Number(price),
                stock: Number(stock),
                active: active,
            });

            onSaved();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
            setShowModal(false);
        }
    };

    if (loading) return <p>Cargando datos...</p>;

    return (
        <div className="nuevo-prod-inline">
            <h2 className="nuevo-prod-inline-titulo">Editar Producto</h2>

            <form className="nuevo-prod-inline-form" onSubmit={onSubmit}>
                <label>Nombre:</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="nuevo-prod-inline-column">
                    <label>Precio:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <label>Stock:</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                </div>

                <label className="nuevo-prod-inline-check">
                    <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                    />
                    Activo
                </label>

                <div className="nuevo-prod-inline-botones">
                    <button type="submit" disabled={saving}>
                        {saving ? "Guardando…" : "Actualizar"}
                    </button>

                    <button type="button" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </form>

            {showModal && (
                <Modal
                    title="Confirmar actualización"
                    message={`¿Deseas guardar los cambios en "${name}"?`}
                    onConfirm={confirmUpdate}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
