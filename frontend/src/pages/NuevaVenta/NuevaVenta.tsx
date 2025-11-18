import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { repo, type Cliente, type VentaCreate } from "../../lib/repo";
import Autocomplete from "../../components/Autocomplete";
import CartTable from "../../components/CartTable";
import Modal from "../../components/Modal";
import type { CartItem } from "../../components/CartTable";
import "./NuevaVenta.css";

type MetodoPago = VentaCreate["payment_method"];

const fmtQ = (n: number) =>
  new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  }).format(n);

export default function NuevaVenta() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [metodo, setMetodo] = useState<MetodoPago>("EFECTIVO");
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const nav = useNavigate();

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + Number(i.precio) * Number(i.cantidad), 0),
    [items]
  );

  const addProd = (p: any) => {
    setItems((prev) => {
      const found = prev.find((x) => x.id_producto === p._id);
      if (found) {
        const nuevaCant = Math.min(found.cantidad + 1, Number(p.stock ?? Infinity));
        return prev.map((x) =>
          x.id_producto === p._id ? { ...x, cantidad: nuevaCant } : x
        );
      }
      return [
        ...prev,
        {
          id_producto: p._id,
          nombre: p.name,
          precio: Number(p.price),
          cantidad: 1,
          stock: Number(p.stock ?? 0),
        },
      ];
    });
  };

  const onQty = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((x) =>
        x.id_producto === id
          ? { ...x, cantidad: Math.max(1, Math.min(qty, x.stock || qty)) }
          : x
      )
    );

  const onRemove = (id: string) =>
    setItems((prev) => prev.filter((x) => x.id_producto !== id));

  const handleConfirmClick = () => {
    if (!cliente) {
      toast.error("Selecciona un cliente");
      return;
    }
    if (!items.length) {
      toast.error("Agrega al menos un producto");
      return;
    }
    setShowModal(true);
  };

  const confirmarVenta = async () => {
    try {
      setSaving(true);

      const payload: VentaCreate = {
        client: {
          _id: cliente!._id,
          name: cliente!.name,
        },
        payment_method: metodo,
        total: subtotal,
        products: items.map((i) => ({
          _id: i.id_producto,
          name: i.nombre,
          amount: i.cantidad,
          price: i.precio,
          subtotal: i.cantidad * i.precio,
        })),
      };

      const venta = await repo.crearVenta(payload);

      toast.success("Venta creada correctamente");

      nav("/ventas");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "No se pudo crear la venta");
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  };


  return (
    <section className="nueva-venta">
      <h1 className="nv-title">Nueva Venta</h1>

      <div className="nv-card">
        <h2 className="nv-card-title">Cliente</h2>

        <div className="nv-row">
          <Autocomplete
            fetcher={(q) => repo.buscarClientes(q)}
            onSelect={setCliente}
            placeholder="Buscar cliente..."
          />

          {cliente && (
            <span className="nueva-venta-cliente">{cliente.name}</span>
          )}

          <div className="nueva-venta-metodo">
            <label className="nueva-venta-label">Método</label>
            <select
              value={metodo}
              onChange={(e) => setMetodo(e.target.value as MetodoPago)}
              className="nueva-venta-select"
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="QR">QR</option>
            </select>
          </div>
        </div>

        <h2 className="nv-card-title">Agregar productos</h2>
        <Autocomplete
          fetcher={async (q) => {
            const productos = await repo.buscarProductos(q);
            return productos.filter((p: { active: boolean }) => p.active);
          }}
          onSelect={addProd}
          placeholder="Buscar producto..."
        />

        <h2 className="nv-card-title">Carrito</h2>
        <CartTable items={items} onQty={onQty} onRemove={onRemove} />

        <div className="nv-bottom-row">
          <div className="nv-total">
            Total: <b>{fmtQ(subtotal)}</b>
          </div>

          <div className="nv-actions">
            <button
              className="nueva-venta-confirmar"
              disabled={!cliente || !items.length || saving}
              onClick={handleConfirmClick}
            >
              {saving ? "Guardando..." : "Confirmar"}
            </button>

            <button
              className="nueva-venta-confirmar"
              disabled={saving}
              onClick={() => nav("/ventas")}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal
          title="Confirmar venta"
          message={`¿Deseas registrar la venta por un total de ${fmtQ(subtotal)}?`}
          onConfirm={confirmarVenta}
          onCancel={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
