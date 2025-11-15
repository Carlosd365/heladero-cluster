import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { repo} from "../../lib/repo";
import "./Ventas.css";

type VentaRow = {
  id_venta: string;
  fecha: string | Date;
  cliente?: string;
  total?: number ;
  metodo_pago?: string ;
};

type ProductoComprado = {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
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

function parseSaleDate(date: any): string {
  if (date && typeof date === "object" && "$date" in date) return date.$date;
  if (typeof date === "string") return date;
  if (date instanceof Date) return date.toISOString();
  return "";
}

export default function Ventas() {
  const [rows, setRows] = useState<VentaRow[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [productos, setProductos] = useState<Record<string, ProductoComprado[]>>({});
  const abortRef = useRef<AbortController | null>(null);

  const fetchVentas = async () => {
    setLoading(true);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await repo.ventas();

      if (!controller.signal.aborted) {
        const rowsMapped: VentaRow[] = data.map((v) => ({
          id_venta: v._id,
          fecha: parseSaleDate(v.date),
          cliente: v.client?.name ?? "Desconocido",
          total: v.total ?? 0,
          metodo_pago: v.payment_method ?? "-",
        }));

        setRows(rowsMapped);
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

  const toggleDetalle = async (id_venta: string) => {
    if (expanded === id_venta) {
      setExpanded(null);
      return;
    }

    if (productos[id_venta]) {
      setExpanded(id_venta);
      return;
    }

    try {
      const venta = await repo.venta(id_venta);

      const productosMap: ProductoComprado[] = venta.products.map((p) => ({
        id: p._id,
        nombre: p.name,
        cantidad: p.amount,
        precio: p.price,
        subtotal: p.subtotal,
      }));

      setProductos((prev) => ({ ...prev, [id_venta]: productosMap }));
      setExpanded(id_venta);
    } catch (e) {
      console.error(e);
      alert("No se pudo cargar el detalle de la venta");
    }
  };

  const aplicarFiltros = async () => {

    console.log("FRONT — FROM (raw):", from);
    console.log("FRONT — TO (raw):", to);
    
    if (!from || !to) {
      return fetchVentas(); 
    }

    setLoading(true);
    try {
      console.log("FRONT — Llamando repo.ventaPorFecha con:", { from, to });
      const data = await repo.ventaPorFecha(from, to);
      console.log("FRONT — DATA RECIBIDA:", data);

      const rowsMapped = data.map(v => ({
        id_venta: v._id,
        fecha: parseSaleDate(v.date),
        cliente: v.client?.name ?? "Desconocido",
        total: v.total ?? 0,
        metodo_pago: v.payment_method ?? "-"
      }));

      console.log("FRONT — rowsMapped:", rowsMapped);

      setRows(rowsMapped);
    } catch (e) {
      console.error(e);
      alert("Error al filtrar ventas.");
    } finally {
      setLoading(false);
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

        <button onClick={aplicarFiltros} className="ventas-actualizar" disabled={loading}>
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
            {rows.map((r) => (
              <>
                <tr
                  key={r.id_venta}
                  className={`ventas-row ${expanded === r.id_venta ? "ventas-row-activa" : ""}`}
                  onClick={() => toggleDetalle(r.id_venta)} // ahora recibe string
                >
                  <td className="text-center">{expanded === r.id_venta ? "⮝" : "⮟"}</td>
                  <td>{r.id_venta}</td>
                  <td>{fmtDateGT(r.fecha)}</td>
                  <td>{r.cliente}</td>
                  <td className="text-right">{fmtCurrency(r.total ?? 0)}</td>
                  <td className="text-center">{r.metodo_pago}</td>
                </tr>

                {expanded === r.id_venta && (
                  <tr className="ventas-detalle-row">
                    <td colSpan={6}>
                      <div className="ventas-detalle">
                        {productos[r.id_venta] ? (
                          productos[r.id_venta].length ? (
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
                                {productos[r.id_venta].map((p) => (
                                  <tr key={p.id}>
                                    <td>{p.nombre}</td>
                                    <td>{p.cantidad}</td>
                                    <td>{fmtCurrency(p.precio)}</td>
                                    <td>{fmtCurrency(p.subtotal)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="ventas-detalle-cargando">Sin productos comprados.</div>
                          )
                        ) : (
                          <div className="ventas-detalle-cargando">Cargando detalle...</div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}

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
