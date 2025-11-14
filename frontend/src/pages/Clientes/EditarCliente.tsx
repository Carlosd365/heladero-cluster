import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { repo } from "../../lib/repo";
import Modal from "../../components/Modal";
import "./EditarCliente.css";

export default function EditarCliente() {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        if (!id) return;
        repo
            .cliente(id)
            .then((data) => {
                setName(data.name || "");
                setEmail(data.email || "");
                setPhoneNumber(data.phoneNumber || "");
            })
            .catch(() => alert("No se pudo cargar el cliente"))
            .finally(() => setLoading(false));
    }, [id]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return alert("Ingresa el nombre.");
        setShowModal(true);
    };

    const confirmUpdate = async () => {
        try {
            setSaving(true);
            await repo.actualizarCliente(id!, {
                name: name.trim(),
                email: email.trim(),
                phoneNumber: phoneNumber.trim(),
            });
            nav("/clientes");
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
            setShowModal(false);
        }
    };

    if (loading) return <p>Cargando datos...</p>;

    return (
        <section className="editar-cliente">
            <div className="editar-cliente-header">
                <h1 className="editar-cliente-titulo">Editar cliente</h1>
                <Link to="/clientes" className="editar-cliente-volver">
                    Volver
                </Link>
            </div>

            <form onSubmit={onSubmit} className="editar-cliente-form">
                <div className="editar-cliente-campo">
                    <label>Nombres:</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Ana Lucía"
                    />
                </div>

                <div className="editar-cliente-campo">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                    />
                </div>

                <div className="editar-cliente-campo">
                    <label>Teléfono:</label>
                    <input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="5555-5555"
                    />
                </div>

                <div className="editar-cliente-botones">
                    <button type="submit" disabled={saving}>
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </button>
                    <button type="button" onClick={() => nav("/clientes")}>
                        Cancelar
                    </button>
                </div>
            </form>
            {showModal && (
                <Modal
                title="Confirmar actualización"
                message={`¿Deseas guardar los cambios realizados al cliente "${name}"?`}
                onConfirm={confirmUpdate}
                onCancel={() => setShowModal(false)}
                />
            )}
        </section>
    );
}
