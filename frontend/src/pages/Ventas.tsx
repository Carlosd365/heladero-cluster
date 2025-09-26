// src/pages/Ventas.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { repo } from "../lib/repo";

type VentaRow = {
  id_venta: number;
  fecha: string | Date;
  id_cliente?: number | null;
  cliente?: string | null;
  total?: number | string | null;
  estado: "ABIERTA" | "PAGADA" | "ANULADA" | string;
  n_detalles?: number;
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
  const [estado, setEstado] = useState<"" | "ABIERTA" | "PAGADA" | "ANULADA">("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const params = useMemo(() => {
    const p: Record<string, any> = {};
    if (from) p.from = from;
    if (to) p.to = to;
    if (estado) p.estado = estado;
    return p;
  }, [from, to, estado]);

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

  const onPagar = async (id: number) => {
    if (!confirm(`¿Marcar venta #${id} como PAGADA?`)) return;
    try {
      await repo.pagarVenta(id);
      fetchVentas();
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message ?? "No se pudo pagar la venta");
    }
  };

  const onAnular = async (id: number) => {
    if (!confirm(`¿Anular la venta #${id}?`)) return;
    try {
      await repo.anularVenta(id);
      fetchVentas();
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message ?? "No se pudo anular la venta");
    }
  };

  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap gap-2 items-end">
        <div className="grid">
          <label className="text-sm text-gray-600">Desde</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="grid">
          <label className="text-sm text-gray-600">Hasta</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="grid">
          <label className="text-sm text-gray-600">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as any)}
            className="border rounded px-3 py-2"
          >
            <option value="">Todos</option>
            <option value="ABIERTA">Abierta</option>
            <option value="PAGADA">Pagada</option>
            <option value="ANULADA">Anulada</option>
          </select>
        </div>

        <button
          onClick={fetchVentas}
          className="ml-auto px-3 py-2 rounded border"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Actualizar"}
        </button>
        <Link to="/ventas/nueva" className="px-3 py-2 rounded bg-black text-white">
          Nueva venta
        </Link>
      </div>

      <div className="overflow-auto border rounded bg-white">
        <table className="w-full text-sm">
          <thead style={{ background: "#f3f4f6" }}>
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2">Fecha</th>
              <th className="p-2 text-left">Cliente</th>
              <th className="p-2 text-right">Total</th>
              <th className="p-2 text-center">Estado</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const totalNum = Number(r.total ?? 0);
              const canPay =
                r.estado === "ABIERTA" &&
                totalNum > 0 &&
                (r.n_detalles == null || Number(r.n_detalles) > 0);

              return (
                <tr key={r.id_venta} className="border-t hover:bg-gray-50">
                  <td className="p-2">{r.id_venta}</td>
                  <td className="p-2">{fmtDateGT(r.fecha)}</td>
                  <td className="p-2">
                    {r.cliente?.trim() || r.id_cliente || "-"}
                  </td>
                  <td className="p-2 text-right">{fmtCurrency(totalNum)}</td>
                  <td className="p-2 text-center">
                    <span
                      className={
                        "px-2 py-1 rounded text-xs " +
                        (r.estado === "PAGADA"
                          ? "bg-green-100 text-green-700"
                          : r.estado === "ANULADA"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-800")
                      }
                    >
                      {r.estado}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="px-2 py-1 text-xs rounded border"
                        disabled={!canPay}
                        onClick={() => onPagar(r.id_venta)}
                      >
                        Pagar
                      </button>
                      <button
                        className="px-2 py-1 text-xs rounded border"
                        disabled={r.estado === "ANULADA"}
                        onClick={() => onAnular(r.id_venta)}
                      >
                        Anular
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!rows.length && !loading && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={6}>
                  Sin datos
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td className="p-4 text-center text-gray-400" colSpan={6}>
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
