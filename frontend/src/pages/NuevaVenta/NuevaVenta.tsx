import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { repo, type Cliente, type CrearVentaPayload } from "../../lib/repo";
import Autocomplete from "../../components/Autocomplete";
import CartTable from "../../components/CartTable";
import type { CartItem } from "../../components/CartTable";
import "./NuevaVenta.css";

type MetodoPago = NonNullable<CrearVentaPayload["metodo_pago"]>;

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
  const nav = useNavigate();

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + Number(i.precio) * Number(i.cantidad), 0),
    [items]
  );

  const addProd = (p: any) => {
    setItems((prev) => {
      const found = prev.find((x) => x.id_producto === p.id_producto);
      if (found) {
        const nuevaCant = Math.min(found.cantidad + 1, Number(p.stock ?? Infinity));
        return prev.map((x) =>
          x.id_producto === p.id_producto ? { ...x, cantidad: nuevaCant } : x
        );
      }
      return [
        ...prev,
        {
          id_producto: p.id_producto,
          nombre: p.nombre,
          precio: Number(p.precio),
          cantidad: 1,
          stock: Number(p.stock ?? 0),
        },
      ];
    });
  };

  const onQty = (id: number, qty: number) =>
    setItems((prev) =>
      prev.map((x) =>
        x.id_producto === id
          ? { ...x, cantidad: Math.max(1, Math.min(qty, x.stock || qty)) }
          : x
      )
    );

  const onRemove = (id: number) =>
    setItems((prev) => prev.filter((x) => x.id_producto !== id));

  const confirmar = async () => {
    if (!cliente) return alert("Selecciona un cliente.");
    if (!items.length) return alert("Agrega al menos un producto.");
    if (items.some((i) => i.cantidad <= 0)) return alert("Hay cantidades inválidas.");
    if (items.some((i) => i.stock && i.cantidad > i.stock))
      return alert("Una o más cantidades superan el stock disponible.");

    try {
      setSaving(true);
      const { id_venta } = await repo.crearVenta({
        id_cliente: cliente.id_cliente,
        metodo_pago: metodo,
      });

      await Promise.all(
        items.map((i) =>
          repo.agregarDetalleVenta(id_venta, {
            id_producto: i.id_producto,
            cantidad: i.cantidad,
            precio_unitario: Number(i.precio),
          })
        )
      );

      alert(`Venta #${id_venta} creada`);
      nav("/ventas");
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message ?? "No se pudo crear la venta");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="nueva-venta">
      <div className="nueva-venta-header">
        <label className="nueva-venta-label">Cliente</label>

        <Autocomplete
          fetcher={(q) => repo.clientes(q)}
          onSelect={setCliente}
          placeholder="Buscar cliente..."
        />

        {cliente && (
          <span className="nueva-venta-cliente">
            {cliente.nombres} {cliente.apellidos ?? ""}
          </span>
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

      <div className="nueva-venta-productos">
        <Autocomplete
          fetcher={(q) => repo.productos(q, 1)}
          onSelect={addProd}
          placeholder="Buscar producto..."
        />
      </div>

      <CartTable items={items} onQty={onQty} onRemove={onRemove} />

      <div className="nueva-venta-footer">
        <div className="nueva-venta-total">
          Total: <b>{fmtQ(subtotal)}</b>
        </div>
        <button
          className="nueva-venta-confirmar"
          disabled={!cliente || !items.length || saving}
          onClick={confirmar}
        >
          {saving ? "Guardando..." : "Confirmar"}
        </button>

        <button
          className="nueva-venta-confirmar"
          disabled={saving}
          onClick={() => {
            if (
              window.confirm(
                "¿Seguro que deseas cancelar la venta?"
              )
            ) {
              setCliente(null);
              setItems([]);
              setMetodo("EFECTIVO");
            }
          }}
        >
          Cancelar
        </button>
      </div>
    </section>
  );
}
