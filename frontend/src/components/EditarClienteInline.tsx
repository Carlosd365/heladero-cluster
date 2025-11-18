import { useEffect, useState } from "react";
import { repo } from "../lib/repo";
import "../styles/EditarClienteInline.css";

interface EditarClienteInlineProps {
    open: boolean;
    clientId: string | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function EditarClienteInline({ open, clientId, onClose, onSaved }: EditarClienteInlineProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open || !clientId) return;

        setLoading(true);

        repo.cliente(clientId)
            .then((data) => {
                setName(data.name || "");
                setEmail(data.email || "");
                setPhoneNumber(data.phoneNumber || "");
            })
            .catch(() => {
            })
            .finally(() => setLoading(false));
    }, [open, clientId]);

    useEffect(() => {
        if (!open) {
            setName("");
            setEmail("");
            setPhoneNumber("");
        }
    }, [open]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!clientId) return;
        if (!name.trim()) return;

        try {
            setSaving(true);

            await repo.actualizarCliente(clientId, {
                name: name.trim(),
                email: email.trim(),
                phoneNumber: phoneNumber.trim(),
            });

            onSaved();

        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="editar-inline">
            <h2 className="editar-inline-titulo">Editar Cliente</h2>

            <form className="editar-inline-form" onSubmit={onSubmit}>
                <label>Nombre:</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />

                <label>Email:</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />

                <label>Teléfono:</label>
                <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                <div className="editar-inline-botones">
                    <button type="submit" disabled={saving}>
                        {saving ? "Guardando…" : "Guardar cambios"}
                    </button>

                    <button type="button" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
