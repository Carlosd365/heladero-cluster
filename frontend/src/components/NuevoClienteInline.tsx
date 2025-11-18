import { useState, useEffect } from "react";
import { repo } from "../lib/repo";
import "../styles/NuevoClienteInline.css";

interface NuevoClienteInlineProps {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}

export default function NuevoClienteInline({ open, onClose, onSaved }: NuevoClienteInlineProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) {
            setName("");
            setEmail("");
            setPhoneNumber("");
        }
    }, [open]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) 
            return
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
            return
        if (phoneNumber && !/^[0-9+\-\s]{7,20}$/.test(phoneNumber))
            return

        try {
            setSaving(true);

            await repo.crearCliente({
                name: name.trim(),
                email: email.trim(),
                phoneNumber: phoneNumber.trim(),
            });
            onSaved();
        } catch (err: any) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="nuevo-inline">
            <h2 className="nuevo-inline-titulo">Nuevo Cliente</h2>

            <form className="nuevo-inline-form" onSubmit={onSubmit}>
                <label>Nombre:</label>
                <input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ana Lucía"
                />

                <label>Email:</label>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                />

                <label>Teléfono:</label>
                <input 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="5555-5555"
                />

                <div className="nuevo-inline-botones">
                    <button type="submit" disabled={saving}>
                        {saving ? "Guardando…" : "Guardar"}
                    </button>

                    <button type="button" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
