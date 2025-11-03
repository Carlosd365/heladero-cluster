import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { repo, type VentaDetalle } from "../../lib/repo";
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
  new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  }).format(n);

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
  const [expanded, setExpanded] = useState<number | null>(null);
  const [detalles, setDetalles] = useState<Record<number, VentaDetalle[]>>({});
  const abortRef = useRef<AbortController | null>(null);

  const fetchVentas = async () => {
    setLoading(true);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const params: Record<string, any> = {};
      if (from) params.from = from;
      if (to) params.to = to;

      const data = await repo.ventas(params);
      if (!controller.signal.aborted) {
        setRows(data as VentaRow[]);
      }
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
  }, []);

  const toggleDetalle = async (id_venta: number) => {
    if (expanded === id_venta) {
      setExpanded(null);
      return;
    }

    // Si ya tenemos los detalles cargados
    if (detalles[id_venta]) {
      setExpanded(id_venta);
      return;
    }

    try {
      const venta = await repo.venta(id_venta); // usa tu método actual
      if (venta?.detalle?.length) {
        setDetalles((prev) => ({ ...prev, [id_venta]: venta.detalle! }));
      } else {
        setDetalles((prev) => ({ ...prev, [id_venta]: [] }));
      }
      setExpanded(id_venta);
    } catch (e) {
      console.error(e);
      alert("No se pudo cargar el detalle de la venta");
    }
  };

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

        <button onClick={fetchVentas} className="ventas-actualizar" disabled={loading}>
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
              <th></th>
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
                <>
                  <tr
                    key={r.id_venta}
                    className={`ventas-row ${
                      expanded === r.id_venta ? "ventas-row-activa" : ""
                    }`}
                    onClick={() => toggleDetalle(r.id_venta)}
                  >
                    <td className="text-center">
                      {expanded === r.id_venta ? "⮝" : "⮟"}
                    </td>
                    <td>{r.id_venta}</td>
                    <td>{fmtDateGT(r.fecha)}</td>
                    <td>{r.cliente?.trim() || r.id_cliente || "-"}</td>
                    <td className="text-right">{fmtCurrency(totalNum)}</td>
                    <td className="text-center">{r.metodo_pago ?? "-"}</td>
                  </tr>

                  {expanded === r.id_venta && (
                    <tr className="ventas-detalle-row">
                      <td colSpan={6}>
                        <div className="ventas-detalle">
                          {detalles[r.id_venta] ? (
                            detalles[r.id_venta].length ? (
                              <table className="ventas-detalle-tabla">
                                <thead>
                                  <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {detalles[r.id_venta].map((d) => (
                                    <tr key={d.id_detalle_venta}>
                                      <td>{d.nombre ?? `#${d.id_producto}`}</td>
                                      <td>{d.cantidad}</td>
                                      <td>{fmtCurrency(d.precio_unitario)}</td>
                                      <td>{fmtCurrency(d.subtotal)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <div className="ventas-detalle-cargando">
                                Sin detalles disponibles.
                              </div>
                            )
                          ) : (
                            <div className="ventas-detalle-cargando">
                              Cargando detalle...
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {!rows.length && !loading && (
              <tr>
                <td className="ventas-sin-datos" colSpan={6}>
                  Sin datos
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td className="ventas-cargando" colSpan={6}>
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
