import "../styles/Modal.css";

interface ModalProps {
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function Modal({ title = "Confirmar acción", message = "¿Estás seguro?", onConfirm, onCancel, }: ModalProps) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2 className="modal-title">{title}</h2>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button className="modal-cancelar" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button className="modal-confirmar" onClick={onConfirm}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
