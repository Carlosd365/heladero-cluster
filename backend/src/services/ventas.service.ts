import { db } from "../config/db";

export type NuevaVenta = {
  id_cliente?: number | null;
  metodo_pago?: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "QR";
  nota?: string;
};

export type Detalle = {
  id_producto: number;
  cantidad: number;
  precio_unitario?: number;
};

async function recalcularTotalesConn(conn: any, id_venta: number) {
  const [rows] = await conn.query(
    "SELECT COALESCE(SUM(cantidad * precio_unitario),0) AS sub FROM detalle_venta WHERE id_venta = ?",
    [id_venta]
  );
  const sub = Number((rows as any[])[0]?.sub ?? 0);
  await conn.query("UPDATE ventas SET subtotal = ?, total = ? WHERE id_venta = ?", [sub, sub, id_venta]);
}

export const VentasService = {
  async list() {
  const [rows] = await db.query(
    `SELECT
      v.*,
      CONCAT(c.nombres,' ',c.apellidos) AS cliente,
      COUNT(dv.id_detalle_venta) AS n_detalles
    FROM ventas v
    LEFT JOIN clientes c      ON c.id_cliente = v.id_cliente
    LEFT JOIN detalle_venta dv ON dv.id_venta  = v.id_venta
    GROUP BY v.id_venta
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
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [prods]: any = await conn.query(
        "SELECT id_producto, precio, stock FROM productos WHERE id_producto = ? FOR UPDATE",
        [d.id_producto]
      );
      const prod = prods?.[0];
      if (!prod) throw new Error("Producto no existe");

      const cantidad = Number(d.cantidad);
      const precio_unitario = d.precio_unitario != null ? Number(d.precio_unitario) : Number(prod.precio);
      if (!Number.isFinite(cantidad) || cantidad <= 0) throw new Error("Cantidad inválida");
      if (Number(prod.stock) < cantidad) throw new Error("Stock insuficiente");

      await conn.query(
        `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?);`,
        [id_venta, d.id_producto, cantidad, precio_unitario, cantidad * precio_unitario]
      );

      await conn.query("UPDATE productos SET stock = stock - ? WHERE id_producto = ?", [
        cantidad,
        d.id_producto,
      ]);

      await recalcularTotalesConn(conn, id_venta);

      await conn.commit();
      return this.get(id_venta);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async eliminarDetalle(id_venta: number, id_detalle_venta: number) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [detRows]: any = await conn.query(
        "SELECT id_producto, cantidad FROM detalle_venta WHERE id_detalle_venta = ? AND id_venta = ? FOR UPDATE",
        [id_detalle_venta, id_venta]
      );
      const det = detRows?.[0];
      if (!det) {
        await conn.rollback();
        return this.get(id_venta);
      }

      await conn.query("DELETE FROM detalle_venta WHERE id_detalle_venta = ? AND id_venta = ?", [
        id_detalle_venta,
        id_venta,
      ]);

      await conn.query("UPDATE productos SET stock = stock + ? WHERE id_producto = ?", [
        det.cantidad,
        det.id_producto,
      ]);

      await recalcularTotalesConn(conn, id_venta);

      await conn.commit();
      return this.get(id_venta);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async pagar(id_venta: number) {
    const [r]: any = await db.query(
      "SELECT COUNT(*) AS n FROM detalle_venta WHERE id_venta = ?",
      [id_venta]
    );
    if (Number(r[0]?.n ?? 0) === 0) {
      throw new Error("No hay detalles para pagar");
    }
    await db.query(
      `UPDATE ventas
        SET subtotal = (SELECT COALESCE(SUM(cantidad*precio_unitario),0) FROM detalle_venta WHERE id_venta=?),
          total    = (SELECT COALESCE(SUM(cantidad*precio_unitario),0) FROM detalle_venta WHERE id_venta=?),
          estado   = 'PAGADA'
      WHERE id_venta=? AND estado='ABIERTA'`,
      [id_venta, id_venta, id_venta]
    );
    return this.get(id_venta);
},

  async anular(id_venta: number) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [detRows]: any = await conn.query(
        "SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta = ? FOR UPDATE",
        [id_venta]
      );
      for (const d of detRows) {
        await conn.query("UPDATE productos SET stock = stock + ? WHERE id_producto = ?", [
          d.cantidad,
          d.id_producto,
        ]);
      }

      await conn.query("UPDATE ventas SET estado = 'ANULADA' WHERE id_venta = ?", [id_venta]);

      await conn.commit();
      return this.get(id_venta);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};
