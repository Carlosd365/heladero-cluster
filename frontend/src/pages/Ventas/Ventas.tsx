import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { repo } from "../../lib/repo";
import "./Ventas.css";

type VentaRow = {
  id_venta: number;
  fecha: string | Date;
  id_cliente?: number | null;
  cliente?: string | null;
  total?: number | string | null;
  metodo_pago?: string | null;
};

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(n);

const fmtDateGT = (d: string | Date) =>
  new Date(d).toLocaleString("es-GT", {
    timeZone: "America/Guatemala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Ventas() {
  const [rows, setRows] = useState<VentaRow[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const params = useMemo(() => {
    const p: Record<string, any> = {};
    if (from) p.from = from;
    if (to) p.to = to;
    return p;
  }, [from, to]);

  const fetchVentas = async () => {
    setLoading(true);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const data = await repo.ventas(params);
      if (!controller.signal.aborted) setRows(data as VentaRow[]);
    } catch (e: any) {
      if (!controller.signal.aborted) {
        console.error(e);
        alert(e?.response?.data?.message ?? "No se pudieron cargar las ventas");
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, [params]);

  return (
    <section className="ventas">
      <div className="ventas-filtros">
        <div className="ventas-campo">
          <label className="ventas-label">Desde</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="ventas-input"
          />
        </div>
        <div className="ventas-campo">
          <label className="ventas-label">Hasta</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="ventas-input"
          />
        </div>

        <button
          onClick={fetchVentas}
          className="ventas-actualizar"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Actualizar"}
        </button>
        <Link to="/ventas/nueva" className="ventas-nueva">
          Nueva venta
        </Link>
      </div>

      <div className="ventas-tabla-contenedor">
        <table className="ventas-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th className="text-right">Total</th>
              <th className="text-center">Método</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const totalNum = Number(r.total ?? 0);
              return (
                <tr key={r.id_venta} className="ventas-row">
                  <td>{r.id_venta}</td>
                  <td>{fmtDateGT(r.fecha)}</td>
                  <td>{r.cliente?.trim() || r.id_cliente || "-"}</td>
                  <td className="text-right">{fmtCurrency(totalNum)}</td>
                  <td className="text-center">{r.metodo_pago ?? "-"}</td>
                </tr>
              );
            })}
            {!rows.length && !loading && (
              <tr>
                <td className="ventas-sin-datos" colSpan={5}>
                  Sin datos
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td className="ventas-cargando" colSpan={5}>
                  Cargando ventas...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
