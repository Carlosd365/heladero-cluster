import { Link, NavLink, Outlet } from "react-router-dom";
import "./Shell.css";

export default function Shell() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="app-header">
                <nav className="app-nav">
                    <Link to="/" className="app-logo">POS</Link>
                    <div className="app-links">
                        <NavLink to="/clientes" className="app-link">Clientes</NavLink>
                        <NavLink to="/productos" className="app-link">Productos</NavLink>
                        <NavLink to="/ventas" className="app-link">Ventas</NavLink>
                        <NavLink to="/ventas/nueva" className="app-link">Nueva venta</NavLink>
                    </div>
                </nav>
            </header>
            <main className="max-w-6xl mx-auto p-4 pt-20">
                <Outlet />
            </main>
        </div>
    );
}
