import { Request, Response } from "express";
import { DetalleVentasService } from "../services/detalle-ventas.service";

export const DetalleVentasController = {
  async list(_req: Request, res: Response) {
    try {
      const data = await DetalleVentasService.list();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error al listar detalle_venta", error: String(err) });
    }
  },

  async get(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const item = await DetalleVentasService.get(id);
      if (!item) return res.status(404).json({ message: "Detalle no encontrado" });
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: "Error al obtener detalle_venta", error: String(err) });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const nuevo = await DetalleVentasService.create(req.body);
      res.status(201).json(nuevo);
    } catch (err: any) {
      const msg = String(err?.message || err);
      const code = msg.includes("Stock insuficiente") ? 409 : 500;
      res.status(code).json({ message: "Error al crear detalle_venta", error: msg });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const ok = await DetalleVentasService.remove(id);
      if (!ok) return res.status(404).json({ message: "Detalle no encontrado" });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Error al eliminar detalle_venta", error: String(err) });
    }
  }
};
