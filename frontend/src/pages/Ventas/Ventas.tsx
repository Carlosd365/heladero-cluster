import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { repo} from "../../lib/repo";
import ModalVenta from "../../components/ModalVenta";
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

const getPaginationNumbers = (totalPages: number, _currentPage: number) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);
  return pages;
};

export default function Ventas() {
  const [rows, setRows] = useState<VentaRow[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState<Record<string, ProductoComprado[]>>({});
  const abortRef = useRef<AbortController | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVentaId, setModalVentaId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 3;

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
        toast.error(e?.response?.data?.message ?? "No se pudieron cargar las ventas");
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  useEffect(() => {
    if (!from || !to) {
      fetchVentas();
      return;
    }

    const timer = setTimeout(() => {
      aplicarFiltros();
    }, 400);

    return () => clearTimeout(timer);
  }, [from, to]);

  const toggleDetalle = async (id_venta: string) => {
    setModalVentaId(id_venta);
    setModalOpen(true);
    setPage(1);

    if (productos[id_venta]) return;

    try {
      const venta = await repo.venta(id_venta);

      const productosMap = venta.products.map((p) => ({
        id: p._id,
        nombre: p.name,
        cantidad: p.amount,
        precio: p.price,
        subtotal: p.subtotal,
      }));

      setProductos((prev) => ({ ...prev, [id_venta]: productosMap }));
    } catch (e) {
      console.error(e);
      toast.error("No se pudo cargar el detalle de la venta");
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
      toast.error("Error al filtrar ventas");
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

        {/* 🔄 Botón Reset con SVG */}
        <button
          className="ventas-reset"
          onClick={() => {
            setFrom("");
            setTo("");
            fetchVentas();
          }}
          title="Reiniciar filtros"
        >
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.2-.7-8.9-4.9-10.3l-56.7-19.5a8 8 0 0 0-10.1 4.8c-1.8 5-3.8 10-5.9 14.9-17.3 41-42.1 77.8-73.7 109.4A344.77 344.77 0 0 1 655.9 829c-42.3 17.9-87.4 27-133.8 27-46.5 0-91.5-9.1-133.8-27A341.5 341.5 0 0 1 279 755.2a342.16 342.16 0 0 1-73.7-109.4c-17.9-42.4-27-87.4-27-133.9s9.1-91.5 27-133.9c17.3-41 42.1-77.8 73.7-109.4 31.6-31.6 68.4-56.4 109.3-73.8 42.3-17.9 87.4-27 133.8-27 46.5 0 91.5 9.1 133.8 27a341.5 341.5 0 0 1 109.3 73.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 0 0 3 14.1l175.6 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c-.1-6.6-7.8-10.3-13-6.2z"></path></svg>
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
              {/* <th>ID</th> */}
              <th>Fecha</th>
              <th>Cliente</th>
              <th className="text-right">Total</th>
              <th className="text-center">Método</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id_venta}
                className="ventas-row"
                onClick={() => toggleDetalle(r.id_venta)}
              >
                <td></td>
                {/* <td>{r.id_venta}</td> */}
                <td>{fmtDateGT(r.fecha)}</td>
                <td>{r.cliente}</td>
                <td className="text-right">{fmtCurrency(r.total ?? 0)}</td>
                <td className="text-center">{r.metodo_pago}</td>
              </tr>
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

      <ModalVenta
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    title={`Venta #${(modalVentaId || "").slice(0, 8).toUpperCase()}`}
  >
    {!modalVentaId || !productos[modalVentaId] ? (
      <p>Cargando...</p>
    ) : (
      <>
        <div className="venta-info-box">
          <div><b>Cliente:</b> {rows.find(x => x.id_venta === modalVentaId)?.cliente}</div>
          <div><b>Método:</b> {rows.find(x => x.id_venta === modalVentaId)?.metodo_pago}</div>
          <div>
            <b>Fecha:</b>{" "}
            {rows.find(x => x.id_venta === modalVentaId)?.fecha
              ? fmtDateGT(rows.find(x => x.id_venta === modalVentaId)!.fecha)
              : "Sin fecha"}
          </div>
          <div><b>Total:</b> {rows.find(x => x.id_venta === modalVentaId)?.total}</div>
        </div>

        {productos[modalVentaId]
          .slice((page - 1) * pageSize, page * pageSize)
          .map((p) => (
            <div key={p.id} className="producto-box">
              <div className="producto-titulo">{p.nombre}</div>

              <div className="producto-grid">
                <span><b>Cantidad:</b> {p.cantidad}</span>
                <span><b>Precio:</b> {fmtCurrency(p.precio)}</span>
              </div>

              <div className="producto-sub">
                <b>Subtotal:</b> {fmtCurrency(p.subtotal)}
              </div>
            </div>
          ))}

        <div className="mv-pages">
          {getPaginationNumbers(
            Math.ceil(productos[modalVentaId].length / pageSize),
            page
          ).map((num) => (
            <button
              key={num}
              className={`mv-page-btn ${num === page ? "active" : ""}`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </>
    )}
  </ModalVenta>

    </section>
  );
}
