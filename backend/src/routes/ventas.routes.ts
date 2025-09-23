import { Router } from "express";
import * as ctrl from "../controllers/ventas.controller";
const router = Router();

// ventas
router.get("/", ctrl.list);
router.get("/:id", ctrl.get);
router.post("/", ctrl.crearVenta);                // body: { id_cliente?, metodo_pago? }
router.put("/:id/pagar", ctrl.pagar);
router.put("/:id/anular", ctrl.anular);

// detalle de venta
router.post("/:id/detalle", ctrl.agregarDetalle); // body: { id_producto, cantidad, precio_unitario }
router.delete("/:id/detalle/:id_detalle", ctrl.eliminarDetalle);

export default router;
