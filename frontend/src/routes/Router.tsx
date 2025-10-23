import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Shell from "../layout/Shell";
import Dashboard from "../pages/Dashboard/Dashboard";
import Clientes from "../pages/Clientes/Clientes";
import Productos from "../pages/Productos/Productos";
import Ventas from "../pages/Ventas/Ventas";
import NuevaVenta from "../pages/NuevaVenta/NuevaVenta";
import NuevoProducto from "../pages/NuevoProducto/NuevoProducto";
import NuevoCliente from "../pages/NuevoCliente/NuevoCliente";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Shell />,
        children: [
        { index: true, element: <Dashboard /> },
        { path: "clientes", element: <Clientes /> },
        { path: "clientes/nuevo", element: <NuevoCliente /> },
        { path: "productos", element: <Productos /> },
        { path: "productos/nuevo", element: <NuevoProducto /> },
        { path: "ventas", element: <Ventas /> },
        { path: "ventas/nueva", element: <NuevaVenta /> },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
