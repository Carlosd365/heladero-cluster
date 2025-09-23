import { Request, Response } from "express";
import { VentasService } from "../services/ventas.service";

export const list = async (_req: Request, res: Response) => {
  res.json(await VentasService.list());
};

export const get = async (req: Request, res: Response) => {
  const venta = await VentasService.get(Number(req.params.id));
  if (!venta) return res.status(404).json({ error: "Venta no encontrada" });
  res.json(venta);
};

export const crearVenta = async (req: Request, res: Response) => {
  try {
    console.log("📥 [Ventas] Creando venta con body:", req.body);
    const v = await VentasService.crearVenta(req.body);
    console.log("✅ [Ventas] Venta creada con id:", v?.id_venta);
    res.status(201).json(v);
  } catch (error) {
    console.error("❌ [Ventas] Error al crear venta:", error);
    res.status(500).json({ error: "Error al crear venta" });
  }
};

export const agregarDetalle = async (req: Request, res: Response) => {
  const venta = await VentasService.agregarDetalle(Number(req.params.id), req.body);
  res.status(201).json(venta);
};

export const eliminarDetalle = async (req: Request, res: Response) => {
  const venta = await VentasService.eliminarDetalle(
    Number(req.params.id),
    Number(req.params.id_detalle)
  );
  res.json(venta);
};

export const pagar = async (req: Request, res: Response) => {
  const venta = await VentasService.pagar(Number(req.params.id));
  res.json(venta);
};

export const anular = async (req: Request, res: Response) => {
  const venta = await VentasService.anular(Number(req.params.id));
  res.json(venta);
};
