import express from "express";
import cors from "cors";
import { requestLogger } from "./middlewares/logger";
import clientRoutes from "./routes/clientRoutes";

const app = express();

app.use(express.json());
app.use(cors());

app.use(requestLogger); 

app.use("/api/clients", clientRoutes);

export default app;
