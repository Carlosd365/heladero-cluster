import { db } from "../config/db";

export type Producto = {
  id_producto?: number;
  nombre: string;
  precio: number;
  stock?: number;
  activo?: number;
};

export const ProductosService = {
  async list(search = "", activo?: number) {
  let sql = "SELECT * FROM productos";
  const params: any[] = [];

  const conditions: string[] = [];
  if (search) {
    conditions.push("(nombre LIKE ?)");
    params.push(`%${search}%`);
  }
  if (typeof activo === "number") {
    conditions.push("activo = ?");
    params.push(activo);
  }

  if (conditions.length) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY id_producto DESC";

  const [rows] = await db.query(sql, params);
  return rows as any[];
},

  async get(id: number) {
    const [rows] = await db.query("SELECT * FROM productos WHERE id_producto = ?", [id]);
    return (rows as any[])[0] || null;
  },

  async create(data: Producto) {
    const { nombre, precio, stock = 0, activo = 1 } = data;
    const [res] = await db.query(
      "INSERT INTO productos (nombre, precio, stock, activo) VALUES (?, ?, ?, ?)",
      [nombre, precio, stock, activo]
    );
    const id = (res as any).insertId as number;
    return this.get(id);
  },

  async update(id: number, data: Partial<Producto>) {
    const fields = ["nombre", "precio", "stock", "activo"] as const;
    const sets: string[] = [];
    const vals: any[] = [];
    for (const f of fields) {
      if (f in data) {
        sets.push(`${f} = ?`);
        vals.push(data[f]);
      }
    }
    if (!sets.length) return this.get(id);
    await db.query(`UPDATE productos SET ${sets.join(", ")} WHERE id_producto = ?`, [...vals, id]);
    return this.get(id);
  },

  async remove(id: number) {
    const [res] = await db.query("DELETE FROM productos WHERE id_producto = ?", [id]);
    return (res as any).affectedRows > 0;
  }
};
