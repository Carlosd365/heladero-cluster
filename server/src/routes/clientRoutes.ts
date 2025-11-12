import { Router } from "express";
import * as clientController from "../controllers/clientController";

const router = Router();

router.get("/", clientController.getAllClients);
router.get("/search", clientController.getClientsByName);
router.get("/:id", clientController.getClientById);
router.post("/", clientController.createClient)
router.put("/:id", clientController.updateClientById)
router.delete("/:id", clientController.deleteClientById)

export default router;
