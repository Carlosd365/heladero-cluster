import "./Dashboard.css";
export default function Dashboard() {
    return (
        <section className="dashboard">
            <div className="dashboard-card">
                <a href="/ventas"><img src="../../../public/LogoHeladeriaSFL.png"/></a>
                <h1 className="dashboard-titulo">¡Hola, bienvenido!</h1>
                <p className="dashboard-texto">
                    Usa el menú superior para comenzar a navegar por el sistema.
                </p>
            </div>
        </section>
    );
}
