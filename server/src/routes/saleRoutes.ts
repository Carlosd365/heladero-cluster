import { Router } from "express";
import * as saleController from "../controllers/saleController";

const router = Router();

router.get("/", saleController.getAllSales);
router.get("/date", saleController.getAllSalesByDate);
router.get("/:id", saleController.getSaleById);
router.get("/search", saleController.getSalesByClientName);
router.post("/", saleController.createSale)
router.delete("/:id", saleController.deletedSaleById)

export default router;
