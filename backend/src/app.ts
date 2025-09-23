import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes"; 

dotenv.config();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
}));

app.use(express.json());

app.use("/api", routes);

app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not Found" });
});

export default app;
