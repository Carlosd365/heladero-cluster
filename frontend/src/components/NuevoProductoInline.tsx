import { useEffect, useState } from "react";
import { repo } from "../lib/repo";
import Modal from "./Modal";
import "../styles/NuevoProductoInline.css";

interface NuevoProductoInlineProps {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}

export default function NuevoProductoInline({ open, onClose, onSaved }: NuevoProductoInlineProps) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("0");
    const [active, setActive] = useState(true);

    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);

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

    const confirmCreate = async () => {
        try {
            setSaving(true);

            await repo.crearProducto({
                name: name.trim(),
                price: Number(price),
                stock: Number(stock),
                active,
            });

            onSaved();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
            setShowModal(false);
        }
    };

    return (
        <div className="nuevo-prod-inline">
            <h2 className="nuevo-prod-inline-titulo">Nuevo Producto</h2>

            <form className="nuevo-prod-inline-form" onSubmit={onSubmit}>
                <label>Nombre:</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Bola de Vainilla"
                />

                <div className="nuevo-prod-inline-column">
                    <label>Precio:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                    />

                    <label>Stock:</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="0"
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
                        {saving ? "Guardando…" : "Guardar"}
                    </button>

                    <button type="button" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </form>

            {showModal && (
                <Modal
                    title="Confirmar creación"
                    message={`¿Deseas crear el producto "${name}"?`}
                    onConfirm={confirmCreate}
                    onCancel={() => setShowModal(false)}
                />
            )}

        </div>
    );
}
