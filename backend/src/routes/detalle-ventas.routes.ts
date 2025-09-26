import { Router } from "express";
import { DetalleVentasController } from "../controllers/detalle-ventas.controller";

const router = Router();

router.get("/", DetalleVentasController.list);
router.get("/:id", DetalleVentasController.get);
router.post("/", DetalleVentasController.create);
router.delete("/:id", DetalleVentasController.remove);

export default router;
