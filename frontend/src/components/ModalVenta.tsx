import type { ReactNode } from "react";
import "./ModalVenta.css";

export default function ModalVenta({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="mv-overlay" onClick={onClose}>
      <div className="mv-modal" onClick={(e) => e.stopPropagation()}>
        <header className="mv-header">
          <h2 className="mv-title">{title}</h2>
          <button className="mv-close" onClick={onClose}>✕</button>
        </header>

        <div className="mv-body">{children}</div>

        {footer && <footer className="mv-footer">{footer}</footer>}
      </div>
    </div>
  );
}
