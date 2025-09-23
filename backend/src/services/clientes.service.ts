import { db } from "../config/db";

export type Cliente = {
  id_cliente?: number;
  nombres: string;
  apellidos: string;
  telefono?: string | null;
  email?: string | null;
};

export const ClientesService = {
  async list() {
    const [rows] = await db.query("SELECT * FROM clientes ORDER BY id_cliente DESC");
    return rows as any[];
  },

  async get(id: number) {
    const [rows] = await db.query("SELECT * FROM clientes WHERE id_cliente = ?", [id]);
    return (rows as any[])[0] || null;
  },

  async create(data: Cliente) {
    const { nombres, apellidos, telefono, email } = data;
    const [res] = await db.query(
      "INSERT INTO clientes (nombres, apellidos, telefono, email) VALUES (?, ?, ?, ?)",
      [nombres, apellidos, telefono ?? null, email ?? null]
    );
    const id = (res as any).insertId as number;
    return this.get(id);
  },

  async update(id: number, data: Partial<Cliente>) {
    const fields = ["nombres", "apellidos", "telefono", "email"] as const;
    const sets: string[] = [];
    const vals: any[] = [];
    for (const f of fields) {
      if (f in data) {
        sets.push(`${f} = ?`);
        // @ts-ignore
        vals.push(data[f]);
      }
    }
    if (!sets.length) return this.get(id);
    await db.query(`UPDATE clientes SET ${sets.join(", ")} WHERE id_cliente = ?`, [...vals, id]);
    return this.get(id);
  },

  async remove(id: number) {
    const [res] = await db.query("DELETE FROM clientes WHERE id_cliente = ?", [id]);
    return (res as any).affectedRows > 0;
  }
};
