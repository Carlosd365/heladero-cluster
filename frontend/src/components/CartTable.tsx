import "./CartTable.css"

export type CartItem = {
  id_producto: number;
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
  onQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) {
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
                  <input
                    type="number"
                    min={1}
                    max={i.stock ?? undefined}
                    value={i.cantidad}
                    onChange={(e) =>
                      onQty(i.id_producto, Number(e.target.value))
                    }
                    className="cart-input"
                  />
                </td>
                <td>Q {i.precio.toFixed(2)}</td>
                <td>Q {(i.precio * i.cantidad).toFixed(2)}</td>
                <td className="cart-remove">
                  <button onClick={() => onRemove(i.id_producto)}>
                    Quitar
                  </button>
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
      <div className="cart-subtotal">
        Subtotal: <span>Q {subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
