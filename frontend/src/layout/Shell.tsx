import { Link, NavLink, Outlet } from "react-router-dom";

const link = "px-3 py-2 rounded hover:bg-gray-200";
const active = ({isActive}:{isActive:boolean}) => isActive ? `${link} bg-gray-300` : link;

export default function Shell(){
    return (
        <div className="min-h-screen">
        <header style={{borderBottom:'1px solid #e5e7eb', background:'#fff'}}>
            <nav className="max-w-6xl mx-auto p-3 flex gap-3 items-center">
            <Link to="/" className="font-bold">POS</Link>
            <NavLink to="/clientes" className={active}>Clientes</NavLink>
            <NavLink to="/productos" className={active}>Productos</NavLink>
            <NavLink to="/ventas" className={active}>Ventas</NavLink>
            <NavLink to="/ventas/nueva" className={active}>Nueva venta</NavLink>
            </nav>
        </header>
        <main className="max-w-6xl mx-auto p-4">
            <Outlet />
        </main>
        </div>
    );
}
