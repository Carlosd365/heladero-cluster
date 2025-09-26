import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { repo } from "../lib/repo";

const fmtQ = (n: number) =>
    new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(n);

export default function Productos() {
    const [q, setQ] = useState("");
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        repo.productos(q, 1).then(setRows).catch(console.error);
    }, [q]);

    return (
        <section className="grid gap-3">
        <div className="flex items-center gap-3">
            <input
            className="border rounded px-3 py-2 w-72"
            placeholder="Buscar producto..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            />

            <Link
            to="/productos/nuevo"
            className="ml-auto px-3 py-2 rounded bg-black text-white"
            >
            Nuevo producto
            </Link>
        </div>

        <div className="overflow-auto border rounded bg-white">
            <table className="w-full text-sm">
            <thead style={{ background: "#f3f4f6" }}>
                <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2">Precio</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Estado</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((r: any) => (
                <tr key={r.id_producto} className="border-t">
                    <td className="p-2">{r.id_producto}</td>
                    <td className="p-2">{r.nombre}</td>
                    <td className="p-2 text-right">{fmtQ(Number(r.precio))}</td>
                    <td className="p-2 text-center">{r.stock}</td>
                    <td className="p-2 text-center">
                    {Number(r.activo) ? "Activo" : "Inactivo"}
                    </td>
                </tr>
                ))}
                {!rows.length && (
                <tr>
                    <td className="p-4 text-center text-gray-500" colSpan={5}>
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
