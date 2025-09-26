import { Request, Response } from "express";
import { ClientesService } from "../services/clientes.service";

export const list = async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search ?? "").trim();
    const data = await ClientesService.list(search);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};


export const get = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    console.log(`📥 [Clientes] Buscando cliente id=${id}`);
    const item = await ClientesService.get(id);
    if (!item) {
      console.warn(`⚠️ [Clientes] Cliente id=${id} no encontrado`);
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    console.log(`✅ [Clientes] Cliente id=${id} encontrado`);
    res.json(item);
  } catch (error) {
    console.error("❌ [Clientes] Error al obtener:", error);
    res.status(500).json({ error: "Error al obtener cliente" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    console.log("📥 [Clientes] Creando cliente con body:", req.body);
    const item = await ClientesService.create(req.body);
    console.log("✅ [Clientes] Cliente creado con id:", item?.id_cliente);
    res.status(201).json(item);
  } catch (error) {
    console.error("❌ [Clientes] Error al crear:", error);
    res.status(500).json({ error: "Error al crear cliente" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    console.log(`📥 [Clientes] Actualizando cliente id=${id}`, req.body);
    const item = await ClientesService.update(id, req.body);
    console.log(`✅ [Clientes] Cliente id=${id} actualizado`);
    res.json(item);
  } catch (error) {
    console.error("❌ [Clientes] Error al actualizar:", error);
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    console.log(`📥 [Clientes] Eliminando cliente id=${id}`);
    const ok = await ClientesService.remove(id);
    if (!ok) {
      console.warn(`⚠️ [Clientes] Cliente id=${id} no encontrado para eliminar`);
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    console.log(`✅ [Clientes] Cliente id=${id} eliminado`);
    res.status(204).send();
  } catch (error) {
    console.error("❌ [Clientes] Error al eliminar:", error);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
};
