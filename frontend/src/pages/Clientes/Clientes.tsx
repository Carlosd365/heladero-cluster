import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { repo } from "../../lib/repo";
import "./Clientes.css";

export default function Clientes() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    repo.clientes(q).then(setRows).catch(console.error);
  }, [q]);

  return (
    <section className="clientes">
      <div className="clientes-header">
        <input className="clientes-busqueda" placeholder="Buscar cliente..." value={q} onChange={(e) => setQ(e.target.value)}/>
        <Link to="/clientes/nuevo" className="clientes-nuevo">
          Nuevo cliente
        </Link>
      </div>

      <div className="clientes-tabla-contenedor">
        <table className="clientes-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id_cliente}>
                <td>{r.id_cliente}</td>
                <td>{`${r.nombres ?? ""} ${r.apellidos ?? ""}`.trim()}</td>
                <td>{r.email ?? "-"}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td className="clientes-sin-datos" colSpan={3}>
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
