import { db } from "../config/db";

export type DetalleVenta = {
  id_detalle_venta?: number;
  id_venta: number;
  id_producto: number;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;        
};

async function recalcularTotales(conn: any, id_venta: number) {
  const [rows] = await conn.query(
    "SELECT COALESCE(SUM(subtotal),0) AS sub FROM detalle_venta WHERE id_venta = ?",
    [id_venta]
  );
  const sub = (rows as any[])[0].sub as number;
  await conn.query(
    "UPDATE ventas SET subtotal = ?, total = ? WHERE id_venta = ?",
    [sub, sub, id_venta]
  );
}

export const DetalleVentasService = {
  async list() {
    const [rows] = await db.query(
      "SELECT * FROM detalle_venta ORDER BY id_detalle_venta DESC"
    );
    return rows as any[];
  },

  async get(id: number) {
    const [rows] = await db.query(
      "SELECT * FROM detalle_venta WHERE id_detalle_venta = ?",
      [id]
    );
    return (rows as any[])[0] || null;
  },

  async create(data: DetalleVenta) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      let precioUnit = data.precio_unitario;
      if (precioUnit == null) {
        const [p] = await conn.query(
          "SELECT precio FROM productos WHERE id_producto = ?",
          [data.id_producto]
        );
        const prod = (p as any[])[0];
        if (!prod) throw new Error("Producto no existe");
        precioUnit = Number(prod.precio);
      }

      const [s] = await conn.query(
        "SELECT stock FROM productos WHERE id_producto = ? FOR UPDATE",
        [data.id_producto]
      );
      const stockActual = (s as any[])[0]?.stock as number | undefined;
      if (stockActual == null) throw new Error("Producto no existe");
      if (stockActual < data.cantidad) throw new Error("Stock insuficiente");

      const subtotal = data.cantidad * precioUnit;

      // Insertar detalle
      const [res] = await conn.query(
        `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)`,
        [data.id_venta, data.id_producto, data.cantidad, precioUnit, subtotal]
      );
      const id = (res as any).insertId as number;

      // Descontar stock
      await conn.query(
        "UPDATE productos SET stock = stock - ? WHERE id_producto = ?",
        [data.cantidad, data.id_producto]
      );

      await recalcularTotales(conn, data.id_venta);

      await conn.commit();
      conn.release();
      return this.get(id);
    } catch (e) {
      await conn.rollback();
      conn.release();
      throw e;
    }
  },

  async remove(id: number) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [dRows] = await conn.query(
        "SELECT id_venta, id_producto, cantidad FROM detalle_venta WHERE id_detalle_venta = ? FOR UPDATE",
        [id]
      );
      const det = (dRows as any[])[0];
      if (!det) {
        await conn.rollback();
        conn.release();
        return false;
      }

      const [res] = await conn.query(
        "DELETE FROM detalle_venta WHERE id_detalle_venta = ?",
        [id]
      );
      const ok = (res as any).affectedRows > 0;

      if (ok) {
        await conn.query(
          "UPDATE productos SET stock = stock + ? WHERE id_producto = ?",
          [det.cantidad, det.id_producto]
        );

        await recalcularTotales(conn, det.id_venta);
      }

      await conn.commit();
      conn.release();
      return ok;
    } catch (e) {
      await conn.rollback();
      conn.release();
      throw e;
    }
  }
};
