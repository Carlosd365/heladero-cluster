import { Router } from "express";
import * as productController from "../controllers/productController";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/search", productController.getProductsByName);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct)
router.put("/:id", productController.updateProductById)
router.delete("/:id", productController.deleleProductById)

export default router;
