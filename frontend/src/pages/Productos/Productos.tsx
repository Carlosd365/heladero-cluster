import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { repo } from "../../lib/repo";
import "./Productos.css";

const fmtQ = (n: number) =>
    new Intl.NumberFormat("es-GT", {
        style: "currency",
        currency: "GTQ",
    }).format(n);

export default function Productos() {
    const [q, setQ] = useState("");
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        repo.productos(q, 1).then(setRows).catch(console.error);
    }, [q]);

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
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r: any) => (
                        <tr key={r.id_producto}>
                            <td>{r.id_producto}</td>
                            <td>{r.nombre}</td>
                            <td className="productos-td-right">{fmtQ(Number(r.precio))}</td>
                            <td className="productos-td-center">{r.stock}</td>
                            <td className="productos-td-center">
                            {Number(r.activo) ? "Activo" : "Inactivo"}
                            </td>
                        </tr>
                        ))}
                        {!rows.length && (
                        <tr>
                            <td className="productos-sin-datos" colSpan={5}>
                            Sin datos
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
