import { Request, Response } from "express";
import { ProductosService } from "../services/productos.service";

export const list = async (_req: Request, res: Response) => {
  try {
    console.log("📥 [Productos] Listando productos...");
    const data = await ProductosService.list();
    console.log("✅ [Productos] Total productos:", data.length);
    res.json(data);
  } catch (error) {
    console.error("❌ [Productos] Error al listar:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const get = async (req: Request, res: Response) => {
  const item = await ProductosService.get(Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(item);
};

export const create = async (req: Request, res: Response) => {
  const item = await ProductosService.create(req.body);
  res.status(201).json(item);
};

export const update = async (req: Request, res: Response) => {
  const item = await ProductosService.update(Number(req.params.id), req.body);
  res.json(item);
};

export const remove = async (req: Request, res: Response) => {
  const ok = await ProductosService.remove(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "Producto no encontrado" });
  res.status(204).send();
};
