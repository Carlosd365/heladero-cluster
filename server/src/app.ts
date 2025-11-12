import express from "express";
import cors from "cors";
import { requestLogger } from "./middlewares/logger";
import clientRoutes from "./routes/clientRoutes";
import productRoutes from "./routes/productRoutes";

const app = express();

app.use(express.json());

app.use(cors({
    origin: [process.env.CLIENT_URL!],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(requestLogger); 

app.use("/api/clients", clientRoutes);
app.use("/api/products", productRoutes);


export default app;