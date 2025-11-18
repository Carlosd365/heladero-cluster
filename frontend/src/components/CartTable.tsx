import { useEffect, useState } from "react";
import "../styles/CartTable.css";

export type CartItem = {
  id_producto: string;
  nombre: string;
  precio: number;
  cantidad: number;
  stock?: number;
};

export default function CartTable({
  items,
  onQty,
  onRemove,
}: {
  items: CartItem[];
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {

  const [tempQty, setTempQty] = useState(
    Object.fromEntries(items.map(i => [i.id_producto, String(i.cantidad)]))
  );

  useEffect(() => {
    setTempQty(
      Object.fromEntries(items.map(i => [i.id_producto, String(i.cantidad)]))
    );
  }, [items]);

  const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);

  return (
    <div className="cart-table">
      <div className="cart-table-contenedor">
        <table className="cart-tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {items.map((i) => (
              <tr key={i.id_producto}>
                <td>{i.nombre}</td>

                <td>
                  <div className="qty-control">

                    <button
                      className="qty-btn"
                      onClick={() => {
                        const newQty = Math.max(1, i.cantidad - 1);
                        setTempQty({ ...tempQty, [i.id_producto]: String(newQty) });
                        onQty(i.id_producto, newQty);
                      }}
                    >
                      -
                    </button>

                    <input
                      className="qty-input"
                      value={tempQty[i.id_producto] ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          setTempQty({ ...tempQty, [i.id_producto]: val });
                        }
                      }}
                      onBlur={() => {
                        let raw = tempQty[i.id_producto];
                        let num = Number(raw);

                        if (!num || num < 1) num = 1;
                        if (i.stock) num = Math.min(num, i.stock);

                        setTempQty({ ...tempQty, [i.id_producto]: String(num) });
                        onQty(i.id_producto, num);
                      }}
                    />

                    <button
                      className="qty-btn"
                      onClick={() => {
                        const newQty = i.stock
                          ? Math.min(i.stock, i.cantidad + 1)
                          : i.cantidad + 1;

                        setTempQty({ ...tempQty, [i.id_producto]: String(newQty) });
                        onQty(i.id_producto, newQty);
                      }}
                    >
                      +
                    </button>
                  </div>
                </td>

                <td>Q {i.precio.toFixed(2)}</td>
                <td>Q {(i.precio * i.cantidad).toFixed(2)}</td>
                <td className="cart-remove">
                  <button onClick={() => onRemove(i.id_producto)}>Quitar</button>
                </td>
              </tr>
            ))}

            {!items.length && (
              <tr>
                <td className="cart-empty" colSpan={5}>
                  Agrega productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* <div className="cart-subtotal">
        Subtotal: <span>Q {subtotal.toFixed(2)}</span>
      </div> */}
    </div>
  );
}
