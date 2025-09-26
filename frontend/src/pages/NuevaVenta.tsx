import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { repo, type Cliente, type CrearVentaPayload } from "../lib/repo";
import Autocomplete from "../components/Autocomplete";
import CartTable from "../components/CartTable";
import type { CartItem } from "../components/CartTable";


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
    () =>
      items.reduce(
        (s, i) => s + Number(i.precio) * Number(i.cantidad),
        0
      ),
    [items]
  );

  const addProd = (p: any) => {
    setItems((prev) => {
      const found = prev.find((x) => x.id_producto === p.id_producto);
      if (found) {
        const nuevaCant = Math.min(
          found.cantidad + 1,
          Number(p.stock ?? Infinity)
        );
        return prev.map((x) =>
          x.id_producto === p.id_producto
            ? { ...x, cantidad: nuevaCant }
            : x
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
          ? {
              ...x,
              cantidad: Math.max(1, Math.min(qty, x.stock || qty)),
            }
          : x
      )
    );

  const onRemove = (id: number) =>
    setItems((prev) => prev.filter((x) => x.id_producto !== id));

  const confirmar = async () => {
    if (!cliente) return alert("Selecciona un cliente.");
    if (!items.length) return alert("Agrega al menos un producto.");
    if (items.some((i) => i.cantidad <= 0))
      return alert("Hay cantidades inválidas.");
    if (items.some((i) => i.stock && i.cantidad > i.stock))
      return alert("Una o más cantidades superan el stock disponible.");

    try {
      setSaving(true);

      // 1) Crear la venta
      const { id_venta } = await repo.crearVenta({
        id_cliente: cliente.id_cliente,
        metodo_pago: metodo,
      });

      // 2) Agregar cada detalle
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
      alert(
        e?.response?.data?.message ?? "No se pudo crear la venta"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="grid gap-4">
      <div className="flex gap-3 items-center">
        <label className="text-sm text-gray-600">Cliente</label>

        <Autocomplete
          fetcher={(q) => repo.clientes(q)}
          onSelect={setCliente}
          placeholder="Buscar cliente..."
        />

        {cliente && (
          <span className="px-2 py-1 bg-gray-200 rounded text-sm">
            {cliente.nombres} {cliente.apellidos ?? ""}
          </span>
        )}

        <div className="ml-auto flex gap-2 items-center">
          <label className="text-sm text-gray-600">Método</label>
          <select
            value={metodo}
            onChange={(e) => setMetodo(e.target.value as MetodoPago)}
            className="border rounded px-2 py-1"
          >
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="QR">QR</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 items-end">
        <Autocomplete
          fetcher={(q) => repo.productos(q, 1)}
          onSelect={addProd}
          placeholder="Buscar producto..."
        />
      </div>

      <CartTable items={items} onQty={onQty} onRemove={onRemove} />

      <div className="flex justify-end items-center gap-6">
        <div className="text-xl">
          Total: <b>{fmtQ(subtotal)}</b>
        </div>
        <button
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
          disabled={!cliente || !items.length || saving}
          onClick={confirmar}
        >
          {saving ? "Guardando..." : "Confirmar"}
        </button>
      </div>
    </section>
  );
}
