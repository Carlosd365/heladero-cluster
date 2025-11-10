import { Request, Response } from "express";
import { VentasService } from "../services/ventas.service";

export const list = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;
    const ventas = await VentasService.list({
      from: from as string | undefined,
      to: to as string | undefined,
    });
    res.json(ventas);
  } catch (error) {
    console.error("❌ [Ventas] Error al listar ventas:", error);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
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
  try {
    const venta = await VentasService.agregarDetalle(Number(req.params.id), req.body);
    res.status(201).json(venta);
  } catch (err: any) {
    const msg = String(err?.message || err);
    const code = msg.includes("Stock insuficiente") ? 409 : 400;
    res.status(code).json({ message: msg });
  }
};

export const eliminarDetalle = async (req: Request, res: Response) => {
  const venta = await VentasService.eliminarDetalle(
    Number(req.params.id),
    Number(req.params.id_detalle)
  );
  res.json(venta);
};

export const pagar = async (req: Request, res: Response) => {
  try {
    const v = await VentasService.pagar(Number(req.params.id));
    res.json(v);
  } catch (e:any) {
    const msg = e?.message || "Error al pagar";
    const code = msg.includes("No hay detalles") ? 409 : 500;
    res.status(code).json({ message: msg });
  }
};

export const anular = async (req: Request, res: Response) => {
  const venta = await VentasService.anular(Number(req.params.id));
  res.json(venta);
};
