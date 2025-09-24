import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Shell from "../layout/Shell";
import Dashboard from "../pages/Dashboard";
import Clientes from "../pages/Clientes";
import Productos from "../pages/Productos";
import Ventas from "../pages/Ventas";
import NuevaVenta from "../pages/NuevaVenta";

const router = createBrowserRouter([
    { path: "/", element: <Shell />, children: [
        { index: true, element: <Dashboard /> },
        { path: "clientes", element: <Clientes /> },
        { path: "productos", element: <Productos /> },
        { path: "ventas", element: <Ventas /> },
        { path: "ventas/nueva", element: <NuevaVenta /> },
    ]},
]);

export default function AppRouter(){ return <RouterProvider router={router} />; }
