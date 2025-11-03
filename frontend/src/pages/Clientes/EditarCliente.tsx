import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { repo } from "../../lib/repo";
import Modal from "../../components/Modal";
import "./EditarCliente.css";

export default function EditarCliente() {
    const { id } = useParams<{ id: string }>();
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        if (!id) return;
        repo
            .cliente(id)
            .then((data) => {
                setNombres(data.nombres || "");
                setApellidos(data.apellidos || "");
                setEmail(data.email || "");
                setTelefono(data.telefono || "");
            })
            .catch(() => alert("No se pudo cargar el cliente"))
            .finally(() => setLoading(false));
    }, [id]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombres.trim()) return alert("Ingresa los nombres.");
        setShowModal(true);
    };

    const confirmUpdate = async () => {
        try {
            setSaving(true);
            await repo.actualizarCliente(id!, {
                nombres: nombres.trim(),
                apellidos: apellidos.trim() || null,
                email: email.trim() || null,
                telefono: telefono.trim() || null,
            });
            // alert("Cliente actualizado correctamente");
            nav("/clientes");
        } catch (e) {
            console.error(e);
            // alert("No se pudo actualizar el cliente");
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
                        value={nombres}
                        onChange={(e) => setNombres(e.target.value)}
                        placeholder="Ej. Ana Lucía"
                    />
                </div>

                <div className="editar-cliente-campo">
                    <label>Apellidos:</label>
                    <input
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        placeholder="Ej. López Pérez"
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
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
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
                message={`¿Deseas guardar los cambios realizados al cliente "${nombres}"?`}
                onConfirm={confirmUpdate}
                onCancel={() => setShowModal(false)}
                />
            )}
        </section>
    );
}
