import { Router } from "express";
import clientes from "./clientes.routes";
import productos from "./productos.routes";
import ventas from "./ventas.routes";

const router = Router();
router.use("/clientes", clientes);
router.use("/productos", productos);
router.use("/ventas", ventas);

export default router;
