import { db } from "../config/db";

export type NuevaVenta = {
  id_cliente?: number | null;
  metodo_pago?: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "QR";
  nota?: string;
};

export type Detalle = {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
};

async function recalcularTotales(id_venta: number) {
  const [rows] = await db.query(
    "SELECT COALESCE(SUM(subtotal),0) AS sub FROM detalle_venta WHERE id_venta = ?",
    [id_venta]
  );
  const sub = (rows as any[])[0].sub as number;
  await db.query("UPDATE ventas SET subtotal = ?, total = ? WHERE id_venta = ?", [sub, sub, id_venta]);
}

export const VentasService = {
  async list() {
    const [rows] = await db.query(
      `SELECT v.*, CONCAT(c.nombres,' ',c.apellidos) AS cliente
       FROM ventas v
       LEFT JOIN clientes c ON c.id_cliente = v.id_cliente
       ORDER BY v.id_venta DESC`
    );
    return rows as any[];
  },

  async get(id_venta: number) {
    const [v] = await db.query("SELECT * FROM ventas WHERE id_venta = ?", [id_venta]);
    const venta = (v as any[])[0];
    if (!venta) return null;
    const [det] = await db.query(
      `SELECT dv.*, p.nombre
       FROM detalle_venta dv
       JOIN productos p ON p.id_producto = dv.id_producto
       WHERE dv.id_venta = ?`,
      [id_venta]
    );
    venta.detalle = det;
    return venta;
  },

  async crearVenta(data: NuevaVenta) {
    const { id_cliente = null, metodo_pago = "EFECTIVO" } = data;
    const [res] = await db.query(
      "INSERT INTO ventas (id_cliente, metodo_pago, subtotal, total, estado) VALUES (?, ?, 0, 0, 'ABIERTA')",
      [id_cliente, metodo_pago]
    );
    const id = (res as any).insertId as number;
    return this.get(id);
  },

  async agregarDetalle(id_venta: number, d: Detalle) {
    const subtotal = d.cantidad * d.precio_unitario;
    await db.query(
      `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
       VALUES (?, ?, ?, ?, ?)`,
      [id_venta, d.id_producto, d.cantidad, d.precio_unitario, subtotal]
    );
    await recalcularTotales(id_venta);
    return this.get(id_venta);
  },

  async eliminarDetalle(id_venta: number, id_detalle_venta: number) {
    await db.query("DELETE FROM detalle_venta WHERE id_detalle_venta = ? AND id_venta = ?", [
      id_detalle_venta,
      id_venta
    ]);
    await recalcularTotales(id_venta);
    return this.get(id_venta);
  },

  async pagar(id_venta: number) {
    await db.query("UPDATE ventas SET estado = 'PAGADA' WHERE id_venta = ?", [id_venta]);
    return this.get(id_venta);
  },

  async anular(id_venta: number) {
    await db.query("UPDATE ventas SET estado = 'ANULADA' WHERE id_venta = ?", [id_venta]);
    return this.get(id_venta);
  }
};
