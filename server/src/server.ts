import app from "./app";
import { connectDB } from "./config/db";
import "./config/env";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
});

